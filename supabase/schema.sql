-- ============================================================================
-- SowCha — complete Supabase schema
--
-- Run this on a fresh Supabase project (SQL Editor) to recreate the whole
-- backend: CMS content, commerce, orders, storage and row level security.
--
-- After running:
--   1. Put your project URL + publishable key in .env.local
--   2. Insert your admin email into public.admin_emails
--   3. Sign up at /admin/login with that email
-- ============================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------- helpers --

create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end; $$;

-- Allowlist of admin emails. Signing up alone grants nothing; every write
-- policy checks membership here.
create table if not exists public.admin_emails (
  email      text primary key,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.admin_emails a
    where lower(a.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

comment on function public.is_admin() is
  'Returns whether the CALLER is an allowlisted admin. Executable by anon because public read policies evaluate it.';

-- Allowlisted admins skip the confirmation email round trip.
create or replace function public.auto_confirm_admin()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.email is not null and exists (
       select 1 from public.admin_emails a where lower(a.email) = lower(new.email))
  then
    new.email_confirmed_at := coalesce(new.email_confirmed_at, now());
  end if;
  return new;
end; $$;

drop trigger if exists auto_confirm_admin_trigger on auth.users;
create trigger auto_confirm_admin_trigger
  before insert on auth.users
  for each row execute function public.auto_confirm_admin();

revoke execute on function public.auto_confirm_admin() from anon, authenticated, public;

-- ------------------------------------------------------------- site copy --

create table if not exists public.site_settings (
  id smallint primary key default 1 check (id = 1),
  brand_name text not null default 'SowCha',
  tagline    text not null default 'Luxury in Simplicity',
  short_about text not null default '',
  about_intro text not null default '',
  about_body  text not null default '',
  mission     text not null default '',
  vision      text not null default '',
  founder_note text not null default '',
  founder_name text not null default '',
  about_image_url   text,
  about_image_2_url text,
  phone text not null default '',
  phone_href text not null default '',
  email text not null default '',
  instagram_url text not null default '',
  instagram_handle text not null default '',
  linkedin_url text not null default '',
  location text not null default '',
  maps_url text not null default '',
  hours jsonb not null default '[]'::jsonb,
  brand_values jsonb not null default '[]'::jsonb,
  timeline jsonb not null default '[]'::jsonb,
  marquee_words jsonb not null default '[]'::jsonb,
  -- commerce settings
  shipping_flat_cents           integer not null default 9900,
  free_shipping_threshold_cents integer not null default 500000,
  cod_enabled                   boolean not null default true,
  bank_transfer_enabled         boolean not null default true,
  bank_transfer_note            text    not null default '',
  updated_at timestamptz not null default now()
);
create trigger site_settings_updated_at before update on public.site_settings
  for each row execute function public.set_updated_at();

create table if not exists public.section_copy (
  key text primary key,
  eyebrow text not null default '',
  title text not null default '',
  accent_words text[] not null default '{}',
  subtitle text not null default '',
  updated_at timestamptz not null default now()
);
create trigger section_copy_updated_at before update on public.section_copy
  for each row execute function public.set_updated_at();

create table if not exists public.media (
  id uuid primary key default gen_random_uuid(),
  path text not null unique,
  public_url text not null,
  alt text not null default '',
  size_bytes bigint,
  created_at timestamptz not null default now()
);

-- -------------------------------------------------------------- products --
-- Money is stored as integer minor units (paise): exact in Postgres and in
-- JavaScript, with no float or numeric-as-string surprises.

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  collection text not null default '',
  description text not null default '',
  detail text not null default '',
  materials text[] not null default '{}',
  care text not null default '',
  art_variant text not null default 'anarkali',
  image_url text,
  price_cents            integer not null default 0 check (price_cents >= 0),
  compare_at_price_cents integer,
  currency text not null default 'INR',
  sku text,
  stock integer not null default 0 check (stock >= 0),
  track_inventory boolean not null default true,
  is_featured boolean not null default false,
  sort_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger products_updated_at before update on public.products
  for each row execute function public.set_updated_at();

create table if not exists public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  size text not null default '',
  color text not null default '',
  sku text,
  price_cents integer check (price_cents is null or price_cents >= 0),
  stock integer not null default 0 check (stock >= 0),
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger product_variants_updated_at before update on public.product_variants
  for each row execute function public.set_updated_at();
create index if not exists product_variants_product_idx on public.product_variants (product_id, sort_order);

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  url text not null,
  alt text not null default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists product_images_product_idx on public.product_images (product_id, sort_order);

-- --------------------------------------------------- other CMS collections --

create table if not exists public.capsules (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique, title text not null,
  kicker text not null default '', body text not null default '',
  art_variant text not null default 'folds', image_url text,
  sort_order int not null default 0, is_published boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create trigger capsules_updated_at before update on public.capsules for each row execute function public.set_updated_at();

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  title text not null, body text not null default '',
  art_variant text not null default 'folds', image_url text,
  sort_order int not null default 0, is_published boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create trigger categories_updated_at before update on public.categories for each row execute function public.set_updated_at();

create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  caption text not null default '',
  size text not null default 'square' check (size in ('square','tall','wide')),
  art_variant text not null default 'sprig', image_url text,
  sort_order int not null default 0, is_published boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create trigger gallery_items_updated_at before update on public.gallery_items for each row execute function public.set_updated_at();

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique, title text not null,
  excerpt text not null default '', category text not null default 'Craft',
  published_at date not null default current_date,
  reading_time text not null default '5 min',
  art_variant text not null default 'sprig', image_url text,
  body jsonb not null default '[]'::jsonb,
  is_published boolean not null default true, sort_order int not null default 0,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create trigger posts_updated_at before update on public.posts for each row execute function public.set_updated_at();

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null, place text not null default '', quote text not null,
  sort_order int not null default 0, is_published boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create trigger testimonials_updated_at before update on public.testimonials for each row execute function public.set_updated_at();

create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null, answer text not null,
  sort_order int not null default 0, is_published boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create trigger faqs_updated_at before update on public.faqs for each row execute function public.set_updated_at();

create table if not exists public.sustainability_points (
  id uuid primary key default gen_random_uuid(),
  title text not null, body text not null default '',
  sort_order int not null default 0, is_published boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create trigger sustainability_points_updated_at before update on public.sustainability_points for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------- orders --

create sequence if not exists public.order_number_seq start 1001;

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null default '',
  address_line1 text not null default '', address_line2 text not null default '',
  city text not null default '', state text not null default '',
  postal_code text not null default '', country text not null default 'India',
  notes text not null default '',
  subtotal_cents integer not null default 0 check (subtotal_cents >= 0),
  shipping_cents integer not null default 0 check (shipping_cents >= 0),
  total_cents    integer not null default 0 check (total_cents    >= 0),
  currency text not null default 'INR',
  payment_method text not null default 'cod' check (payment_method in ('cod','bank_transfer')),
  payment_status text not null default 'unpaid' check (payment_status in ('unpaid','paid','refunded')),
  status text not null default 'pending'
    check (status in ('pending','confirmed','packed','shipped','delivered','cancelled')),
  courier text not null default '', tracking_number text not null default '',
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create trigger orders_updated_at before update on public.orders for each row execute function public.set_updated_at();
create index if not exists orders_created_idx on public.orders (created_at desc);
create index if not exists orders_status_idx on public.orders (status, created_at desc);
create index if not exists orders_lookup_idx on public.orders (order_number, lower(customer_email));

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  variant_id uuid references public.product_variants(id) on delete set null,
  -- snapshots: the order still reads correctly if the product is renamed later
  product_name text not null, variant_label text not null default '', image_url text,
  unit_price_cents integer not null check (unit_price_cents >= 0),
  quantity integer not null check (quantity > 0),
  line_total_cents integer not null check (line_total_cents >= 0),
  created_at timestamptz not null default now()
);
create index if not exists order_items_order_idx on public.order_items (order_id);
create index if not exists order_items_product_idx on public.order_items (product_id);

-- Order numbers carry a random suffix so they cannot be walked sequentially.
create or replace function public.next_order_number()
returns text language sql volatile set search_path = public as $$
  select 'SC-' || to_char(now(),'YYYY') || '-' ||
         lpad(nextval('public.order_number_seq')::text, 4, '0') || '-' ||
         upper(substr(md5(random()::text || clock_timestamp()::text), 1, 4));
$$;
revoke execute on function public.next_order_number() from public, anon, authenticated;

-- ============================================================================
-- place_order() — the only way an order is created.
--
-- The browser sends product ids and quantities ONLY. Every price is read from
-- the database here, so a tampered cart cannot change what is charged. Rows are
-- locked FOR UPDATE so two shoppers cannot oversell the last piece, and the
-- whole thing is a single transaction.
-- ============================================================================
create or replace function public.place_order(
  p_customer jsonb, p_items jsonb, p_payment_method text default 'cod'
) returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_item jsonb; v_product public.products%rowtype; v_variant public.product_variants%rowtype;
  v_qty integer; v_unit integer; v_label text; v_image text;
  v_subtotal integer := 0; v_shipping integer := 0;
  v_order_id uuid; v_order_number text; v_settings public.site_settings%rowtype; v_count integer;
begin
  if p_payment_method not in ('cod','bank_transfer') then raise exception 'Unsupported payment method'; end if;
  if coalesce(p_customer->>'name','') = '' then raise exception 'A name is required'; end if;
  if coalesce(p_customer->>'email','') !~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$' then
    raise exception 'A valid email is required'; end if;

  v_count := jsonb_array_length(coalesce(p_items,'[]'::jsonb));
  if v_count = 0 then raise exception 'Your basket is empty'; end if;
  if v_count > 50 then raise exception 'Too many lines in one order'; end if;

  select * into v_settings from public.site_settings where id = 1;
  v_order_number := public.next_order_number();

  insert into public.orders (
    order_number, customer_name, customer_email, customer_phone,
    address_line1, address_line2, city, state, postal_code, country, notes, payment_method
  ) values (
    v_order_number, left(trim(p_customer->>'name'),120), lower(trim(p_customer->>'email')),
    left(coalesce(p_customer->>'phone',''),40), left(coalesce(p_customer->>'address_line1',''),200),
    left(coalesce(p_customer->>'address_line2',''),200), left(coalesce(p_customer->>'city',''),80),
    left(coalesce(p_customer->>'state',''),80), left(coalesce(p_customer->>'postal_code',''),20),
    left(coalesce(nullif(p_customer->>'country',''),'India'),80), left(coalesce(p_customer->>'notes',''),1000),
    p_payment_method
  ) returning id into v_order_id;

  for v_item in select * from jsonb_array_elements(p_items) loop
    if jsonb_typeof(v_item->'quantity') <> 'number' then raise exception 'Invalid quantity'; end if;
    if (v_item->>'quantity')::numeric <> trunc((v_item->>'quantity')::numeric) then raise exception 'Invalid quantity'; end if;
    v_qty := (v_item->>'quantity')::integer;
    if v_qty <= 0 or v_qty > 20 then raise exception 'Invalid quantity'; end if;

    select * into v_product from public.products
      where id = (v_item->>'product_id')::uuid and is_published for update;
    if not found then raise exception 'A piece in your basket is no longer available'; end if;

    v_unit := v_product.price_cents; v_label := ''; v_image := v_product.image_url;
    if v_unit <= 0 then raise exception 'A piece in your basket is not priced yet'; end if;

    if coalesce(v_item->>'variant_id','') <> '' then
      select * into v_variant from public.product_variants
        where id = (v_item->>'variant_id')::uuid and product_id = v_product.id and is_active for update;
      if not found then raise exception 'That size is no longer available for %', v_product.name; end if;

      v_unit := coalesce(v_variant.price_cents, v_product.price_cents);
      v_label := trim(both ' / ' from concat_ws(' / ', nullif(v_variant.size,''), nullif(v_variant.color,'')));
      if v_variant.stock < v_qty then
        raise exception 'Only % left of % %', v_variant.stock, v_product.name, v_label; end if;
      update public.product_variants set stock = stock - v_qty where id = v_variant.id;
    elsif v_product.track_inventory then
      if v_product.stock < v_qty then raise exception 'Only % left of %', v_product.stock, v_product.name; end if;
      update public.products set stock = stock - v_qty where id = v_product.id;
    end if;

    insert into public.order_items (order_id, product_id, variant_id, product_name, variant_label,
      image_url, unit_price_cents, quantity, line_total_cents)
    values (v_order_id, v_product.id, nullif(v_item->>'variant_id','')::uuid,
      v_product.name, v_label, v_image, v_unit, v_qty, v_unit * v_qty);

    v_subtotal := v_subtotal + (v_unit * v_qty);
  end loop;

  v_shipping := case when v_subtotal >= coalesce(v_settings.free_shipping_threshold_cents,500000)
                     then 0 else coalesce(v_settings.shipping_flat_cents,0) end;

  update public.orders set subtotal_cents = v_subtotal, shipping_cents = v_shipping,
         total_cents = v_subtotal + v_shipping where id = v_order_id;

  return jsonb_build_object('order_number',v_order_number,'subtotal_cents',v_subtotal,
    'shipping_cents',v_shipping,'total_cents',v_subtotal + v_shipping,'currency','INR');
end; $$;

-- Tracking without exposing the orders table. Requires BOTH the order number
-- and the matching email, so numbers alone cannot be enumerated.
create or replace function public.get_order_status(p_order_number text, p_email text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_order public.orders%rowtype; v_items jsonb;
begin
  select * into v_order from public.orders
   where order_number = upper(trim(p_order_number))
     and lower(customer_email) = lower(trim(p_email));
  if not found then return null; end if;

  select coalesce(jsonb_agg(jsonb_build_object(
      'product_name',product_name,'variant_label',variant_label,'image_url',image_url,
      'quantity',quantity,'unit_price_cents',unit_price_cents,'line_total_cents',line_total_cents
    ) order by created_at), '[]'::jsonb)
    into v_items from public.order_items where order_id = v_order.id;

  return jsonb_build_object(
    'order_number',v_order.order_number,'status',v_order.status,
    'payment_status',v_order.payment_status,'payment_method',v_order.payment_method,
    'placed_at',v_order.created_at,'customer_name',v_order.customer_name,'city',v_order.city,
    'courier',v_order.courier,'tracking_number',v_order.tracking_number,
    'subtotal_cents',v_order.subtotal_cents,'shipping_cents',v_order.shipping_cents,
    'total_cents',v_order.total_cents,'items',v_items);
end; $$;

revoke execute on function public.place_order(jsonb,jsonb,text) from public;
grant   execute on function public.place_order(jsonb,jsonb,text) to anon, authenticated;
revoke execute on function public.get_order_status(text,text) from public;
grant   execute on function public.get_order_status(text,text) to anon, authenticated;

-- ============================================================================
-- Row level security
-- Anonymous visitors read published content and nothing else. Writes require an
-- account whose email is in admin_emails. Orders are never read or written
-- directly from the browser — only through the two functions above.
--
-- `(select public.is_admin())` is evaluated once per query rather than per row.
-- ============================================================================

alter table public.admin_emails          enable row level security;
alter table public.site_settings         enable row level security;
alter table public.section_copy          enable row level security;
alter table public.media                 enable row level security;
alter table public.products              enable row level security;
alter table public.product_variants      enable row level security;
alter table public.product_images        enable row level security;
alter table public.capsules              enable row level security;
alter table public.categories            enable row level security;
alter table public.gallery_items         enable row level security;
alter table public.posts                 enable row level security;
alter table public.testimonials          enable row level security;
alter table public.faqs                  enable row level security;
alter table public.sustainability_points enable row level security;
alter table public.orders                enable row level security;
alter table public.order_items           enable row level security;

create policy admin_emails_admin_all on public.admin_emails for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

create policy site_settings_read on public.site_settings for select to anon, authenticated using (true);
create policy site_settings_write on public.site_settings for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

create policy section_copy_read on public.section_copy for select to anon, authenticated using (true);
create policy section_copy_write on public.section_copy for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

create policy media_read on public.media for select to anon, authenticated using (true);
create policy media_write on public.media for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

create policy products_read on public.products for select to anon, authenticated
  using (is_published or (select public.is_admin()));
create policy products_write on public.products for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

create policy product_variants_read on public.product_variants for select to anon, authenticated
  using (is_active or (select public.is_admin()));
create policy product_variants_write on public.product_variants for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

create policy product_images_read on public.product_images for select to anon, authenticated using (true);
create policy product_images_write on public.product_images for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

create policy capsules_read on public.capsules for select to anon, authenticated
  using (is_published or (select public.is_admin()));
create policy capsules_write on public.capsules for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

create policy categories_read on public.categories for select to anon, authenticated
  using (is_published or (select public.is_admin()));
create policy categories_write on public.categories for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

create policy gallery_items_read on public.gallery_items for select to anon, authenticated
  using (is_published or (select public.is_admin()));
create policy gallery_items_write on public.gallery_items for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

create policy posts_read on public.posts for select to anon, authenticated
  using (is_published or (select public.is_admin()));
create policy posts_write on public.posts for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

create policy testimonials_read on public.testimonials for select to anon, authenticated
  using (is_published or (select public.is_admin()));
create policy testimonials_write on public.testimonials for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

create policy faqs_read on public.faqs for select to anon, authenticated
  using (is_published or (select public.is_admin()));
create policy faqs_write on public.faqs for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

create policy sustainability_read on public.sustainability_points for select to anon, authenticated
  using (is_published or (select public.is_admin()));
create policy sustainability_write on public.sustainability_points for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

create policy orders_admin_all on public.orders for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
create policy order_items_admin_all on public.order_items for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

-- ---------------------------------------------------------------- storage --

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media','media',true, 10485760,
        array['image/jpeg','image/png','image/webp','image/avif','image/gif','image/svg+xml'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

create policy "media public read" on storage.objects for select to anon, authenticated
  using (bucket_id = 'media');
create policy "media admin insert" on storage.objects for insert to authenticated
  with check (bucket_id = 'media' and (select public.is_admin()));
create policy "media admin update" on storage.objects for update to authenticated
  using (bucket_id = 'media' and (select public.is_admin()))
  with check (bucket_id = 'media' and (select public.is_admin()));
create policy "media admin delete" on storage.objects for delete to authenticated
  using (bucket_id = 'media' and (select public.is_admin()));

-- ---------------------------------------------------------------- indexes --

create index if not exists products_sort_idx       on public.products (sort_order, created_at);
create index if not exists capsules_sort_idx       on public.capsules (sort_order, created_at);
create index if not exists categories_sort_idx     on public.categories (sort_order, created_at);
create index if not exists gallery_sort_idx        on public.gallery_items (sort_order, created_at);
create index if not exists posts_published_idx     on public.posts (is_published, published_at desc);
create index if not exists testimonials_sort_idx   on public.testimonials (sort_order, created_at);
create index if not exists faqs_sort_idx           on public.faqs (sort_order, created_at);
create index if not exists sustainability_sort_idx on public.sustainability_points (sort_order, created_at);

-- --------------------------------------------------------------- your admin --
-- insert into public.admin_emails (email) values ('you@example.com');
