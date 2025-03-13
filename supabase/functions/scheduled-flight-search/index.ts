
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { corsHeaders, AMADEUS_API_KEY, AMADEUS_API_SECRET } from "./config.ts";
import { FlightSearchParams } from "./types.ts";
import { getAmadeusToken, searchFlights } from "./amadeus-api.ts";
import { checkPriceAlerts, formatFlightsForDB } from "./database.ts";

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
            const formattedFlights = formatFlightsForDB(flights, search);

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
