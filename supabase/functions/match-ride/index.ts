import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MatchRequest {
  ride_id: string;
  rider_lat: number;
  rider_lng: number;
  max_distance_km?: number;
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { ride_id, rider_lat, rider_lng, max_distance_km = 5 }: MatchRequest = await req.json();

    const { data: drivers, error: driversError } = await supabase.rpc('get_nearby_drivers', {
      rider_lat,
      rider_lng,
      radius_km: max_distance_km,
    });

    if (driversError) throw driversError;

    if (!drivers || drivers.length === 0) {
      return new Response(
        JSON.stringify({ matched: false, message: 'No available drivers found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const bestDriver = drivers[0];

    const { error: updateError } = await supabase
      .from('rides')
      .update({
        driver_id: bestDriver.id,
        status: 'accepted',
        driver_eta: bestDriver.eta,
        accepted_at: new Date().toISOString(),
      })
      .eq('id', ride_id)
      .eq('status', 'searching');

    if (updateError) throw updateError;

    return new Response(
      JSON.stringify({
        matched: true,
        driver: bestDriver,
        eta: bestDriver.eta,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
