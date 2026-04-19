create or replace function public.set_ch_download_and_qr()
returns trigger
language plpgsql
as $$
declare
  campaign_name text;
  base_qr_url text;
  normalized_full_name text;
  first_name_from_full text;
  should_refresh_qr boolean;
begin
  if new.full_name is null or btrim(new.full_name) = '' then
    new.full_name := new.director_full_name;
  end if;

  if new.campaign_status is null or btrim(new.campaign_status) = '' then
    new.campaign_status := 'to_send';
  end if;

  if new.download_code is null or btrim(new.download_code) = '' then
    if tg_table_name = 'ch_directors_ro' then
      new.download_code := public.generate_unique_download_code('ch_directors_ro');
    else
      new.download_code := public.generate_unique_download_code('ch_directors_non_ro');
    end if;
  end if;

  should_refresh_qr :=
    new.qr_code_link is null
    or btrim(new.qr_code_link) = ''
    or tg_op = 'INSERT'
    or old.download_code is distinct from new.download_code
    or old.full_name is distinct from new.full_name
    or old.company_name is distinct from new.company_name
    or old.industry is distinct from new.industry;

  if should_refresh_qr then
    campaign_name := case
      when tg_table_name = 'ch_directors_ro' then 'first_letter_ro_director'
      else 'first_letter_non_ro_director'
    end;

    base_qr_url := coalesce(current_setting('app.qr_base_url', true), 'https://www.ezwebone.co.uk');
    base_qr_url := regexp_replace(base_qr_url, '/+$', '');
    base_qr_url := regexp_replace(base_qr_url, '/(ro/)?guides$', '');

    if tg_table_name = 'ch_directors_ro' then
      base_qr_url := base_qr_url || '/ro/guides';
    else
      base_qr_url := base_qr_url || '/guides';
    end if;

    normalized_full_name := btrim(
      regexp_replace(
        coalesce(new.full_name, ''),
        '^(?:\\s*(?:mr|mrs|ms|miss|mx|dr|prof|sir|lady|lord|dame)\\.?\\s+)+',
        '',
        'i'
      )
    );

    first_name_from_full := split_part(normalized_full_name, ' ', 1);

    if first_name_from_full is null or btrim(first_name_from_full) = '' then
      first_name_from_full := split_part(btrim(coalesce(new.full_name, '')), ' ', 1);
    end if;

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
