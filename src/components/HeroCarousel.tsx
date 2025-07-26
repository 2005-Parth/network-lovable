import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Rocket, ArrowRight, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useCarouselSlides } from '@/hooks/useSupabaseData';

export default function HeroCarousel() {
  const { slides, loading, error } = useCarouselSlides();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Show loading state
  if (loading) {
    return (
      <div className="relative h-screen overflow-hidden bg-gradient-hero flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="relative h-screen overflow-hidden bg-gradient-hero flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">Error loading carousel: {error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  // Show fallback if no slides
  if (!slides || slides.length === 0) {
    return (
      <div className="relative h-screen overflow-hidden bg-gradient-hero flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Welcome to The Network
            </span>
          </h1>
          <p className="text-xl lg:text-2xl text-muted-foreground mb-6 font-medium">
            Connect, collaborate, and create the future together
          </p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Background Images */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${slides[currentSlide].image_url})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-background/90" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-background/40" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-4xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-center lg:text-left"
              >
                {/* Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring", bounce: 0.6 }}
                  className="inline-flex items-center justify-center w-16 h-16 mb-8 rounded-full bg-gradient-primary shadow-glow-primary"
                >
                  <Rocket className="w-8 h-8 text-white" />
                </motion.div>

                {/* Title */}
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-5xl lg:text-7xl font-bold mb-6 leading-tight"
                >
                  <span className="bg-gradient-primary bg-clip-text text-transparent">
                    {slides[currentSlide].title}
                  </span>
                </motion.h1>

                {/* Subtitle */}
                <motion.h2
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-xl lg:text-2xl text-muted-foreground mb-6 font-medium"
                >
                  {slides[currentSlide].subtitle}
                </motion.h2>

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-lg text-muted-foreground mb-12 max-w-2xl"
                >
                  {slides[currentSlide].description}
                </motion.p>

                {/* Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                >
                  <Button 
                    size="lg" 
                    className="group relative overflow-hidden bg-gradient-primary hover:shadow-glow-primary transition-all duration-300"
                  >
                    {slides[currentSlide].button_text || 'Get Started'}
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="group border-primary/30 hover:border-primary hover:bg-primary/10 hover:shadow-glow-soft transition-all duration-300"
                  >
                    <Play className="mr-2 w-4 h-4" />
                    Learn More
                  </Button>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex items-center space-x-4">
          {/* Slide Indicators */}
          <div className="flex space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? 'bg-primary shadow-glow-primary scale-125'
                    : 'bg-muted hover:bg-primary/50'
                }`}
              />
            ))}
          </div>

          {/* Auto-play toggle */}
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className={`p-2 rounded-full transition-colors ${
              isAutoPlaying 
                ? 'bg-primary/20 text-primary' 
                : 'bg-muted/20 text-muted-foreground hover:text-primary'
            }`}
          >
            <Play className={`w-4 h-4 ${isAutoPlaying ? '' : 'opacity-50'}`} />
          </button>
        </div>
      </div>

      {/* Arrow Navigation */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 p-3 rounded-full bg-card/80 backdrop-blur-sm border border-border hover:bg-primary/10 hover:border-primary/30 transition-all duration-300 group"
      >
        <ChevronLeft className="w-6 h-6 text-foreground group-hover:text-primary transition-colors" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 p-3 rounded-full bg-card/80 backdrop-blur-sm border border-border hover:bg-primary/10 hover:border-primary/30 transition-all duration-300 group"
      >
        <ChevronRight className="w-6 h-6 text-foreground group-hover:text-primary transition-colors" />
      </button>
    </div>
  );
}