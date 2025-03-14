
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import OriginDestinationSection from './OriginDestinationSection';
import DateSelectionSection from './DateSelectionSection';
import TripDetailsSection from './TripDetailsSection';
import BudgetSlider from './BudgetSlider';
import AdvancedOptions from './AdvancedOptions';
import { destinations, airlines } from './searchData';

const SearchForm = () => {
  const navigate = useNavigate();
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [tripDuration, setTripDuration] = useState('medium');
  const [passengers, setPassengers] = useState('1');
  const [budget, setBudget] = useState([5000]);
  const [preferredAirline, setPreferredAirline] = useState('');
  const [allowLayovers, setAllowLayovers] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Garantir que as listas de destinos e companhias aéreas estejam definidas
  const destinationsList = destinations || [];
  const airlinesList = airlines || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!origin || !destination || !departureDate) {
      toast.error('Por favor, preencha os campos obrigatórios: origem, destino e data de ida.');
      return;
    }
    
    toast.success('Pesquisa iniciada! Buscando as melhores ofertas para você.');
    
    // Construct the search parameters
    const searchParams = new URLSearchParams();
    searchParams.append('origin', origin);
    searchParams.append('destination', destination);
    searchParams.append('departureDate', departureDate);
    
    if (returnDate) {
      searchParams.append('returnDate', returnDate);
    }
    
    searchParams.append('passengers', passengers);
    searchParams.append('tripDuration', tripDuration);
    searchParams.append('budget', budget[0].toString());
    
    if (preferredAirline) {
      searchParams.append('airline', preferredAirline);
    }
    
    searchParams.append('allowLayovers', allowLayovers.toString());
    
    // Navigate to results page with query parameters
    navigate(`/results?${searchParams.toString()}`);
  };

  return (
    <section className="py-16 px-4 relative" id="search">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Encontre o voo perfeito
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Personalize sua busca com base em seus critérios mais importantes e deixe
            que nosso sistema encontre as melhores opções para você.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="max-w-4xl mx-auto glass-card rounded-xl overflow-hidden"
        >
          <form onSubmit={handleSubmit} className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <OriginDestinationSection 
                origin={origin}
                setOrigin={setOrigin}
                destination={destination}
                setDestination={setDestination}
                destinations={destinationsList}
              />
              
              <DateSelectionSection
                departureDate={departureDate}
                setDepartureDate={setDepartureDate}
                returnDate={returnDate}
                setReturnDate={setReturnDate}
              />
              
              <TripDetailsSection
                tripDuration={tripDuration}
                setTripDuration={setTripDuration}
                passengers={passengers}
                setPassengers={setPassengers}
              />
            </div>

            <BudgetSlider budget={budget} setBudget={setBudget} />

            {/* Advanced Options Toggle */}
            <div className="mb-6">
              <Button 
                type="button"
                variant="outline" 
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="w-full flex items-center justify-center glass-input"
              >
                <Filter className="h-4 w-4 mr-2" />
                {showAdvanced ? "Ocultar opções avançadas" : "Mostrar opções avançadas"}
              </Button>
            </div>

            {showAdvanced && (
              <AdvancedOptions
                preferredAirline={preferredAirline}
                setPreferredAirline={setPreferredAirline}
                allowLayovers={allowLayovers}
                setAllowLayovers={setAllowLayovers}
                airlines={airlinesList}
              />
            )}

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 py-6 text-lg"
            >
              Buscar voos
            </Button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default SearchForm;
