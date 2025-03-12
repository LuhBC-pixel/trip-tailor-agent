
import { motion } from 'framer-motion';
import { Clock, Plane, Calendar, DollarSign, Users, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface FlightCardProps {
  id: string;
  airline: string;
  airlineLogo: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  discount?: number;
  layovers?: number;
  date: string;
  index: number;
}

const FlightCard = ({
  id,
  airline,
  airlineLogo,
  origin,
  destination,
  departureTime,
  arrivalTime,
  duration,
  price,
  discount,
  layovers = 0,
  date,
  index,
}: FlightCardProps) => {
  const hasDiscount = discount && discount > 0;
  const originalPrice = hasDiscount ? price + (price * discount) / 100 : price;

  return (
    <motion.div 
      className="flight-card-shadow bg-white border border-gray-100 rounded-xl overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
              <img src={airlineLogo} alt={airline} className="w-8 h-8 object-contain" />
            </div>
            <div>
              <span className="font-medium text-sm">{airline}</span>
              <div className="text-xs text-muted-foreground">Voo #{id}</div>
            </div>
          </div>

          {hasDiscount && (
            <Badge className="bg-green-500 text-white">-{discount}%</Badge>
          )}
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold">{departureTime}</div>
            <div className="text-sm text-muted-foreground">{origin}</div>
          </div>

          <div className="flex-1 mx-4 flex flex-col items-center">
            <div className="w-full flex items-center">
              <div className="h-[1px] flex-1 border-t border-dashed border-gray-300"></div>
              <div className="mx-2">
                <Plane className="h-4 w-4 text-primary transform rotate-90" />
              </div>
              <div className="h-[1px] flex-1 border-t border-dashed border-gray-300"></div>
            </div>
            <div className="text-xs text-muted-foreground mt-1">{duration}</div>
            {layovers > 0 && (
              <div className="text-xs text-primary mt-1">
                {layovers} {layovers === 1 ? 'escala' : 'escalas'}
              </div>
            )}
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold">{arrivalTime}</div>
            <div className="text-sm text-muted-foreground">{destination}</div>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-6 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{date}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>{duration}</span>
          </div>
          {layovers > 0 && (
            <div className="flex items-center">
              <Plane className="h-4 w-4 mr-1" />
              <span>{layovers} {layovers === 1 ? 'escala' : 'escalas'}</span>
            </div>
          )}
        </div>

        <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
          <div>
            <div className="flex items-baseline">
              <span className="text-2xl font-bold">R$ {price.toLocaleString()}</span>
              {hasDiscount && (
                <span className="text-sm text-muted-foreground line-through ml-2">
                  R$ {originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            <div className="text-xs text-muted-foreground">Preço por pessoa</div>
          </div>

          <Button className="bg-primary hover:bg-primary/90">
            Selecionar <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default FlightCard;
