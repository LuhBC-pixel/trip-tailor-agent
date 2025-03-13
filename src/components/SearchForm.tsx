
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, ChevronsUpDown, Clock, Plane, MapPin, DollarSign, CalendarRange, Users, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const airlines = [
  { label: 'LATAM Airlines', value: 'latam' },
  { label: 'Gol', value: 'gol' },
  { label: 'Azul', value: 'azul' },
  { label: 'American Airlines', value: 'aa' },
  { label: 'Emirates', value: 'emirates' },
  { label: 'Air France', value: 'airfrance' },
  { label: 'British Airways', value: 'ba' },
  { label: 'Lufthansa', value: 'lufthansa' },
  { label: 'Qatar Airways', value: 'qatar' },
  { label: 'Singapore Airlines', value: 'singapore' },
];

const destinations = [
  { label: 'São Paulo, Brasil', value: 'sao-paulo' },
  { label: 'Rio de Janeiro, Brasil', value: 'rio-de-janeiro' },
  { label: 'Nova York, EUA', value: 'new-york' },
  { label: 'Paris, França', value: 'paris' },
  { label: 'Tóquio, Japão', value: 'tokyo' },
  { label: 'Londres, Reino Unido', value: 'london' },
  { label: 'Dubai, Emirados Árabes', value: 'dubai' },
  { label: 'Roma, Itália', value: 'rome' },
  { label: 'Cidade do México, México', value: 'mexico-city' },
  { label: 'Cairo, Egito', value: 'cairo' },
];

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

  const [openOrigin, setOpenOrigin] = useState(false);
  const [openDestination, setOpenDestination] = useState(false);
  const [openAirline, setOpenAirline] = useState(false);

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
              {/* Origin */}
              <div className="space-y-2">
                <Label htmlFor="origin">Origem</Label>
                <Popover open={openOrigin} onOpenChange={setOpenOrigin}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openOrigin}
                      className="w-full justify-between glass-input"
                    >
                      {origin
                        ? destinations.find((city) => city.value === origin)?.label
                        : "Selecione a cidade de origem"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Procurar cidade..." />
                      <CommandEmpty>Nenhuma cidade encontrada.</CommandEmpty>
                      <CommandGroup>
                        {destinations.map((city) => (
                          <CommandItem
                            key={city.value}
                            value={city.value}
                            onSelect={(currentValue) => {
                              setOrigin(currentValue);
                              setOpenOrigin(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                origin === city.value ? "opacity-100" : "opacity-0"
                              )}
                            />
                            <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                            {city.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Destination */}
              <div className="space-y-2">
                <Label htmlFor="destination">Destino</Label>
                <Popover open={openDestination} onOpenChange={setOpenDestination}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openDestination}
                      className="w-full justify-between glass-input"
                    >
                      {destination
                        ? destinations.find((city) => city.value === destination)?.label
                        : "Selecione a cidade de destino"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Procurar cidade..." />
                      <CommandEmpty>Nenhuma cidade encontrada.</CommandEmpty>
                      <CommandGroup>
                        {destinations.map((city) => (
                          <CommandItem
                            key={city.value}
                            value={city.value}
                            onSelect={(currentValue) => {
                              setDestination(currentValue);
                              setOpenDestination(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                destination === city.value ? "opacity-100" : "opacity-0"
                              )}
                            />
                            <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                            {city.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Departure Date */}
              <div className="space-y-2">
                <Label htmlFor="departure">Data de ida</Label>
                <div className="relative">
                  <CalendarRange className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="departure"
                    type="date"
                    className="glass-input pl-10"
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                  />
                </div>
              </div>

              {/* Return Date */}
              <div className="space-y-2">
                <Label htmlFor="return">Data de volta</Label>
                <div className="relative">
                  <CalendarRange className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="return"
                    type="date"
                    className="glass-input pl-10"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                  />
                </div>
              </div>

              {/* Trip Duration */}
              <div className="space-y-2">
                <Label htmlFor="tripDuration">Duração da viagem</Label>
                <Select value={tripDuration} onValueChange={setTripDuration}>
                  <SelectTrigger className="glass-input">
                    <SelectValue placeholder="Selecione a duração" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short">
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4" />
                        <span>Curta (1-3 dias)</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="medium">
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4" />
                        <span>Média (4-7 dias)</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="long">
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4" />
                        <span>Longa (8+ dias)</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Passengers */}
              <div className="space-y-2">
                <Label htmlFor="passengers">Passageiros</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Select value={passengers} onValueChange={setPassengers}>
                    <SelectTrigger className="glass-input pl-10">
                      <SelectValue placeholder="Número de passageiros" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} {num === 1 ? 'passageiro' : 'passageiros'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Budget */}
            <div className="mb-6 space-y-4">
              <div className="flex items-center justify-between">
                <Label>Orçamento máximo</Label>
                <span className="text-md font-medium">R$ {budget[0].toLocaleString()}</span>
              </div>
              <div className="px-2">
                <Slider
                  defaultValue={[5000]}
                  max={20000}
                  min={500}
                  step={100}
                  value={budget}
                  onValueChange={setBudget}
                />
                <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                  <span>R$ 500</span>
                  <span>R$ 20.000</span>
                </div>
              </div>
            </div>

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

            {/* Advanced Options */}
            {showAdvanced && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-6 space-y-6"
              >
                {/* Preferred Airline */}
                <div className="space-y-2">
                  <Label htmlFor="airline">Companhia aérea preferida</Label>
                  <Popover open={openAirline} onOpenChange={setOpenAirline}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openAirline}
                        className="w-full justify-between glass-input"
                      >
                        {preferredAirline
                          ? airlines.find((airline) => airline.value === preferredAirline)?.label
                          : "Qualquer companhia aérea"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Procurar companhia aérea..." />
                        <CommandEmpty>Nenhuma companhia encontrada.</CommandEmpty>
                        <CommandGroup>
                          <CommandItem
                            value=""
                            onSelect={() => {
                              setPreferredAirline("");
                              setOpenAirline(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                preferredAirline === "" ? "opacity-100" : "opacity-0"
                              )}
                            />
                            Qualquer companhia aérea
                          </CommandItem>
                          {airlines.map((airline) => (
                            <CommandItem
                              key={airline.value}
                              value={airline.value}
                              onSelect={(currentValue) => {
                                setPreferredAirline(currentValue);
                                setOpenAirline(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  preferredAirline === airline.value ? "opacity-100" : "opacity-0"
                                )}
                              />
                              <Plane className="mr-2 h-4 w-4 text-muted-foreground" />
                              {airline.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Allow Layovers */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="layovers"
                    className="w-4 h-4 rounded"
                    checked={allowLayovers}
                    onChange={(e) => setAllowLayovers(e.target.checked)}
                  />
                  <Label htmlFor="layovers" className="cursor-pointer">
                    Permitir voos com conexões/escalas
                  </Label>
                </div>
              </motion.div>
            )}

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 py-6 text-lg"
            >
              <Plane className="mr-2 h-5 w-5" />
              Buscar voos
            </Button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default SearchForm;
