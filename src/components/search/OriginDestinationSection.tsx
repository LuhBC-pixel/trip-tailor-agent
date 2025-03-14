
import { useState } from 'react';
import { Check, ChevronsUpDown, MapPin } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
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
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type DestinationType = {
  label: string;
  value: string;
};

interface OriginDestinationSectionProps {
  origin: string;
  setOrigin: React.Dispatch<React.SetStateAction<string>>;
  destination: string;
  setDestination: React.Dispatch<React.SetStateAction<string>>;
  destinations: DestinationType[];
}

const OriginDestinationSection = ({
  origin,
  setOrigin,
  destination,
  setDestination,
  destinations,
}: OriginDestinationSectionProps) => {
  const [openOrigin, setOpenOrigin] = useState(false);
  const [openDestination, setOpenDestination] = useState(false);

  // Ensure destinations is an array and has data
  const destinationsList = Array.isArray(destinations) ? destinations : [];

  const getSelectedLabel = (value: string) => {
    if (!value) return "";
    const city = destinationsList.find((city) => city?.value === value);
    return city?.label || "";
  };

  // Handle selection for origin city
  const handleOriginSelect = (currentValue: string) => {
    setOrigin(currentValue);
    setOpenOrigin(false);
    
    // If same as destination, show toast warning
    if (currentValue === destination && destination) {
      toast.warning("Origem e destino não podem ser iguais");
    }
  };

  // Handle selection for destination city
  const handleDestinationSelect = (currentValue: string) => {
    setDestination(currentValue);
    setOpenDestination(false);
    
    // If same as origin, show toast warning
    if (currentValue === origin && origin) {
      toast.warning("Origem e destino não podem ser iguais");
    }
  };

  return (
    <>
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
              {getSelectedLabel(origin) || "Selecione a cidade de origem"}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0 bg-background">
            <Command>
              <CommandInput placeholder="Procurar cidade..." />
              <CommandEmpty>Nenhuma cidade encontrada.</CommandEmpty>
              <CommandGroup>
                {destinationsList.length > 0 ? (
                  destinationsList.map((city) => (
                    <CommandItem
                      key={city.value}
                      value={city.value}
                      onSelect={() => handleOriginSelect(city.value)}
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
                  ))
                ) : (
                  <CommandItem disabled>
                    Carregando cidades...
                  </CommandItem>
                )}
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
              {getSelectedLabel(destination) || "Selecione a cidade de destino"}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0 bg-background">
            <Command>
              <CommandInput placeholder="Procurar cidade..." />
              <CommandEmpty>Nenhuma cidade encontrada.</CommandEmpty>
              <CommandGroup>
                {destinationsList.length > 0 ? (
                  destinationsList.map((city) => (
                    <CommandItem
                      key={city.value}
                      value={city.value}
                      onSelect={() => handleDestinationSelect(city.value)}
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
                  ))
                ) : (
                  <CommandItem disabled>
                    Carregando cidades...
                  </CommandItem>
                )}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
};

export default OriginDestinationSection;
