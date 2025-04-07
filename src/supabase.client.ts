import { createClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';

export const createSupabaseClient = (configService: ConfigService) => {
  const SUPABASE_URL = configService.get<string>('SUPABASE_URL') || '';
  const SUPABASE_SERVICE_ROLE_KEY =
    configService.get<string>('SUPABASE_SERVICE_ROLE_KEY') || '';

  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
};
