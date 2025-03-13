
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
    </>
  );
};

export default OriginDestinationSection;
