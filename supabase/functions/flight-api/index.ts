import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Handle both URL params and body params
    let action;
    let params = {};
    
    if (req.method === 'GET') {
      const url = new URL(req.url);
      action = url.searchParams.get('action');
      
      // Get all params from URL
      for (const [key, value] of url.searchParams.entries()) {
        params[key] = value;
      }
    } else {
      // Parse request body for POST/PUT requests
      const body = await req.json();
      action = body.action;
      params = body;
    }

    if (!action) {
      throw new Error("Ação não especificada");
    }

    // Criar cliente do Supabase
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    let responseData;

    switch (action) {
      case 'get-price-history':
        responseData = await getPriceHistory(params, supabase);
        break;
      case 'create-search':
        responseData = await createSearch(params, supabase);
        break;
      case 'create-alert':
        responseData = await createAlert(params, supabase);
        break;
      case 'get-user-alerts':
        responseData = await getUserAlerts(params, supabase);
        break;
      case 'get-user-notifications':
        responseData = await getUserNotifications(params, supabase);
        break;
      default:
        throw new Error(`Ação desconhecida: ${action}`);
    }

    return new Response(
      JSON.stringify(responseData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Erro na API de voos:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Obter histórico de preços
async function getPriceHistory(params, supabase) {
  const { origin, destination, departureDate } = params;
  
  if (!origin || !destination) {
    throw new Error("Origem e destino são obrigatórios");
  }
  
  let query = supabase
    .from('price_history')
    .select('*')
    .eq('origin', origin)
    .eq('destination', destination);
  
  if (departureDate) {
    query = query.eq('departure_date', departureDate);
  }
  
  const { data, error } = await query
    .order('timestamp', { ascending: true });
  
  if (error) {
    throw new Error(`Erro ao buscar histórico de preços: ${error.message}`);
  }
  
  // Calcular estatísticas
  let lowestPrice = Number.MAX_VALUE;
  let highestPrice = 0;
  let totalPrice = 0;
  
  if (data && data.length > 0) {
    for (const point of data) {
      const price = parseFloat(point.price);
      if (price < lowestPrice) lowestPrice = price;
      if (price > highestPrice) highestPrice = price;
      totalPrice += price;
    }
  }
  
  const averagePrice = data.length > 0 ? totalPrice / data.length : 0;
  
  return { 
    success: true, 
    data, 
    stats: {
      lowestPrice: data.length > 0 ? lowestPrice : 0,
      highestPrice,
      averagePrice
    }
  };
}

// Criar uma nova busca recorrente
async function createSearch(params, supabase) {
  const { userId, origin, destination, departureDate, returnDate, maxPrice, minPrice } = params;
  
  if (!userId || !origin || !destination || !departureDate) {
    throw new Error("Dados obrigatórios não fornecidos");
  }
  
  const { data, error } = await supabase
    .from('recurring_searches')
    .insert({
      user_id: userId,
      origin,
      destination,
      departure_date: departureDate,
      return_date: returnDate,
      max_price: maxPrice,
      min_price: minPrice,
      is_active: true
    })
    .select();
  
  if (error) {
    throw new Error(`Erro ao criar busca: ${error.message}`);
  }
  
  return { success: true, data };
}

// Criar um novo alerta de preço
async function createAlert(params, supabase) {
  const { userId, searchId, priceThreshold } = params;
  
  if (!userId || !searchId || !priceThreshold) {
    throw new Error("Dados obrigatórios não fornecidos");
  }
  
  const { data, error } = await supabase
    .from('price_alerts')
    .insert({
      user_id: userId,
      search_id: searchId,
      price_threshold: priceThreshold,
      is_active: true
    })
    .select();
  
  if (error) {
    throw new Error(`Erro ao criar alerta: ${error.message}`);
  }
  
  return { success: true, data };
}

// Obter alertas do usuário
async function getUserAlerts(params, supabase) {
  const { userId } = params;
  
  if (!userId) {
    throw new Error("ID do usuário não fornecido");
  }
  
  const { data, error } = await supabase
    .from('price_alerts')
    .select(`
      *,
      recurring_searches (*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) {
    throw new Error(`Erro ao buscar alertas: ${error.message}`);
  }
  
  return { success: true, data };
}

// Obter notificações do usuário
async function getUserNotifications(params, supabase) {
  const { userId } = params;
  
  if (!userId) {
    throw new Error("ID do usuário não fornecido");
  }
  
  const { data, error } = await supabase
    .from('user_notifications')
    .select(`
      *,
      price_alerts (*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) {
    throw new Error(`Erro ao buscar notificações: ${error.message}`);
  }
  
  return { success: true, data };
}
