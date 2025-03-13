
// Funções para interagir com a Amadeus API

import { AmadeusToken, FlightSearchParams, FormattedFlight } from "./types.ts";

// Função para obter token de acesso da Amadeus API
export async function getAmadeusToken(apiKey: string, apiSecret: string): Promise<string> {
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

// Função para buscar voos na API da Amadeus
export async function searchFlights(params: FlightSearchParams, token: string): Promise<FormattedFlight[]> {
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
export function calculateDuration(departureTime: string, arrivalTime: string): number {
  const departure = new Date(departureTime);
  const arrival = new Date(arrivalTime);
  return Math.round((arrival.getTime() - departure.getTime()) / (1000 * 60));
}
