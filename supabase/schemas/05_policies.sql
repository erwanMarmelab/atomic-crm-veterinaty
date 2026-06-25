--
-- Row Level Security
-- This file declares RLS policies for all tables.
--

-- Enable RLS on all tables
alter table public.animals enable row level security;
alter table public.contacts enable row level security;
alter table public.contact_notes enable row level security;
alter table public.sales enable row level security;
alter table public.configuration enable row level security;
alter table public.favicons_excluded_domains enable row level security;

-- Vaccinations
alter table public.vaccinations enable row level security;
create policy "Enable read access for authenticated users" on public.vaccinations for select to authenticated using (true);
create policy "Enable insert for authenticated users only" on public.vaccinations for insert to authenticated with check (true);
create policy "Enable update for authenticated users only" on public.vaccinations for update to authenticated using (true) with check (true);
create policy "Vaccination Delete Policy" on public.vaccinations for delete to authenticated using (true);

-- Consultations
alter table public.consultations enable row level security;
create policy "Enable read access for authenticated users" on public.consultations for select to authenticated using (true);
create policy "Enable insert for authenticated users only" on public.consultations for insert to authenticated with check (true);
create policy "Enable update for authenticated users only" on public.consultations for update to authenticated using (true) with check (true);
create policy "Consultation Delete Policy" on public.consultations for delete to authenticated using (true);

-- Animals
create policy "Enable read access for authenticated users" on public.animals for select to authenticated using (true);
create policy "Enable insert for authenticated users only" on public.animals for insert to authenticated with check (true);
create policy "Enable update for authenticated users only" on public.animals for update to authenticated using (true) with check (true);
create policy "Animal Delete Policy" on public.animals for delete to authenticated using (true);

-- Contacts
create policy "Enable read access for authenticated users" on public.contacts for select to authenticated using (true);
create policy "Enable insert for authenticated users only" on public.contacts for insert to authenticated with check (true);
create policy "Enable update for authenticated users only" on public.contacts for update to authenticated using (true) with check (true);
create policy "Contact Delete Policy" on public.contacts for delete to authenticated using (true);

-- Contact Notes
create policy "Enable read access for authenticated users" on public.contact_notes for select to authenticated using (true);
create policy "Enable insert for authenticated users only" on public.contact_notes for insert to authenticated with check (true);
create policy "Contact Notes Update policy" on public.contact_notes for update to authenticated using (true);
create policy "Contact Notes Delete Policy" on public.contact_notes for delete to authenticated using (true);

-- Sales
create policy "Enable read access for authenticated users" on public.sales for select to authenticated using (true);

-- Configuration (admin-only for writes)
create policy "Enable read for authenticated" on public.configuration for select to authenticated using (true);
create policy "Enable insert for admins" on public.configuration for insert to authenticated with check (public.is_admin());
create policy "Enable update for admins" on public.configuration for update to authenticated using (public.is_admin()) with check (public.is_admin());

-- Favicons excluded domains
create policy "Enable access for authenticated users only" on public.favicons_excluded_domains to authenticated using (true) with check (true);
