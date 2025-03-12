
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen pt-24 flex items-center justify-center overflow-hidden">
      <div className="hero-blur"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 z-10 relative">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <motion.div 
            className="max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-block mb-4"
            >
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                Simplifique suas viagens
              </span>
            </motion.div>

            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
            >
              Encontre as melhores <span className="text-primary">passagens aéreas</span> para sua próxima aventura
            </motion.h1>

            <motion.p 
              className="text-lg text-muted-foreground mb-8 max-w-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.7 }}
            >
              Busca automatizada de voos com base na duração da viagem, 
              suas preferências pessoais e o orçamento disponível.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7 }}
            >
              <div className="flex flex-wrap gap-4">
                <button className="px-8 py-3 rounded-lg bg-primary text-white font-medium shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transform hover:-translate-y-1 transition-all duration-300">
                  Comece agora
                </button>
                <button className="px-8 py-3 rounded-lg bg-white/90 backdrop-blur-sm border border-gray-200 font-medium hover:bg-white transform hover:-translate-y-1 transition-all duration-300">
                  Saiba mais
                </button>
              </div>
            </motion.div>
          </motion.div>

          <motion.div 
            className="relative w-full md:w-1/2 h-[400px] flex justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.7 }}
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl -z-10"></div>
            <motion.img 
              src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80" 
              alt="Avião voando sobre nuvens"
              className="w-full h-full object-cover rounded-2xl shadow-2xl"
              initial={{ y: 20 }}
              animate={{ y: [0, -10, 0] }}
              transition={{ 
                repeat: Infinity, 
                duration: 4,
                ease: "easeInOut"
              }}
            />
          </motion.div>
        </div>

        <motion.div 
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <span className="text-sm font-medium mb-2">Role para descobrir</span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ 
              repeat: Infinity, 
              duration: 1.5,
              ease: "easeInOut"
            }}
          >
            <ArrowDown className="h-6 w-6" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
