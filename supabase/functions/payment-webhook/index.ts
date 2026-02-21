import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.1';
import Stripe from 'https://esm.sh/stripe@14.14.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY')!;
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!;
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const stripe = new Stripe(stripeSecretKey, { apiVersion: '2023-10-16' });
    const supabase = createClient(supabaseUrl, supabaseKey);

    const signature = req.headers.get('stripe-signature')!;
    const body = await req.text();

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      return new Response(
        JSON.stringify({ error: `Webhook signature verification failed: ${err.message}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const rideId = paymentIntent.metadata.ride_id;

        if (rideId) {
          await supabase
            .from('rides')
            .update({
              payment_status: 'completed',
              actual_fare: paymentIntent.amount / 100,
            })
            .eq('id', rideId);

          const { data: ride } = await supabase
            .from('rides')
            .select('driver_id, actual_fare')
            .eq('id', rideId)
            .single();

          if (ride?.driver_id) {
            const grossAmount = ride.actual_fare;
            const platformFee = grossAmount * 0.2;
            const netAmount = grossAmount - platformFee;

            await supabase.from('earnings').insert({
              driver_id: ride.driver_id,
              ride_id: rideId,
              gross_amount: grossAmount,
              platform_fee: platformFee,
              net_amount: netAmount,
            });

            await supabase.rpc('increment_driver_earnings', {
              p_driver_id: ride.driver_id,
              p_amount: netAmount,
            });
          }
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const rideId = paymentIntent.metadata.ride_id;

        if (rideId) {
          await supabase
            .from('rides')
            .update({ payment_status: 'failed' })
            .eq('id', rideId);
        }
        break;
      }
    }

    return new Response(
      JSON.stringify({ received: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
