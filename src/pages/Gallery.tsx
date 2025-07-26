<<<<<<< HEAD
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye, Calendar, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase'; // Make sure this path is correct

// Define the shape of our Gallery Item data
interface GalleryItem {
  id: string;
  image_name: string;
  title: string;
  category: string;
  capture_date: string;
  description: string;
  src: string; // This will hold the constructed public URL
}

export default function Gallery() {
  // === STATE MANAGEMENT ===
  const [allItems, setAllItems] = useState<GalleryItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<GalleryItem[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [loading, setLoading] = useState(true);

  // === DATA FETCHING EFFECT (RUNS ONCE) ===
  useEffect(() => {
    const fetchGalleryItems = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('gallery_items')
        .select('*')
        .order('capture_date', { ascending: false });

      if (error) {
        console.error("Error fetching gallery items:", error);
      } else {
        const itemsWithUrls = data.map(item => ({
          ...item,
          src: supabase.storage
            .from('gallery_photos') // Ensure this is your bucket name
            .getPublicUrl(item.image_name).data.publicUrl,
        }));
        setAllItems(itemsWithUrls);
        
        // Dynamically create category list
        const uniqueCategories = [...new Set(data.map(item => item.category))];
        setCategories(['All', ...uniqueCategories]);
      }
      setLoading(false);
    };

    fetchGalleryItems();
  }, []);

  // === FILTERING EFFECT (RUNS WHEN FILTERS CHANGE) ===
  useEffect(() => {
    if (selectedCategory === 'All') {
      setFilteredItems(allItems);
    } else {
      setFilteredItems(allItems.filter(item => item.category === selectedCategory));
    }
  }, [allItems, selectedCategory]);

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background pt-16">
      {/* Header */}
      <section className="py-20 bg-gradient-hero text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">Gallery</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore moments from our events, workshops, and community activities.
          </p>
        </motion.div>
      </section>

      {/* Category Filter */}
      <section className="sticky top-0 z-10 py-4 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <Button key={category} variant={selectedCategory === category ? "default" : "outline"} size="sm" onClick={() => setSelectedCategory(category)} className={selectedCategory === category ? "bg-gradient-primary" : ""}>
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center text-muted-foreground">Loading gallery...</div>
          ) : (
            <>
              <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <AnimatePresence>
                  {filteredItems.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      className="group cursor-pointer"
                      onClick={() => setSelectedImage(item)}
                    >
                      <div className="relative overflow-hidden rounded-lg bg-gradient-card border border-border hover:border-primary/30 transition-all duration-300">
                        <div className="aspect-square overflow-hidden">
                          <img src={item.src} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"/>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                           <div className="absolute bottom-0 left-0 right-0 p-4">
                              <h3 className="font-semibold text-sm text-foreground">{item.title}</h3>
                           </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
              {filteredItems.length === 0 && !loading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
                  <div className="text-6xl mb-4">📸</div>
                  <h3 className="text-2xl font-semibold mb-2">No images found</h3>
                  <p className="text-muted-foreground">Try selecting a different category.</p>
                </motion.div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/95 backdrop-blur-sm"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", bounce: 0.3 }}
              className="relative max-w-4xl max-h-[90vh] bg-card rounded-lg border border-border overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={() => setSelectedImage(null)} className="absolute top-4 right-4 z-10 p-2 rounded-full bg-background/80 backdrop-blur-sm border border-border hover:bg-background transition-colors">
                <X className="w-5 h-5" />
              </button>
              <div className="relative">
                <img src={selectedImage.src} alt={selectedImage.title} className="w-full h-auto max-h-[70vh] object-contain"/>
              </div>
              <div className="p-6 bg-gradient-card">
                 <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20">
                      <Tag className="w-4 h-4 mr-1" />{selectedImage.category}
                    </span>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4 mr-1" />{formatDate(selectedImage.capture_date)}
                    </div>
                  </div>
                <h3 className="text-2xl font-semibold mb-3">{selectedImage.title}</h3>
                <p className="text-muted-foreground">{selectedImage.description}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
=======
{"code":"rate-limited","message":"You have hit the rate limit. Please upgrade to keep chatting.","providerLimitHit":false,"isRetryable":true}
>>>>>>> be9bbcc8b0c2de6c8f3ba8e43147667bfc178a8a
