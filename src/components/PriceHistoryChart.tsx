
import { useState } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, CalendarDays, TrendingDown, TrendingUp, DollarSign } from 'lucide-react';

interface PricePoint {
  date: string;
  price: number;
  airline?: string;
}

interface PriceHistoryChartProps {
  priceHistory: PricePoint[];
  lowestPrice: number;
  highestPrice: number;
  averagePrice: number;
  origin: string;
  destination: string;
}

const PriceHistoryChart = ({
  priceHistory = [],
  lowestPrice = 0,
  highestPrice = 0,
  averagePrice = 0,
  origin = "",
  destination = "",
}: PriceHistoryChartProps) => {
  const [timeRange, setTimeRange] = useState("30");
  
  // Filter data based on the selected time range
  const filteredData = priceHistory.slice(-parseInt(timeRange));
  
  const priceFormatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 shadow-lg border rounded-md">
          <p className="font-medium">{label}</p>
          <p className="text-primary">
            {priceFormatter.format(payload[0].value)}
          </p>
          {payload[0].payload.airline && (
            <p className="text-sm text-muted-foreground">
              {payload[0].payload.airline}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full shadow-md">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Histórico de Preços</CardTitle>
          <CardDescription>
            {origin} → {destination}
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Últimos 7 dias</SelectItem>
            <SelectItem value="14">Últimos 14 dias</SelectItem>
            <SelectItem value="30">Últimos 30 dias</SelectItem>
            <SelectItem value="90">Últimos 3 meses</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="chart">
          <TabsList className="mb-4">
            <TabsTrigger value="chart">
              <TrendingUp className="h-4 w-4 mr-2" />
              Gráfico
            </TabsTrigger>
            <TabsTrigger value="stats">
              <CalendarDays className="h-4 w-4 mr-2" />
              Estatísticas
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="chart" className="space-y-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={filteredData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }} 
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return `${date.getDate()}/${date.getMonth() + 1}`;
                    }}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `R$${value}`}
                    domain={['dataMin - 100', 'dataMax + 100']}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="price"
                    name="Preço"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="stats">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center">
                    <TrendingDown className="h-8 w-8 text-green-500 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Menor preço</p>
                      <p className="text-2xl font-bold">{priceFormatter.format(lowestPrice)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center">
                    <TrendingUp className="h-8 w-8 text-red-500 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Maior preço</p>
                      <p className="text-2xl font-bold">{priceFormatter.format(highestPrice)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center">
                    <DollarSign className="h-8 w-8 text-blue-500 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Preço médio</p>
                      <p className="text-2xl font-bold">{priceFormatter.format(averagePrice)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 inline mr-1" />
                Dados coletados nos últimos {timeRange} dias
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PriceHistoryChart;
