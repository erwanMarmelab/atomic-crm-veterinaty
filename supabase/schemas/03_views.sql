--
-- Views
-- This file declares all views in the public schema.
--

create or replace view public.activity_log with (security_invoker = on) as
select
    ('contact.' || co.id || '.created') as id,
    'contact.created' as type,
    co.first_seen as date,
    co.sales_id,
    null::json as contact,
    null::json as contact_note
from public.contacts co
union all
select
    ('contactNote.' || cn.id || '.created') as id,
    'contactNote.created' as type,
    cn.date,
    cn.sales_id,
    null::json as contact,
    to_json(cn.*) as contact_note
from public.contact_notes cn;

create or replace view public.contacts_summary with (security_invoker = on) as
select
    co.id,
    co.first_name,
    co.last_name,
    co.gender,
    co.title,
    co.background,
    co.avatar,
    co.first_seen,
    co.last_seen,
    co.has_newsletter,
    co.status,
    co.sales_id,
    co.linkedin_url,
    co.email_jsonb,
    co.phone_jsonb,
    (jsonb_path_query_array(co.email_jsonb, '$[*]."email"'))::text as email_fts,
    (jsonb_path_query_array(co.phone_jsonb, '$[*]."number"'))::text as phone_fts
from public.contacts co;

create or replace view public.animals_summary with (security_invoker = on) as
select
    a.id,
    a.name,
    a.species,
    a.breed,
    a.date_of_birth,
    a.weight_kg,
    a.microchip_number,
    a.status,
    a.owner_id,
    co.first_name as owner_first_name,
    co.last_name as owner_last_name
from public.animals a
join public.contacts co on co.id = a.owner_id;

create or replace view public.consultations_summary with (security_invoker = on) as
select
    c.id,
    c.animal_id,
    c.date,
    c.reason,
    c.diagnosis,
    c.treatment,
    c.next_appointment,
    c.attachments,
    a.name as animal_name,
    co.first_name as owner_first_name,
    co.last_name as owner_last_name
from public.consultations c
join public.animals a on a.id = c.animal_id
join public.contacts co on co.id = a.owner_id;

create or replace view public.init_state with (security_invoker = off) as
select count(sub.id) as is_initialized
from (
    select sales.id from public.sales limit 1
) sub;
