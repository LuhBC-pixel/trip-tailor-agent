
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Loader, AlertCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FlightCard from '@/components/FlightCard';
import AdvancedFilters from '@/components/AdvancedFilters';
import PriceHistoryChart from '@/components/PriceHistoryChart';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Mock data for price history chart
const mockPriceHistory = [
  { date: '2023-05-01', price: 3450, airline: 'LATAM' },
  { date: '2023-05-02', price: 3480, airline: 'Gol' },
  { date: '2023-05-03', price: 3400, airline: 'LATAM' },
  { date: '2023-05-04', price: 3350, airline: 'LATAM' },
  { date: '2023-05-05', price: 3300, airline: 'Azul' },
  { date: '2023-05-06', price: 3320, airline: 'Gol' },
  { date: '2023-05-07', price: 3280, airline: 'LATAM' },
  { date: '2023-05-08', price: 3250, airline: 'Azul' },
  { date: '2023-05-09', price: 3150, airline: 'Gol' },
  { date: '2023-05-10', price: 3100, airline: 'Azul' },
  { date: '2023-05-11', price: 3180, airline: 'LATAM' },
  { date: '2023-05-12', price: 3200, airline: 'Gol' },
  { date: '2023-05-13', price: 3220, airline: 'LATAM' },
  { date: '2023-05-14', price: 3250, airline: 'Azul' },
  { date: '2023-05-15', price: 3300, airline: 'LATAM' },
  { date: '2023-05-16', price: 3280, airline: 'Gol' },
  { date: '2023-05-17', price: 3240, airline: 'LATAM' },
  { date: '2023-05-18', price: 3200, airline: 'Azul' },
  { date: '2023-05-19', price: 3150, airline: 'LATAM' },
  { date: '2023-05-20', price: 3180, airline: 'Gol' },
  { date: '2023-05-21', price: 3220, airline: 'LATAM' },
  { date: '2023-05-22', price: 3250, airline: 'Azul' },
  { date: '2023-05-23', price: 3280, airline: 'LATAM' },
  { date: '2023-05-24', price: 3300, airline: 'Gol' },
  { date: '2023-05-25', price: 3320, airline: 'LATAM' },
  { date: '2023-05-26', price: 3350, airline: 'Azul' },
  { date: '2023-05-27', price: 3380, airline: 'LATAM' },
  { date: '2023-05-28', price: 3420, airline: 'Gol' },
  { date: '2023-05-29', price: 3450, airline: 'LATAM' },
  { date: '2023-05-30', price: 3400, airline: 'Azul' },
];

// Mock flight data
const mockFlights = [
  {
    id: "LA1234",
    airline: "LATAM Airlines",
    airlineLogo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/LATAM-logo.svg/1200px-LATAM-logo.svg.png",
    origin: "São Paulo",
    destination: "Rio de Janeiro",
    departureTime: "08:00",
    arrivalTime: "09:00",
    duration: "1h",
    price: 450,
    discount: 15,
    layovers: 0,
    date: "15 Jun 2023",
  },
  {
    id: "G31234",
    airline: "Gol",
    airlineLogo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Gol_logo_2019.svg/2560px-Gol_logo_2019.svg.png",
    origin: "São Paulo",
    destination: "Rio de Janeiro",
    departureTime: "10:30",
    arrivalTime: "11:30",
    duration: "1h",
    price: 520,
    discount: 0,
    layovers: 0,
    date: "15 Jun 2023",
  },
  {
    id: "AD1234",
    airline: "Azul",
    airlineLogo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Logo_of_Azul_Brazilian_Airlines.svg/2560px-Logo_of_Azul_Brazilian_Airlines.svg.png",
    origin: "São Paulo",
    destination: "Rio de Janeiro",
    departureTime: "13:45",
    arrivalTime: "15:15",
    duration: "1h 30m",
    price: 380,
    discount: 0,
    layovers: 1,
    date: "15 Jun 2023",
  },
  {
    id: "AA1234",
    airline: "American Airlines",
    airlineLogo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/American_Airlines_logo_2013.svg/2560px-American_Airlines_logo_2013.svg.png",
    origin: "São Paulo",
    destination: "Nova York",
    departureTime: "22:00",
    arrivalTime: "06:30",
    duration: "10h 30m",
    price: 3800,
    discount: 10,
    layovers: 1,
    date: "15 Jun 2023",
  },
  {
    id: "LH1234",
    airline: "Lufthansa",
    airlineLogo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Lufthansa_Logo_2018.svg/2000px-Lufthansa_Logo_2018.svg.png",
    origin: "São Paulo",
    destination: "Frankfurt",
    departureTime: "20:15",
    arrivalTime: "13:45",
    duration: "12h 30m",
    price: 4200,
    discount: 0,
    layovers: 0,
    date: "15 Jun 2023",
  },
  {
    id: "AF1234",
    airline: "Air France",
    airlineLogo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Air_France_Logo.svg/2560px-Air_France_Logo.svg.png",
    origin: "São Paulo",
    destination: "Paris",
    departureTime: "21:30",
    arrivalTime: "14:00",
    duration: "11h 30m",
    price: 3950,
    discount: 5,
    layovers: 1,
    date: "15 Jun 2023",
  },
];

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const [flights, setFlights] = useState(mockFlights);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filteredFlights, setFilteredFlights] = useState(mockFlights);
  
  // Get search parameters from URL
  const origin = searchParams.get('origin') || '';
  const destination = searchParams.get('destination') || '';
  const departureDate = searchParams.get('departureDate') || '';
  const returnDate = searchParams.get('returnDate') || '';
  const passengers = searchParams.get('passengers') || '1';
  
  // Compute price statistics for the chart
  const prices = mockPriceHistory.map(entry => entry.price);
  const lowestPrice = Math.min(...prices);
  const highestPrice = Math.max(...prices);
  const averagePrice = Math.round(prices.reduce((sum, price) => sum + price, 0) / prices.length);
  
  useEffect(() => {
    // Simulate API call to flight search services
    const searchFlights = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // In a real implementation, we would call APIs here
        // For now we'll use a timeout to simulate a network request
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Simulate successful response
        setFlights(mockFlights);
        setFilteredFlights(mockFlights);
        
        toast.success("Resultados atualizados com sucesso!");
      } catch (err) {
        console.error('Error fetching flights:', err);
        setError('Não foi possível buscar os voos. Por favor, tente novamente.');
        toast.error("Erro ao buscar voos. Por favor, tente novamente.");
      } finally {
        setLoading(false);
      }
    };
    
    searchFlights();
  }, [origin, destination, departureDate, returnDate]);
  
  const handleFiltersChange = (filters: any) => {
    // Apply filters to the flight results
    let filtered = [...flights];
    
    // Filter by price range
    filtered = filtered.filter(flight => 
      flight.price >= filters.priceRange[0] && flight.price <= filters.priceRange[1]
    );
    
    // Filter by stops
    if (filters.stops !== 'any') {
      const maxStops = parseInt(filters.stops);
      filtered = filtered.filter(flight => flight.layovers <= maxStops);
    }
    
    // Filter by airlines
    if (filters.airlines.length > 0) {
      filtered = filtered.filter(flight => {
        const airlineCode = flight.airline.toLowerCase().split(' ')[0];
        return filters.airlines.includes(airlineCode);
      });
    }
    
    // Sort results
    switch (filters.sort) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'duration-asc':
        filtered.sort((a, b) => {
          const durationA = a.duration.includes('h') ? 
            parseInt(a.duration.split('h')[0]) * 60 + (a.duration.includes('m') ? parseInt(a.duration.split('h ')[1].split('m')[0]) : 0) : 
            parseInt(a.duration.split('m')[0]);
          
          const durationB = b.duration.includes('h') ? 
            parseInt(b.duration.split('h')[0]) * 60 + (b.duration.includes('m') ? parseInt(b.duration.split('h ')[1].split('m')[0]) : 0) : 
            parseInt(b.duration.split('m')[0]);
          
          return durationA - durationB;
        });
        break;
      case 'departure-asc':
        filtered.sort((a, b) => {
          const timeA = parseInt(a.departureTime.replace(':', ''));
          const timeB = parseInt(b.departureTime.replace(':', ''));
          return timeA - timeB;
        });
        break;
      case 'arrival-asc':
        filtered.sort((a, b) => {
          const timeA = parseInt(a.arrivalTime.replace(':', ''));
          const timeB = parseInt(b.arrivalTime.replace(':', ''));
          return timeA - timeB;
        });
        break;
      default:
        break;
    }
    
    setFilteredFlights(filtered);
  };
  
  const resetFilters = () => {
    setFilteredFlights(flights);
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Search Summary */}
        <div className="mb-8">
          <motion.h1 
            className="text-3xl font-bold mb-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Voos de {origin} para {destination}
          </motion.h1>
          <motion.div 
            className="text-muted-foreground"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <p>
              {departureDate} {returnDate ? `- ${returnDate}` : ''} · {passengers} {parseInt(passengers) === 1 ? 'passageiro' : 'passageiros'}
            </p>
          </motion.div>
          
          <div className="mt-4">
            <Button variant="outline" asChild>
              <Link to="/">Modificar busca</Link>
            </Button>
          </div>
        </div>
        
        {/* Price History Chart */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <PriceHistoryChart 
            priceHistory={mockPriceHistory}
            lowestPrice={lowestPrice}
            highestPrice={highestPrice}
            averagePrice={averagePrice}
            origin={origin}
            destination={destination}
          />
        </motion.div>
        
        {/* Advanced Filters */}
        <AdvancedFilters 
          onFiltersChange={handleFiltersChange}
          onReset={resetFilters}
          totalResults={filteredFlights.length}
        />
        
        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <Loader className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Buscando as melhores ofertas para você...</p>
            </div>
          </div>
        )}
        
        {/* Error State */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {/* Results */}
        {!loading && !error && (
          <>
            {filteredFlights.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xl font-semibold mb-2">Nenhum voo encontrado</p>
                <p className="text-muted-foreground mb-6">Tente ajustar seus filtros para ver mais resultados.</p>
                <Button onClick={resetFilters}>Limpar filtros</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredFlights.map((flight, index) => (
                  <FlightCard
                    key={flight.id}
                    {...flight}
                    index={index}
                  />
                ))}
              </div>
            )}
          </>
        )}
        
        {/* Notification Box */}
        <motion.div 
          className="mt-12 p-6 border rounded-lg bg-primary/5 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h3 className="text-lg font-semibold mb-2">Receba alertas de preços</h3>
          <p className="text-muted-foreground mb-4">
            Criamos alertas automáticos para monitorar mudanças de preço nesta rota a cada 10 minutos.
            Cadastre-se para receber notificações quando houver uma queda de preço.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <input
              type="email"
              placeholder="Seu e-mail"
              className="px-4 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button>Receber alertas</Button>
          </div>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SearchResults;
