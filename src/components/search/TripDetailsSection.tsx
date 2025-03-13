
import { Clock, Users } from 'lucide-react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface TripDetailsSectionProps {
  tripDuration: string;
  setTripDuration: React.Dispatch<React.SetStateAction<string>>;
  passengers: string;
  setPassengers: React.Dispatch<React.SetStateAction<string>>;
}

const TripDetailsSection = ({
  tripDuration,
  setTripDuration,
  passengers,
  setPassengers
}: TripDetailsSectionProps) => {
  return (
    <>
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
    </>
  );
};

export default TripDetailsSection;
