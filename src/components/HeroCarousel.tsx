import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Rocket, ArrowRight, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase'; // Assuming your client is here

// This interface now includes the full public URL for the image
interface Slide {
  id: string; // UUIDs are strings
  image_name: string;
  title: string;
  subtitle: string;
  description: string;
  image: string; // This will hold the full public URL we construct
}

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSlidesFromDB = async () => {
      // 1. Fetch all slide data from the database table
      const { data: slideData, error } = await supabase
        .from('carousel_slides')
        .select('*')
        .order('sort_order', { ascending: true }); // 2. Order them correctly

      if (error) {
        console.error('Error fetching slides data:', error);
        setLoading(false);
        return;
      }

      // 3. Construct the full public URL for each slide's image
      const slidesWithImageUrls: Slide[] = slideData.map((slide) => ({
        ...slide,
        image: supabase.storage
          .from('carousel-images') // Make sure this is your bucket name
          .getPublicUrl(slide.image_name).data.publicUrl,
      }));

      setSlides(slidesWithImageUrls);
      setLoading(false);
    };

    fetchSlidesFromDB();
  }, []); // Empty dependency array means this runs once on mount

  // This useEffect for auto-playing remains the same
  useEffect(() => {
    if (!isAutoPlaying || slides.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  // All navigation functions remain the same
  const nextSlide = () => {
    if (slides.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    if (slides.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Improved loading state
  if (loading) {
    return <div className="flex items-center justify-center h-screen bg-background text-2xl text-muted-foreground">Loading Hero...</div>;
  }
  
  // Handle case where no slides are found
  if (!loading && slides.length === 0) {
     return <div className="flex items-center justify-center h-screen bg-background text-2xl text-muted-foreground">Could not load slides.</div>;
  }

  // The JSX for rendering remains exactly the same as it correctly
  // uses the `slides` state which is now populated with rich data.
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
            style={{ backgroundImage: `url(${slides[currentSlide].image})` }}
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
                
                {/* ... your buttons and navigation controls remain the same ... */}

              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
       {/* ... Make sure to include the closing tags for your navigation controls here ... */}
       <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
            <div className="flex items-center space-x-4">
              <div className="flex space-x-2">
                {slides.map((_, index) => (
                  <button key={index} onClick={() => goToSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentSlide ? 'bg-primary shadow-glow-primary scale-125' : 'bg-muted hover:bg-primary/50'
                    }`}
                  />
                ))}
              </div>
            </div>
        </div>
        <button onClick={prevSlide} className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 p-3 rounded-full bg-card/80 backdrop-blur-sm border border-border hover:bg-primary/10 hover:border-primary/30 transition-all duration-300 group">
          <ChevronLeft className="w-6 h-6 text-foreground group-hover:text-primary transition-colors" />
        </button>
        <button onClick={nextSlide} className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 p-3 rounded-full bg-card/80 backdrop-blur-sm border border-border hover:bg-primary/10 hover:border-primary/30 transition-all duration-300 group">
          <ChevronRight className="w-6 h-6 text-foreground group-hover:text-primary transition-colors" />
        </button>
    </div>
  );
}