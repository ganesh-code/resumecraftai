import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Plan configurations
const PLANS = {
    'Starter': {
        resumes_per_day: 10,
        price_inr: 99,
        razorpay_plan_id: 'plan_test_starter'
    },
    'Elite': {
        resumes_per_day: 20,
        price_inr: 129,
        razorpay_plan_id: 'plan_test_elite'
    },
    'Pro': {
        resumes_per_day: 30,
        price_inr: 199,
        razorpay_plan_id: 'plan_test_pro'
    },
};

serve(async (req) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        // Get request body
        const { user_id, plan_name } = await req.json();
        console.log('Received request:', { user_id, plan_name });

        // Validate input
        if (!user_id || !plan_name) {
            throw new Error('Missing required fields: user_id and plan_name');
        }

        if (!PLANS[plan_name]) {
            throw new Error('Invalid plan name');
        }

        // Check environment variables
        const supabaseUrl = Deno.env.get('SUPABASE_URL');
        const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
        const razorpayKeyId = Deno.env.get('RAZORPAY_KEY_ID');
        const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET');

        if (!supabaseUrl || !supabaseServiceKey) {
            throw new Error('Missing Supabase environment variables');
        }

        if (!razorpayKeyId || !razorpayKeySecret) {
            throw new Error('Missing Razorpay environment variables');
        }

        // Initialize Supabase client
        const supabaseClient = createClient(supabaseUrl, supabaseServiceKey);

        // Get user details
        const { data: userData, error: userError } = await supabaseClient
            .from('profiles')
            .select('email')
            .eq('id', user_id)
            .single();

        if (userError) {
            console.error('Error fetching user:', userError);
            throw new Error('User not found');
        }

        // Check for existing active subscription
        const { data: existingSub, error: subError } = await supabaseClient
            .from('subscriptions')
            .select('*')
            .eq('user_id', user_id)
            .eq('status', 'active')
            .single();

        if (subError && subError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
            console.error('Error checking existing subscription:', subError);
            throw subError;
        }

        if (existingSub) {
            throw new Error('User already has an active subscription');
        }

        // Create Razorpay order
        const razorpayResponse = await fetch('https://api.razorpay.com/v1/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${btoa(razorpayKeyId + ':' + razorpayKeySecret)}`,
            },
            body: JSON.stringify({
                amount: PLANS[plan_name].price_inr * 100, // Convert to paise
                currency: 'INR',
                receipt: `receipt_${Date.now()}`,
                notes: {
                    user_id,
                    plan_name,
                },
            }),
        });

        if (!razorpayResponse.ok) {
            const errorData = await razorpayResponse.json();
            console.error('Razorpay API error:', errorData);
            throw new Error('Failed to create Razorpay order');
        }

        const razorpayOrder = await razorpayResponse.json();
        console.log('Created Razorpay order:', razorpayOrder);

        // Create pending subscription record
        const { data: subscriptionData, error: subscriptionError } = await supabaseClient
            .from('subscriptions')
            .insert({
                user_id,
                plan_name,
                status: 'pending',
                resumes_remaining: 0,
                start_date: new Date().toISOString(),
                end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
                razorpay_order_id: razorpayOrder.id,
            })
            .select()
            .single();

        if (subscriptionError) {
            console.error('Error creating subscription:', subscriptionError);
            throw subscriptionError;
        }

        console.log('Created subscription:', subscriptionData);

        return new Response(
            JSON.stringify({
                subscription_id: subscriptionData.id,
                user_email: userData.email,
                plan_name: subscriptionData.plan_name,
                razorpay_order_id: razorpayOrder.id,
                amount: PLANS[plan_name].price_inr * 100,
                currency: 'INR',
                key_id: razorpayKeyId,
            }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200,
            }
        );
    } catch (error) {
        console.error('Function error:', error);
        return new Response(
            JSON.stringify({ 
                error: error.message,
                details: error.stack
            }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400,
            }
        );
    }
}); 