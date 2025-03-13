
// Funções para interagir com o banco de dados Supabase

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { FormattedFlight } from "./types.ts";

// Função para verificar alertas de preço
export async function checkPriceAlerts(supabase, searchId: string, flights: any[]) {
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

// Função para formatar resultados de voos para inserção no banco de dados
export function formatFlightsForDB(flights: FormattedFlight[], search) {
  return flights.map(flight => ({
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
}
