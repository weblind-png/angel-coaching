-- À exécuter APRÈS supabase.sql (SQL Editor). Preuve de signature + accès conditionné au contrat signé.
create table public.contrats_signes(
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade default auth.uid(),
  version text not null,
  nom_signataire text not null,
  representant_legal boolean not null default false,
  signe_le timestamptz not null default now(),
  unique(user_id, version));
alter table public.contrats_signes enable row level security;
create policy "contrat: lecture perso" on public.contrats_signes for select using (auth.uid()=user_id);
create policy "contrat: signature perso" on public.contrats_signes for insert with check (auth.uid()=user_id);
-- pas de update/delete : la signature est conservée comme preuve.
drop policy "suivis: ajout perso" on public.suivis;
create policy "suivis: ajout si contrat signé" on public.suivis for insert with check (
  auth.uid()=user_id and exists(select 1 from public.contrats_signes c where c.user_id=auth.uid() and c.version='v1'));
drop policy "programmes: lecture perso" on public.programmes;
create policy "programmes: lecture si contrat signé" on public.programmes for select using (
  auth.uid()=user_id and exists(select 1 from public.contrats_signes c where c.user_id=auth.uid() and c.version='v1'));
