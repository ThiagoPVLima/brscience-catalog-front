# BRSCIENCE — Catálogo com Back-end

Guia completo para colocar o projeto no ar com banco de dados real e deploy na Vercel.

---

## Stack

| Camada           | Tecnologia              | Custo            |
| ---------------- | ----------------------- | ---------------- |
| Front-end        | Vue 3 + Vite + Tailwind | —                |
| Back-end / Banco | Supabase (PostgreSQL)   | Gratuito         |
| Imagens          | Supabase Storage        | Gratuito até 1GB |
| Hospedagem       | Vercel                  | Gratuito         |

---

## PASSO 1 — Criar conta no Supabase

1. Acesse **https://supabase.com** e clique em **Start for free**
2. Faça login com GitHub
3. Clique em **New Project**, dê um nome (`brscience`), escolha uma senha forte e a região mais próxima
4. Aguarde ~2 minutos até o projeto ficar pronto

---

## PASSO 2 — Criar as tabelas e buckets

1. No painel do Supabase, vá em **SQL Editor → New Query**
2. Cole todo o conteúdo do arquivo `supabase_setup.sql` da raiz do projeto
3. Clique em **Run** — deve aparecer "Success" para cada comando

> Se der erro no bloco do Storage, crie manualmente: **Storage → New Bucket** → `products` (público) e `banners` (público).

---

## PASSO 3 — Pegar as credenciais

1. **Settings → API**
2. Copie o **Project URL** e a chave **anon public**

---

## PASSO 4 — Configurar o .env local

Crie um arquivo `.env` na raiz do projeto:

```
VITE_SUPABASE_URL=https://SEU_ID.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
```

---

## PASSO 5 — Instalar e testar

```bash
npm install
npm run dev
```

Abra http://localhost:5173, entre no admin e cadastre um produto. Recarregue — os dados devem persistir.

---

## PASSO 6 — Subir para o GitHub

```bash
git init
git add .
git commit -m "feat: integração Supabase"
git branch -M main
git remote add origin https://github.com/ThiagoPVLima/NOME_DO_REPO.git
git push -u origin main
```

---

## PASSO 7 — Deploy na Vercel

1. Acesse **https://vercel.com** e faça login com GitHub
2. **Add New → Project** → selecione o repositório
3. Framework: **Vite** (detectado automaticamente)
4. Em **Environment Variables**, adicione:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Clique em **Deploy** — em ~1 minuto o site estará no ar

---

## Arquivos alterados/criados

```
src/lib/supabase.ts          ← cliente Supabase + upload de imagens
src/stores/useProducts.ts    ← lê/salva no banco
src/stores/useProductLines.ts
src/stores/useBanners.ts
src/App.vue                  ← carrega dados ao iniciar
supabase_setup.sql           ← SQL para criar tabelas e buckets
.env.example                 ← modelo do .env
package.json                 ← @supabase/supabase-js adicionado
```

---

## Dúvidas comuns

**Dados somem ao recarregar?** → Verifique o `.env` e se o SQL foi executado.

**Erro 401?** → Confirme que as policies de RLS foram criadas (Authentication → Policies).

**Imagem não aparece?** → Confirme que os buckets existem e estão como **Public**.
