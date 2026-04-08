alter table public.ch_directors_non_ro
  drop column if exists first_name,
  drop column if exists last_name,
  drop column if exists director_first_name;

alter table public.ch_directors_ro
  drop column if exists first_name,
  drop column if exists last_name,
  drop column if exists director_first_name;

create or replace function public.set_ch_download_and_qr()
returns trigger
language plpgsql
as $$
declare
  next_number bigint;
  campaign_name text;
  base_qr_url text;
  first_name_from_full text;
begin
  if new.full_name is null or btrim(new.full_name) = '' then
    new.full_name := new.director_full_name;
  end if;

  if new.campaign_status is null or btrim(new.campaign_status) = '' then
    new.campaign_status := 'to_send';
  end if;

  if new.download_code is null or btrim(new.download_code) = '' then
    if tg_table_name = 'ch_directors_ro' then
      next_number := nextval('public.ch_ro_download_code_seq');
    else
      next_number := nextval('public.ch_non_ro_download_code_seq');
    end if;
    new.download_code := lpad(public.base36_encode(next_number), 6, '0');
  end if;

  if new.qr_code_link is null or btrim(new.qr_code_link) = '' then
    campaign_name := case
      when tg_table_name = 'ch_directors_ro' then 'first_letter_ro_director'
      else 'first_letter_non_ro_director'
    end;

    base_qr_url := coalesce(current_setting('app.qr_base_url', true), 'https://www.ezwebone.co.uk/guides');
    first_name_from_full := split_part(coalesce(new.full_name, ''), ' ', 1);

    new.qr_code_link := base_qr_url
      || '?UTM_CAMPAIGN=' || campaign_name
      || '&UTM_SOURCE=letter'
      || '&UTM_MEDIUM=qr_code'
      || '&UTM_NICHE=' || replace(coalesce(new.industry, ''), ' ', '%20')
      || '&UTM_TITLE=' || replace(coalesce(new.company_name, ''), ' ', '%20')
      || '&UTM_TERM=' || replace(coalesce(first_name_from_full, ''), ' ', '%20')
      || '&UTM_CONTENT=' || coalesce(new.company_number, '')
      || '&code=' || new.download_code;
  end if;

  return new;
end;
$$;
