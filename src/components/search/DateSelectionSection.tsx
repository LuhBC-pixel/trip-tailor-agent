
import { CalendarRange } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface DateSelectionSectionProps {
  departureDate: string;
  setDepartureDate: React.Dispatch<React.SetStateAction<string>>;
  returnDate: string;
  setReturnDate: React.Dispatch<React.SetStateAction<string>>;
}

const DateSelectionSection = ({
  departureDate,
  setDepartureDate,
  returnDate,
  setReturnDate
}: DateSelectionSectionProps) => {
  return (
    <>
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
    </>
  );
};

export default DateSelectionSection;
