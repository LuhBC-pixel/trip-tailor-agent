import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Toaster } from '@/components/ui/toaster';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import PriceHistoryChart from '@/components/PriceHistoryChart';
import { useQuery } from '@tanstack/react-query';

const FlightDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const [user, setUser] = useState<User | null>(null);
  
  // Obter parâmetros da URL
  const origin = searchParams.get('origin') || '';
  const destination = searchParams.get('destination') || '';
  const departureDate = searchParams.get('departureDate') || '';
  const returnDate = searchParams.get('returnDate') || '';
  
  // Verificar se o usuário está autenticado
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    
    checkUser();
  }, []);
  
  // Buscar histórico de preços
  const { data: priceHistoryData, isLoading, error } = useQuery({
    queryKey: ['priceHistory', origin, destination, departureDate],
    queryFn: async () => {
      try {
        const response = await supabase.functions.invoke('flight-api', {
          body: { 
            action: 'get-price-history',
            origin,
            destination,
            departureDate
          }
        });
        
        if (!response.data.success) {
          throw new Error(response.data.error || 'Erro ao buscar histórico de preços');
        }
        
        return response.data;
      } catch (error) {
        console.error('Erro ao buscar histórico de preços:', error);
        toast.error('Não foi possível carregar o histórico de preços');
        throw error;
      }
    },
    enabled: !!origin && !!destination
  });
  
  // Configurar para criar um alerta de preço
  const [priceThreshold, setPriceThreshold] = useState('');
  const [isCreatingAlert, setIsCreatingAlert] = useState(false);
  
  const handleCreateAlert = async () => {
    if (!user) {
      toast.error('Você precisa estar logado para criar alertas');
      return;
    }
    
    if (!priceThreshold || isNaN(parseFloat(priceThreshold))) {
      toast.error('Por favor, insira um valor válido');
      return;
    }
    
    setIsCreatingAlert(true);
    
    try {
      // Primeiro criar uma busca recorrente
      const searchResponse = await supabase.functions.invoke('flight-api', {
        body: {
          action: 'create-search',
          userId: user.id,
          origin,
          destination,
          departureDate,
          returnDate,
          maxPrice: parseFloat(priceThreshold)
        }
      });
      
      if (!searchResponse.data.success) {
        throw new Error(searchResponse.data.error || 'Erro ao criar busca');
      }
      
      const searchId = searchResponse.data.data[0].id;
      
      // Criar o alerta de preço
      const alertResponse = await supabase.functions.invoke('flight-api', {
        body: {
          action: 'create-alert',
          userId: user.id,
          searchId,
          priceThreshold: parseFloat(priceThreshold)
        }
      });
      
      if (!alertResponse.data.success) {
        throw new Error(alertResponse.data.error || 'Erro ao criar alerta');
      }
      
      toast.success('Alerta de preço criado com sucesso!');
      setPriceThreshold('');
    } catch (error) {
      console.error('Erro ao criar alerta:', error);
      toast.error('Não foi possível criar o alerta de preço');
    } finally {
      setIsCreatingAlert(false);
    }
  };
  
  // Formatação dos dados para o gráfico
  const chartData = priceHistoryData?.data?.map(item => ({
    date: new Date(item.timestamp).toISOString().split('T')[0],
    price: parseFloat(item.price),
    airline: item.airline
  })) || [];
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Toaster />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Detalhes do Voo</h1>
          <button 
            onClick={() => navigate(-1)}
            className="px-4 py-2 text-sm bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
          >
            Voltar
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold mb-2">
                {origin} → {destination}
              </h2>
              <p className="text-gray-600">
                Ida: {new Date(departureDate).toLocaleDateString('pt-BR')}
                {returnDate && ` | Volta: ${new Date(returnDate).toLocaleDateString('pt-BR')}`}
              </p>
            </div>
            
            {user && (
              <div className="mt-4 md:mt-0">
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={priceThreshold}
                    onChange={(e) => setPriceThreshold(e.target.value)}
                    placeholder="Preço alvo (R$)"
                    className="px-3 py-2 border rounded-md"
                  />
                  <button
                    onClick={handleCreateAlert}
                    disabled={isCreatingAlert}
                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    {isCreatingAlert ? 'Criando...' : 'Criar Alerta'}
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Receba notificações quando o preço estiver abaixo deste valor
                </p>
              </div>
            )}
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>Erro ao carregar histórico de preços. Tente novamente mais tarde.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {chartData.length > 0 ? (
              <PriceHistoryChart 
                priceHistory={chartData}
                lowestPrice={priceHistoryData?.stats?.lowestPrice || 0}
                highestPrice={priceHistoryData?.stats?.highestPrice || 0}
                averagePrice={priceHistoryData?.stats?.averagePrice || 0}
                origin={origin}
                destination={destination}
              />
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded">
                <p>Ainda não há histórico de preços disponível para esta rota.</p>
              </div>
            )}
          </div>
        )}
        
        {!user && (
          <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Crie uma conta para mais recursos</h3>
            <p className="mb-4">Registre-se para criar alertas de preço e receber notificações quando os preços estiverem baixos.</p>
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              Entrar / Registrar
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default FlightDetails;
