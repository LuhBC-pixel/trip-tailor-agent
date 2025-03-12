
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Filter, X, Clock, Plane, Calendar, Users, DollarSign, ArrowDownUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
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

interface FiltersState {
  priceRange: [number, number];
  departureTimeRange: string;
  arrivalTimeRange: string;
  duration: number;
  stops: string;
  airlines: string[];
  sort: string;
  cabinClass: string;
  includeBaggage: boolean;
  includeFlexibleTickets: boolean;
}

interface AdvancedFiltersProps {
  onFiltersChange: (filters: FiltersState) => void;
  onReset: () => void;
  totalResults: number;
}

const AdvancedFilters = ({ onFiltersChange, onReset, totalResults = 0 }: AdvancedFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  
  const [filters, setFilters] = useState<FiltersState>({
    priceRange: [500, 10000],
    departureTimeRange: 'any',
    arrivalTimeRange: 'any',
    duration: 24,
    stops: 'any',
    airlines: [],
    sort: 'price-asc',
    cabinClass: 'economy',
    includeBaggage: false,
    includeFlexibleTickets: false,
  });
  
  const handleFilterChange = <K extends keyof FiltersState>(
    key: K,
    value: FiltersState[K]
  ) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
    
    // Update active filters list for badges
    updateActiveFilters(key, value);
  };
  
  const updateActiveFilters = <K extends keyof FiltersState>(
    key: K,
    value: FiltersState[K]
  ) => {
    const newActiveFilters = [...activeFilters];
    
    // Remove existing filter of this type
    const existingIndex = newActiveFilters.findIndex(filter => filter.startsWith(key + ':'));
    if (existingIndex > -1) {
      newActiveFilters.splice(existingIndex, 1);
    }
    
    // Add new filter if it's active
    let filterString = '';
    let isActive = false;
    
    switch (key) {
      case 'priceRange':
        const [min, max] = value as [number, number];
        if (min > 500 || max < 10000) {
          filterString = `priceRange:R$${min} - R$${max}`;
          isActive = true;
        }
        break;
      case 'stops':
        if (value !== 'any') {
          filterString = `stops:${value === '0' ? 'Direto' : value === '1' ? 'Max 1 escala' : 'Max 2 escalas'}`;
          isActive = true;
        }
        break;
      case 'airlines':
        const selectedAirlines = value as string[];
        if (selectedAirlines.length > 0) {
          filterString = `airlines:${selectedAirlines.length} selecionadas`;
          isActive = true;
        }
        break;
      case 'duration':
        if ((value as number) < 24) {
          filterString = `duration:Max ${value}h`;
          isActive = true;
        }
        break;
      case 'departureTimeRange':
      case 'arrivalTimeRange':
        if (value !== 'any') {
          const timeLabel = key === 'departureTimeRange' ? 'Partida' : 'Chegada';
          let timeRange = '';
          switch (value) {
            case 'morning': timeRange = 'Manhã'; break;
            case 'afternoon': timeRange = 'Tarde'; break;
            case 'evening': timeRange = 'Noite'; break;
            case 'night': timeRange = 'Madrugada'; break;
          }
          filterString = `${key}:${timeLabel} - ${timeRange}`;
          isActive = true;
        }
        break;
      case 'cabinClass':
        if (value !== 'economy') {
          let cabinLabel = '';
          switch (value) {
            case 'premium_economy': cabinLabel = 'Econômica Premium'; break;
            case 'business': cabinLabel = 'Executiva'; break;
            case 'first': cabinLabel = 'Primeira Classe'; break;
          }
          filterString = `cabinClass:${cabinLabel}`;
          isActive = true;
        }
        break;
      case 'includeBaggage':
      case 'includeFlexibleTickets':
        if (value === true) {
          filterString = `${key}:${key === 'includeBaggage' ? 'Com bagagem' : 'Bilhetes flexíveis'}`;
          isActive = true;
        }
        break;
      default:
        break;
    }
    
    if (isActive) {
      newActiveFilters.push(filterString);
    }
    
    setActiveFilters(newActiveFilters);
  };
  
  const resetFilters = () => {
    setFilters({
      priceRange: [500, 10000],
      departureTimeRange: 'any',
      arrivalTimeRange: 'any',
      duration: 24,
      stops: 'any',
      airlines: [],
      sort: 'price-asc',
      cabinClass: 'economy',
      includeBaggage: false,
      includeFlexibleTickets: false,
    });
    setActiveFilters([]);
    onReset();
  };
  
  const removeFilter = (filterToRemove: string) => {
    const [key, _] = filterToRemove.split(':');
    const keyTyped = key as keyof FiltersState;
    
    let defaultValue: any;
    switch (keyTyped) {
      case 'priceRange': defaultValue = [500, 10000]; break;
      case 'departureTimeRange': defaultValue = 'any'; break;
      case 'arrivalTimeRange': defaultValue = 'any'; break;
      case 'duration': defaultValue = 24; break;
      case 'stops': defaultValue = 'any'; break;
      case 'airlines': defaultValue = []; break;
      case 'cabinClass': defaultValue = 'economy'; break;
      case 'includeBaggage':
      case 'includeFlexibleTickets': defaultValue = false; break;
      default: defaultValue = null;
    }
    
    if (defaultValue !== null) {
      handleFilterChange(keyTyped, defaultValue);
    }
  };
  
  return (
    <div className="mb-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center mb-4">
        <Button 
          onClick={() => setIsOpen(!isOpen)}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          {isOpen ? "Ocultar filtros" : "Mostrar filtros avançados"}
        </Button>
        
        <div className="flex-1 flex flex-wrap gap-2">
          {activeFilters.map((filter, index) => (
            <Badge 
              key={index} 
              variant="secondary"
              className="flex items-center gap-1 py-1"
            >
              {filter.split(':')[1]}
              <button 
                onClick={() => removeFilter(filter)}
                className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          
          {activeFilters.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={resetFilters}
              className="h-6 text-xs"
            >
              Limpar filtros
            </Button>
          )}
        </div>
        
        <div className="text-sm text-muted-foreground">
          {totalResults} {totalResults === 1 ? 'resultado' : 'resultados'}
        </div>
      </div>
      
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-card border rounded-lg p-4 mb-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Price Range */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Faixa de preço
                </h3>
                <span className="text-sm">
                  R$ {filters.priceRange[0]} - R$ {filters.priceRange[1]}
                </span>
              </div>
              <Slider
                defaultValue={[500, 10000]}
                min={500}
                max={10000}
                step={100}
                value={filters.priceRange}
                onValueChange={(value) => handleFilterChange('priceRange', value as [number, number])}
                className="py-4"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>R$ 500</span>
                <span>R$ 10.000</span>
              </div>
            </div>
            
            {/* Stops */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <Plane className="h-4 w-4" />
                Escalas
              </h3>
              <RadioGroup 
                value={filters.stops} 
                onValueChange={(value) => handleFilterChange('stops', value)}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="any" id="any-stops" />
                  <Label htmlFor="any-stops">Qualquer número de escalas</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="0" id="direct" />
                  <Label htmlFor="direct">Voos diretos</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="1" id="max-1-stop" />
                  <Label htmlFor="max-1-stop">Máximo 1 escala</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="2" id="max-2-stops" />
                  <Label htmlFor="max-2-stops">Máximo 2 escalas</Label>
                </div>
              </RadioGroup>
            </div>
            
            {/* Duration */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Duração máxima
                </h3>
                <span className="text-sm">{filters.duration}h</span>
              </div>
              <Slider
                defaultValue={[24]}
                min={2}
                max={24}
                step={1}
                value={[filters.duration]}
                onValueChange={(value) => handleFilterChange('duration', value[0])}
                className="py-4"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>2h</span>
                <span>24h</span>
              </div>
            </div>
            
            {/* Time Ranges */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Horários
              </h3>
              <div className="space-y-2">
                <div className="flex flex-col space-y-1">
                  <Label htmlFor="departure-time" className="text-xs">Partida</Label>
                  <Select 
                    value={filters.departureTimeRange}
                    onValueChange={(value) => handleFilterChange('departureTimeRange', value)}
                  >
                    <SelectTrigger id="departure-time">
                      <SelectValue placeholder="Qualquer horário" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Qualquer horário</SelectItem>
                      <SelectItem value="morning">Manhã (06:00 - 12:00)</SelectItem>
                      <SelectItem value="afternoon">Tarde (12:00 - 18:00)</SelectItem>
                      <SelectItem value="evening">Noite (18:00 - 00:00)</SelectItem>
                      <SelectItem value="night">Madrugada (00:00 - 06:00)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col space-y-1">
                  <Label htmlFor="arrival-time" className="text-xs">Chegada</Label>
                  <Select 
                    value={filters.arrivalTimeRange}
                    onValueChange={(value) => handleFilterChange('arrivalTimeRange', value)}
                  >
                    <SelectTrigger id="arrival-time">
                      <SelectValue placeholder="Qualquer horário" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Qualquer horário</SelectItem>
                      <SelectItem value="morning">Manhã (06:00 - 12:00)</SelectItem>
                      <SelectItem value="afternoon">Tarde (12:00 - 18:00)</SelectItem>
                      <SelectItem value="evening">Noite (18:00 - 00:00)</SelectItem>
                      <SelectItem value="night">Madrugada (00:00 - 06:00)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            {/* Sort By */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <ArrowDownUp className="h-4 w-4" />
                Ordenar por
              </h3>
              <RadioGroup 
                value={filters.sort}
                onValueChange={(value) => handleFilterChange('sort', value)}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="price-asc" id="price-asc" />
                  <Label htmlFor="price-asc">Menor preço</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="duration-asc" id="duration-asc" />
                  <Label htmlFor="duration-asc">Menor duração</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="departure-asc" id="departure-asc" />
                  <Label htmlFor="departure-asc">Partida mais cedo</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="arrival-asc" id="arrival-asc" />
                  <Label htmlFor="arrival-asc">Chegada mais cedo</Label>
                </div>
              </RadioGroup>
            </div>
            
            {/* Airlines Accordion */}
            <div className="space-y-4">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="airlines">
                  <AccordionTrigger className="text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <Plane className="h-4 w-4" />
                      Companhias aéreas
                      {filters.airlines.length > 0 && (
                        <Badge variant="secondary" className="ml-auto">
                          {filters.airlines.length}
                        </Badge>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-col space-y-2 pt-2">
                      {airlines.map((airline) => (
                        <div key={airline.value} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={airline.value}
                            checked={filters.airlines.includes(airline.value)}
                            onChange={(e) => {
                              const newAirlines = e.target.checked
                                ? [...filters.airlines, airline.value]
                                : filters.airlines.filter(a => a !== airline.value);
                              handleFilterChange('airlines', newAirlines);
                            }}
                            className="rounded text-primary h-4 w-4"
                          />
                          <Label htmlFor={airline.value}>{airline.label}</Label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
            
            {/* Cabin Class & Options */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4" />
                Classe & Opções
              </h3>
              <div className="flex flex-col space-y-3">
                <div className="flex flex-col space-y-1">
                  <Label htmlFor="cabin-class" className="text-xs">Classe da cabine</Label>
                  <Select 
                    value={filters.cabinClass}
                    onValueChange={(value) => handleFilterChange('cabinClass', value)}
                  >
                    <SelectTrigger id="cabin-class">
                      <SelectValue placeholder="Econômica" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="economy">Econômica</SelectItem>
                      <SelectItem value="premium_economy">Econômica Premium</SelectItem>
                      <SelectItem value="business">Executiva</SelectItem>
                      <SelectItem value="first">Primeira Classe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center space-x-2 pt-2">
                  <Switch
                    id="baggage"
                    checked={filters.includeBaggage}
                    onCheckedChange={(checked) => handleFilterChange('includeBaggage', checked)}
                  />
                  <Label htmlFor="baggage">Incluir bagagem despachada</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="flexible"
                    checked={filters.includeFlexibleTickets}
                    onCheckedChange={(checked) => handleFilterChange('includeFlexibleTickets', checked)}
                  />
                  <Label htmlFor="flexible">Apenas bilhetes flexíveis</Label>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <Button onClick={resetFilters} variant="outline" className="mr-2">
              Limpar todos os filtros
            </Button>
            <Button onClick={() => setIsOpen(false)}>
              Aplicar filtros
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AdvancedFilters;
