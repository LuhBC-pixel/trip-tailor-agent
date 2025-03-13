
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Check, ChevronsUpDown, Plane } from 'lucide-react';
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

type AirlineType = {
  label: string;
  value: string;
};

interface AdvancedOptionsProps {
  preferredAirline: string;
  setPreferredAirline: React.Dispatch<React.SetStateAction<string>>;
  allowLayovers: boolean;
  setAllowLayovers: React.Dispatch<React.SetStateAction<boolean>>;
  airlines: AirlineType[];
}

const AdvancedOptions = ({
  preferredAirline,
  setPreferredAirline,
  allowLayovers,
  setAllowLayovers,
  airlines
}: AdvancedOptionsProps) => {
  const [openAirline, setOpenAirline] = useState(false);

  return (
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
  );
};

export default AdvancedOptions;
