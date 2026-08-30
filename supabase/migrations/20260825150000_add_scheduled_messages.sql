create extension if not exists pgcrypto; -- for gen_random_uuid(), if not already enabled

create table if not exists public.message_templates (
    id uuid default gen_random_uuid() primary key,
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null,
    template_key text not null,
    name text not null,
    channel text not null check (channel in ('email', 'sms', 'whatsapp')),
    subject text,
    body_text text not null,
    body_html text,
    parameter_keys text[] default '{}'::text[],
    description text,
    is_active boolean default true not null,
    metadata jsonb default '{}'::jsonb not null,
    unique (name, channel),
    unique (template_key, channel),
    constraint message_templates_subject_check check (
        (channel = 'email' and subject is not null and btrim(subject) <> '')
        or (channel in ('sms', 'whatsapp') and subject is null)
    )
);

create table if not exists public.scheduled_messages (
    id uuid default gen_random_uuid() primary key,
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null,
    send_after timestamptz not null,
    sent_at timestamptz,
    claimed_at timestamptz,
    status text default 'pending' not null check (status in ('pending', 'processing', 'sent', 'failed', 'cancelled')),
    channel text not null check (channel in ('email', 'sms', 'whatsapp')),
    template_key text not null,
    campaign_name text,
    recipient_name text,
    recipient_email text,
    recipient_phone text,
    sending_source text,
    subject_override text,
    template_params jsonb default '{}'::jsonb not null,
    attempt_count integer default 0 not null check (attempt_count >= 0),
    claimed_by text,
    provider_message_id text,
    last_error text,
    metadata jsonb default '{}'::jsonb not null,
    constraint scheduled_messages_template_fkey
        foreign key (template_key, channel)
        references public.message_templates(template_key, channel)
        on delete restrict,
    constraint scheduled_messages_recipient_check check (
        (channel = 'email' and recipient_email is not null and btrim(recipient_email) <> '')
        or (channel in ('sms', 'whatsapp') and recipient_phone is not null and btrim(recipient_phone) <> '')
    )
);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

drop trigger if exists set_message_templates_updated_at on public.message_templates;
create trigger set_message_templates_updated_at
    before update on public.message_templates
    for each row execute function public.set_updated_at();

drop trigger if exists set_scheduled_messages_updated_at on public.scheduled_messages;
create trigger set_scheduled_messages_updated_at
    before update on public.scheduled_messages
    for each row execute function public.set_updated_at();

create or replace function public.claim_due_scheduled_messages(
    p_batch_size integer default 50,
    p_worker text default null
)
returns setof public.scheduled_messages
language plpgsql as $$
begin
    return query
    with due as (
        select sm.id
        from public.scheduled_messages sm
        where sm.status = 'pending'
          and sm.send_after <= now()
        order by sm.send_after, sm.id
        limit greatest(coalesce(p_batch_size, 50), 1)
        for update skip locked
    )
    update public.scheduled_messages sm
    set status = 'processing',
        claimed_at = now(),
        claimed_by = coalesce(p_worker, sm.claimed_by),
        attempt_count = sm.attempt_count + 1,
        updated_at = now()
    from due
    where sm.id = due.id
    returning sm.*;
end;
$$;

alter table public.message_templates enable row level security;
alter table public.scheduled_messages enable row level security;

create index if not exists idx_message_templates_channel_active
    on public.message_templates(channel, is_active);
create index if not exists idx_scheduled_messages_due_pending
    on public.scheduled_messages(send_after, id)
    where status = 'pending';
create index if not exists idx_scheduled_messages_template_key
    on public.scheduled_messages(template_key);
