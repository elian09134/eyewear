import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Check if the URL is valid before creating the client
const isValidUrl = (url: string | undefined) => {
    try {
        return url && (url.startsWith('http://') || url.startsWith('https://'));
    } catch {
        return false;
    }
};

// Only create the client if the keys are defined and valid
export const supabase = (isValidUrl(supabaseUrl) && supabaseKey)
    ? createClient(supabaseUrl!, supabaseKey)
    : null;
