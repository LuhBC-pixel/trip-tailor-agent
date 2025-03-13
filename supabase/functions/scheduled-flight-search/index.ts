
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Configuração das credenciais da Amadeus API
const AMADEUS_API_KEY = "BKRFG6C4GDCLIiaA8engS6S81uAce6EE";
const AMADEUS_API_SECRET = "fUp1dfW94C6DtDva";

interface FlightSearchParams {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  adults?: number;
  maxPrice?: number;
}

interface AmadeusToken {
  access_token: string;
  expires_in: number;
}

serve(async (req) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

    // Usar as credenciais hard-coded se as variáveis de ambiente não estiverem disponíveis
    const amadeusApiKey = Deno.env.get("AMADEUS_API_KEY") || AMADEUS_API_KEY;
    const amadeusApiSecret = Deno.env.get("AMADEUS_API_SECRET") || AMADEUS_API_SECRET;

    // Verificar se as chaves de API estão configuradas
    if (!amadeusApiKey || !amadeusApiSecret) {
      throw new Error("API keys não configuradas");
    }

    console.log("Iniciando busca automatizada de voos...");

    // Criar cliente Supabase com a chave de serviço para ignorar RLS
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Buscar pesquisas recorrentes ativas
    const { data: searches, error: searchesError } = await supabase
      .from('recurring_searches')
      .select('*')
      .eq('is_active', true);

    if (searchesError) {
      throw new Error(`Erro ao buscar pesquisas: ${searchesError.message}`);
    }

    console.log(`Encontradas ${searches?.length || 0} pesquisas ativas para processar`);

    if (!searches || searches.length === 0) {
      return new Response(
        JSON.stringify({ message: "Nenhuma pesquisa ativa encontrada" }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Obter token de acesso da Amadeus API
    const amadeusToken = await getAmadeusToken(amadeusApiKey, amadeusApiSecret);
    console.log("Token Amadeus obtido com sucesso");

    // Processar cada pesquisa
    const results = await Promise.all(
      searches.map(async (search) => {
        const searchParams: FlightSearchParams = {
          origin: search.origin,
          destination: search.destination,
          departureDate: search.departure_date,
          returnDate: search.return_date,
          maxPrice: search.max_price
        };

        try {
          console.log(`Processando busca: ${search.origin} -> ${search.destination}, Data: ${search.departure_date}`);
          
          // Buscar voos através da API da Amadeus
          const flights = await searchFlights(searchParams, amadeusToken);
          console.log(`Encontrados ${flights.length} voos para a pesquisa ${search.id}`);
          
          // Inserir resultados no banco de dados
          if (flights && flights.length > 0) {
            const formattedFlights = flights.map(flight => ({
              search_id: search.id,
              origin: search.origin,
              destination: search.destination,
              departure_date: search.departure_date,
              return_date: search.return_date,
              airline: flight.airline,
              flight_number: flight.flightNumber,
              price: flight.price,
              currency: 'BRL',
              departure_time: flight.departureTime,
              arrival_time: flight.arrivalTime,
              duration: flight.duration,
              layovers: flight.layovers || 0,
              layover_airports: flight.layoverAirports || [],
              cabin_class: flight.cabinClass || 'economy',
              data_source: 'amadeus',
              deep_link: flight.deepLink
            }));

            const { error: insertError } = await supabase
              .from('flight_search_results')
              .insert(formattedFlights);

            if (insertError) {
              throw new Error(`Erro ao inserir resultados: ${insertError.message}`);
            }

            console.log(`Resultados da pesquisa ${search.id} salvos com sucesso`);

            // Verificar alertas de preço
            await checkPriceAlerts(supabase, search.id, formattedFlights);
          }

          // Atualizar timestamp da última verificação
          const { error: updateError } = await supabase
            .from('recurring_searches')
            .update({ last_checked: new Date().toISOString() })
            .eq('id', search.id);

          if (updateError) {
            throw new Error(`Erro ao atualizar timestamp: ${updateError.message}`);
          }

          return { searchId: search.id, flightsFound: flights?.length || 0 };
        } catch (error) {
          console.error(`Erro ao processar pesquisa ${search.id}:`, error);
          return { searchId: search.id, error: error.message };
        }
      })
    );

    return new Response(
      JSON.stringify({ success: true, results }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Erro na função de busca de voos:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Função para obter token de acesso da Amadeus API
async function getAmadeusToken(apiKey: string, apiSecret: string): Promise<string> {
  const response = await fetch(
    'https://test.api.amadeus.com/v1/security/oauth2/token',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `grant_type=client_credentials&client_id=${apiKey}&client_secret=${apiSecret}`
    }
  );

  if (!response.ok) {
    throw new Error(`Falha ao obter token da Amadeus: ${response.statusText}`);
  }

  const data: AmadeusToken = await response.json();
  return data.access_token;
}

// Interface para armazenar os resultados formatados dos voos
interface FormattedFlight {
  airline: string;
  flightNumber: string;
  price: number;
  departureTime: string;
  arrivalTime: string;
  duration: number;
  layovers?: number;
  layoverAirports?: string[];
  cabinClass?: string;
  deepLink?: string;
}

// Função para buscar voos na API da Amadeus
async function searchFlights(params: FlightSearchParams, token: string): Promise<FormattedFlight[]> {
  const { origin, destination, departureDate, returnDate, adults = 1, maxPrice } = params;
  
  // Construir URL de busca
  let url = `https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${origin}&destinationLocationCode=${destination}&departureDate=${departureDate}&adults=${adults}&currencyCode=BRL`;
  
  if (returnDate) {
    url += `&returnDate=${returnDate}`;
  }
  
  if (maxPrice) {
    url += `&maxPrice=${maxPrice}`;
  }
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Erro na API da Amadeus: ${response.status} - ${errorText}`);
  }
  
  const data = await response.json();
  
  // Formatar os resultados
  const flights: FormattedFlight[] = [];
  
  if (data.data && Array.isArray(data.data)) {
    for (const offer of data.data) {
      try {
        // Extração dos dados do voo
        const price = parseFloat(offer.price.total);
        
        for (const itinerary of offer.itineraries) {
          const segments = itinerary.segments;
          const firstSegment = segments[0];
          const lastSegment = segments[segments.length - 1];
          
          const airline = firstSegment.carrierCode;
          const flightNumber = `${firstSegment.carrierCode}${firstSegment.number}`;
          const departureTime = firstSegment.departure.at;
          const arrivalTime = lastSegment.arrival.at;
          
          // Calcular duração em minutos
          const duration = calculateDuration(departureTime, arrivalTime);
          
          // Calcular escalas
          const layovers = segments.length - 1;
          const layoverAirports = layovers > 0 
            ? segments.slice(0, -1).map(seg => seg.arrival.iataCode) 
            : [];
          
          flights.push({
            airline,
            flightNumber,
            price,
            departureTime,
            arrivalTime,
            duration,
            layovers,
            layoverAirports,
            cabinClass: offer.travelerPricings[0]?.fareDetailsBySegment[0]?.cabin || 'economy',
            deepLink: '' // A Amadeus não fornece deepLink diretamente
          });
        }
      } catch (e) {
        console.error("Erro ao processar oferta de voo:", e);
        // Continuar com o próximo voo
      }
    }
  }
  
  return flights;
}

// Função auxiliar para calcular a duração em minutos
function calculateDuration(departureTime: string, arrivalTime: string): number {
  const departure = new Date(departureTime);
  const arrival = new Date(arrivalTime);
  return Math.round((arrival.getTime() - departure.getTime()) / (1000 * 60));
}

// Função para verificar alertas de preço
async function checkPriceAlerts(supabase, searchId: string, flights: any[]) {
  if (!flights || flights.length === 0) return;
  
  // Encontrar o voo mais barato
  const cheapestFlight = flights.reduce((prev, current) => 
    (prev.price < current.price) ? prev : current
  );
  
  // Buscar alertas de preço ativos para esta pesquisa
  const { data: alerts, error } = await supabase
    .from('price_alerts')
    .select('*, user_id')
    .eq('search_id', searchId)
    .eq('is_active', true)
    .lte('price_threshold', cheapestFlight.price);
  
  if (error) {
    console.error(`Erro ao buscar alertas: ${error.message}`);
    return;
  }
  
  // Criar notificações para os usuários
  if (alerts && alerts.length > 0) {
    const notifications = alerts.map(alert => ({
      user_id: alert.user_id,
      alert_id: alert.id,
      message: `Voo encontrado abaixo do preço alvo! ${cheapestFlight.origin} para ${cheapestFlight.destination} por R$ ${cheapestFlight.price}`
    }));
    
    const { error: notifError } = await supabase
      .from('user_notifications')
      .insert(notifications);
    
    if (notifError) {
      console.error(`Erro ao criar notificações: ${notifError.message}`);
    }
    
    // Atualizar última vez que o alerta foi disparado
    await supabase
      .from('price_alerts')
      .update({ last_triggered: new Date().toISOString() })
      .in('id', alerts.map(a => a.id));
  }
}
