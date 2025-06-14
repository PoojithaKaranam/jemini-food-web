import { useEffect, useState } from 'react';
import { Button } from '../ui/button';

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image - removed brightness filter for clarity */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
        style={{ 
          backgroundImage: "url('https://png.pngtree.com/thumb_back/fw800/background/20230705/pngtree-sophisticated-bar-and-restaurant-boasting-luxurious-modern-design-featuring-elegant-furnishings-image_3720689.jpg')",
          imageRendering: 'crisp-edges' // Added for sharper image rendering
        }} 
      />
      
      {/* Background gradient overlay - reduced opacity for better image clarity */}
      <div className="absolute inset-0 bg-gradient-to-br from-background/50 via-secondary/30 to-background/50" />
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute bottom-20 right-10 w-40 h-40 rounded-full bg-primary/5 blur-3xl" />
      
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        <div className={`transition-all duration-1000 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Welcome to{' '}
            <span className="text-gradient">Jemini Foods</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white mb-8 max-w-2xl mx-auto leading-relaxed">
            Experience culinary excellence where tradition meets innovation. 
            Every dish tells a story of passion, flavor, and unforgettable moments.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="w-full sm:w-auto">
              Explore Our Menu
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Make Reservation
            </Button>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
