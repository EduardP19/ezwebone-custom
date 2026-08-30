create extension if not exists pg_cron with schema extensions;
create extension if not exists pg_net with schema extensions;

do $$
begin
    if not exists (select 1 from cron.job where jobname = 'send-scheduled-messages-every-5-minutes') then
        perform cron.schedule(
            'send-scheduled-messages-every-5-minutes',
            '*/5 * * * *',
            $cron$
            select net.http_post(
                url := (select decrypted_secret from vault.decrypted_secrets where name = 'project_url') || '/functions/v1/send-scheduled-messages',
                headers := jsonb_build_object(
                    'Content-Type', 'application/json',
                    'Authorization', 'Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name = 'send_scheduled_messages_service_role_key'),
                    'x-cron-secret', (select decrypted_secret from vault.decrypted_secrets where name = 'send_scheduled_messages_cron_secret')
                ),
                body := '{}'::jsonb
            ) as request_id;
            $cron$
        );
    end if;
end;
$$;
