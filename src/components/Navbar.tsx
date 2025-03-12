
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Globe, Search, Plane } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 w-full z-50 transition-all duration-300',
        isScrolled 
          ? 'bg-white/80 backdrop-blur-md shadow-sm py-4' 
          : 'bg-transparent py-6'
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Plane className="h-6 w-6 text-primary" />
            <span className="text-xl font-semibold tracking-tight">AeroJorney</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
              Início
            </Link>
            <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
              Destinos
            </Link>
            <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
              Ofertas
            </Link>
            <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
              Sobre
            </Link>
            <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
              Contato
            </Link>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-sm font-medium hover:text-primary hover:bg-transparent transition-colors"
            >
              <Globe className="mr-1 h-4 w-4" /> PT
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-sm font-medium hover:text-primary hover:bg-transparent transition-colors"
            >
              <Search className="mr-1 h-4 w-4" /> Pesquisar
            </Button>
            <Button variant="default" size="sm" className="bg-primary hover:bg-primary/90 transition-colors">
              Entrar
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white absolute top-full left-0 w-full shadow-md animate-fade-in">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link 
              to="/" 
              className="px-4 py-2 hover:bg-muted rounded-md transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Início
            </Link>
            <Link 
              to="/" 
              className="px-4 py-2 hover:bg-muted rounded-md transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Destinos
            </Link>
            <Link 
              to="/" 
              className="px-4 py-2 hover:bg-muted rounded-md transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Ofertas
            </Link>
            <Link 
              to="/" 
              className="px-4 py-2 hover:bg-muted rounded-md transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Sobre
            </Link>
            <Link 
              to="/" 
              className="px-4 py-2 hover:bg-muted rounded-md transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contato
            </Link>
            <div className="flex items-center pt-4 border-t">
              <Button variant="default" size="sm" className="bg-primary w-full">
                Entrar
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
