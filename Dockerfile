# ===== BUILD =====
FROM node:20-bookworm-slim AS build

WORKDIR /app

# deps de build (evita dor no Vite/Rollup)
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 make g++ ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# cache manifests
COPY package.json ./
COPY package-lock.json* pnpm-lock.yaml* yarn.lock* ./

RUN set -eux; \
    if [ -f pnpm-lock.yaml ]; then \
        corepack enable && corepack prepare pnpm@9 --activate; \
        pnpm install --frozen-lockfile; \
    elif [ -f yarn.lock ]; then \
        corepack enable; \
        yarn install --frozen-lockfile; \
    elif [ -f package-lock.json ]; then \
        npm ci; \
    else \
        npm install; \
    fi

# código
COPY . .

# não depender de build anterior
RUN rm -rf dist node_modules/.vite || true

# build-args (Vite exige prefixo VITE_)
ARG VITE_API_URL
ARG VITE_APP_NAME

# garante disponível também como ENV durante o build
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_APP_NAME=${VITE_APP_NAME}

# gera .env com todas as variáveis usadas no build
RUN set -eux; \
    echo "== DEBUG: valor dos ARGs =="; \
    echo "VITE_API_URL='$VITE_API_URL'"; \
    echo "VITE_APP_NAME='$VITE_APP_NAME'"; \
    test -n "$VITE_API_URL"; \
    { \
        printf "VITE_API_URL=%s\n" "$VITE_API_URL"; \
        printf "VITE_APP_NAME=%s\n" "$VITE_APP_NAME"; \
    } > .env; \
    echo "== DEBUG: conteúdo do .env =="; \
    cat .env

# build (Vue/Vite gera /dist)
RUN npm run build

# ===== RUN =====
FROM nginx:1.27-alpine

# Config do nginx (SPA fallback)
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# remove default site
RUN rm -rf /usr/share/nginx/html/*

# copia site final (dist)
COPY --from=build /app/dist/ /usr/share/nginx/html/

# valida config
RUN nginx -t

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
