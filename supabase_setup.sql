-- ============================================================
-- BRSCIENCE — Script de criação do banco no Supabase
-- Execute este SQL no Supabase: SQL Editor → New Query → Run
-- ============================================================
-- ─── 1. LINHAS DE PRODUTO ────────────────────────────────────────────────────
create table
    if not exists product_lines (
        id bigint generated always as identity primary key,
        name text not null unique,
        color text not null default '#3b82f6'
    );

-- Linhas iniciais
insert into
    product_lines (name, color)
values
    ('Fusion Frizz', '#6b8cff'),
    ('Amazon Forest', '#4fae7a'),
    ('Sem Pausa', '#d6c36a'),
    ('Revita Liss', '#c084fc'),
    ('Baldes', '#f39200') on conflict (name) do nothing;

-- ─── 2. PRODUTOS ─────────────────────────────────────────────────────────────
create table
    if not exists products (
        id bigint generated always as identity primary key,
        name text not null,
        line text not null references product_lines (name) on update cascade on delete restrict,
        code text not null unique,
        ncm text default '',
        cest text default '',
        anvisa text default '',
        distributor_price text default '',
        price text not null default '0,00',
        image_url text default '',
        discount_percentage integer default null,
        color text default null,
        sort_order integer not null default 0,
        created_at timestamptz default now ()
    );

create index if not exists products_line_idx on products (line);

create index if not exists products_sort_idx on products (line, sort_order);

-- ─── 3. BANNERS ──────────────────────────────────────────────────────────────
create table
    if not exists banners (
        id uuid primary key default gen_random_uuid (),
        title text not null,
        image_url text not null,
        mobile_image_url text default null,
        link text default null,
        "order" integer not null default 0,
        active boolean not null default true,
        created_at timestamptz default now ()
    );

create index if not exists banners_order_idx on banners ("order");

-- ─── 4. ROW LEVEL SECURITY (RLS) ─────────────────────────────────────────────
-- Leitura pública (catálogo visível para todos)
alter table product_lines enable row level security;

alter table products enable row level security;

alter table banners enable row level security;

create policy "leitura publica - linhas" on product_lines for
select
    using (true);

create policy "leitura publica - produtos" on products for
select
    using (true);

create policy "leitura publica - banners" on banners for
select
    using (true);

-- Escrita apenas com a chave anon (admin autenticado pelo login do próprio app)
-- Se quiser restringir ainda mais no futuro, troque por autenticação de usuário Supabase.
create policy "escrita anon - linhas" on product_lines for all using (true)
with
    check (true);

create policy "escrita anon - produtos" on products for all using (true)
with
    check (true);

create policy "escrita anon - banners" on banners for all using (true)
with
    check (true);

-- ─── 5. STORAGE (buckets para imagens) ───────────────────────────────────────
-- Execute separado no Supabase: Storage → New Bucket
-- Ou rode via SQL abaixo:
insert into
    storage.buckets (id, name, public)
values
    ('products', 'products', true) on conflict (id) do nothing;

insert into
    storage.buckets (id, name, public)
values
    ('banners', 'banners', true) on conflict (id) do nothing;

-- Política de leitura pública nos buckets
create policy "imagens publicas - products" on storage.objects for
select
    using (bucket_id = 'products');

create policy "imagens publicas - banners" on storage.objects for
select
    using (bucket_id = 'banners');

-- Política de upload para a chave anon
create policy "upload anon - products" on storage.objects for insert
with
    check (bucket_id = 'products');

create policy "upload anon - banners" on storage.objects for insert
with
    check (bucket_id = 'banners');