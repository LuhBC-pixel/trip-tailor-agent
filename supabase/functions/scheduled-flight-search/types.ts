
// Definição de tipos para a função scheduled-flight-search

export interface FlightSearchParams {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  adults?: number;
  maxPrice?: number;
}

export interface AmadeusToken {
  access_token: string;
  expires_in: number;
}

export interface FormattedFlight {
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
