update public.ch_directors_non_ro
set campaign_status = case
  when campaign_status = 'letter sent' then 'letter_sent'
  when campaign_status = 'QR scanned' then 'qr_scanned'
  when campaign_status = 'download started' then 'download_started'
  when campaign_status = 'lead capture' then 'lead_capture'
  else campaign_status
end
where campaign_status in ('letter sent', 'QR scanned', 'download started', 'lead capture');

update public.ch_directors_ro
set campaign_status = case
  when campaign_status = 'letter sent' then 'letter_sent'
  when campaign_status = 'QR scanned' then 'qr_scanned'
  when campaign_status = 'download started' then 'download_started'
  when campaign_status = 'lead capture' then 'lead_capture'
  else campaign_status
end
where campaign_status in ('letter sent', 'QR scanned', 'download started', 'lead capture');
