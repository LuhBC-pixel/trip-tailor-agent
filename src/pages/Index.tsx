
import { useState } from 'react';
import { motion } from 'framer-motion';
import HeroSection from '@/components/HeroSection';
import SearchForm from '@/components/SearchForm';
import FlightCard from '@/components/FlightCard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Mock flight data
const mockFlights = [
  {
    id: "LA1234",
    airline: "LATAM Airlines",
    airlineLogo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/LATAM-logo.svg/1200px-LATAM-logo.svg.png",
    origin: "São Paulo",
    destination: "Rio de Janeiro",
    departureTime: "08:00",
    arrivalTime: "09:00",
    duration: "1h",
    price: 450,
    discount: 15,
    layovers: 0,
    date: "15 Jun 2023",
  },
  {
    id: "G31234",
    airline: "Gol",
    airlineLogo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Gol_logo_2019.svg/2560px-Gol_logo_2019.svg.png",
    origin: "São Paulo",
    destination: "Rio de Janeiro",
    departureTime: "10:30",
    arrivalTime: "11:30",
    duration: "1h",
    price: 520,
    discount: 0,
    layovers: 0,
    date: "15 Jun 2023",
  },
  {
    id: "AD1234",
    airline: "Azul",
    airlineLogo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Logo_of_Azul_Brazilian_Airlines.svg/2560px-Logo_of_Azul_Brazilian_Airlines.svg.png",
    origin: "São Paulo",
    destination: "Rio de Janeiro",
    departureTime: "13:45",
    arrivalTime: "15:15",
    duration: "1h 30m",
    price: 380,
    discount: 0,
    layovers: 1,
    date: "15 Jun 2023",
  },
  {
    id: "AA1234",
    airline: "American Airlines",
    airlineLogo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/American_Airlines_logo_2013.svg/2560px-American_Airlines_logo_2013.svg.png",
    origin: "São Paulo",
    destination: "Nova York",
    departureTime: "22:00",
    arrivalTime: "06:30",
    duration: "10h 30m",
    price: 3800,
    discount: 10,
    layovers: 1,
    date: "15 Jun 2023",
  },
  {
    id: "LH1234",
    airline: "Lufthansa",
    airlineLogo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Lufthansa_Logo_2018.svg/2000px-Lufthansa_Logo_2018.svg.png",
    origin: "São Paulo",
    destination: "Frankfurt",
    departureTime: "20:15",
    arrivalTime: "13:45",
    duration: "12h 30m",
    price: 4200,
    discount: 0,
    layovers: 0,
    date: "15 Jun 2023",
  },
  {
    id: "AF1234",
    airline: "Air France",
    airlineLogo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Air_France_Logo.svg/2560px-Air_France_Logo.svg.png",
    origin: "São Paulo",
    destination: "Paris",
    departureTime: "21:30",
    arrivalTime: "14:00",
    duration: "11h 30m",
    price: 3950,
    discount: 5,
    layovers: 1,
    date: "15 Jun 2023",
  },
];

const Index = () => {
  const [flights] = useState(mockFlights);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main>
        <HeroSection />
        
        <SearchForm />
        
        {/* Results Section */}
        <section className="py-16 px-4" id="results">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Voos disponíveis
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Encontramos estas opções com base nas preferências mais comuns dos nossos usuários.
                Use o formulário acima para personalizar sua busca.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {flights.map((flight, index) => (
                <FlightCard
                  key={flight.id}
                  {...flight}
                  index={index}
                />
              ))}
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 px-4 bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Por que escolher AeroJorney?
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Oferecemos a melhor experiência para encontrar voos que realmente correspondam às suas necessidades.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white rounded-xl p-6 shadow-md"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Duração da viagem</h3>
                <p className="text-muted-foreground">
                  Personalize sua busca com base no tempo ideal de viagem, seja para uma escapada rápida ou para férias prolongadas.
                </p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white rounded-xl p-6 shadow-md"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Preferências personalizadas</h3>
                <p className="text-muted-foreground">
                  Escolha sua companhia aérea favorita, horários preferenciais, tipo de assento e mais para uma experiência sob medida.
                </p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white rounded-xl p-6 shadow-md"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Orçamento controlado</h3>
                <p className="text-muted-foreground">
                  Defina o valor máximo que deseja gastar e nossa ferramenta encontrará as melhores opções dentro do seu orçamento.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Call-to-Action */}
        <section className="py-16 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 z-0"></div>
          
          <div className="container mx-auto relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <motion.h2 
                className="text-3xl md:text-4xl font-bold mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                Pronto para descobrir seu próximo destino?
              </motion.h2>
              
              <motion.p 
                className="text-muted-foreground mb-8 max-w-xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Cadastre-se agora e receba alertas personalizados de promoções 
                e ofertas exclusivas para os destinos do seu interesse.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
              >
                <input 
                  type="email" 
                  placeholder="Seu melhor e-mail" 
                  className="w-full sm:w-64 px-4 py-3 rounded-lg glass-input"
                />
                <button className="w-full sm:w-auto px-8 py-3 rounded-lg bg-primary text-white font-medium shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transform hover:-translate-y-1 transition-all duration-300">
                  Cadastrar
                </button>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
