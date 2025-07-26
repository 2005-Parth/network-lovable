<<<<<<< HEAD
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Clock, Tag, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase'; // Make sure this path is correct

// Define the shape of our Event data
interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string;
  event_time: string;
  location: string;
  category: string;
  status: string;
  image_name: string;
  image: string; // This will be the constructed public URL
  // The 'attendees' fields from your original code are not in the DB schema we made.
  // I've removed them for now, but you could add them to your 'events' table.
}

export default function Events() {
  // === STATE MANAGEMENT ===
  const [allEvents, setAllEvents] = useState<Event[]>([]); // Master list from DB
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]); // Displayed list
  const [categories, setCategories] = useState<string[]>(['All']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // === DATA FETCHING EFFECT (RUNS ONCE) ===
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: false });

      if (error) {
        console.error("Error fetching events:", error);
      } else {
        const eventsWithUrls = data.map(event => ({
          ...event,
          image: supabase.storage
            .from('carousel-images') // Ensure this is your bucket name
            .getPublicUrl(event.image_name).data.publicUrl
        }));
        console.log(eventsWithUrls);
        setAllEvents(eventsWithUrls);
        
        // Dynamically create category list from fetched events
        const uniqueCategories = [...new Set(data.map(event => event.category))];
        setCategories(['All', ...uniqueCategories]);
      }
      setLoading(false);
    };

    fetchEvents();
  }, []);

  // === FILTERING EFFECT (RUNS WHEN FILTERS CHANGE) ===
  useEffect(() => {
    let eventsToFilter = [...allEvents];

    // Apply category filter
    if (selectedCategory !== 'All') {
      eventsToFilter = eventsToFilter.filter(event => event.category === selectedCategory);
    }

    // Apply search filter
    if (searchTerm) {
      eventsToFilter = eventsToFilter.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredEvents(eventsToFilter);
  }, [allEvents, selectedCategory, searchTerm]);

  // Helper functions remain the same
  const getStatusColor = (status: string) => {
    // Note: The current time is Saturday, July 26, 2025.
    // We can make this dynamic based on the event date vs. today's date.
    switch (status) {
      case 'upcoming': return 'bg-primary/10 text-primary border-primary/20';
      case 'completed': return 'bg-muted/20 text-muted-foreground border-muted/30';
      default: return 'bg-accent/10 text-accent-foreground border-accent/20';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="py-20 bg-gradient-hero text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">Events</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover workshops, tech talks, and networking opportunities to accelerate your growth.
          </p>
        </motion.div>
      </section>

      {/* Filters */}
      <section className="sticky top-0 z-10 py-4 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input type="text" placeholder="Search events..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10"/>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <Button key={category} variant={selectedCategory === category ? "default" : "outline"} size="sm" onClick={() => setSelectedCategory(category)} className={selectedCategory === category ? "bg-gradient-primary" : ""}>
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center text-muted-foreground">Loading events...</div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredEvents.map((event, index) => (
                  <motion.div key={event.id} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.05 }}>
                    <Card className="group hover:shadow-glass transition-all duration-300 bg-gradient-card border-border/50 hover:border-primary/30 overflow-hidden h-full flex flex-col">
                      <div className="relative h-48 overflow-hidden">
                        <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                        <div className="absolute top-4 right-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(event.status)}`}>
                            {event.status}
                          </span>
                        </div>
                      </div>
                      <CardContent className="p-6 flex flex-col flex-grow">
                        <div className="flex items-center justify-between mb-3">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent border border-accent/20">
                            <Tag className="w-3 h-3 mr-1" />{event.category}
                          </span>
                        </div>
                        <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">{event.title}</h3>
                        <p className="text-muted-foreground mb-4 line-clamp-2 flex-grow">{event.description}</p>
                        <div className="space-y-2 mt-auto">
                          <div className="flex items-center text-sm text-muted-foreground"><Calendar className="w-4 h-4 mr-2 text-primary" />{formatDate(event.event_date)}</div>
                          <div className="flex items-center text-sm text-muted-foreground"><Clock className="w-4 h-4 mr-2 text-primary" />{event.event_time}</div>
                          <div className="flex items-center text-sm text-muted-foreground"><MapPin className="w-4 h-4 mr-2 text-primary" />{event.location}</div>
                        </div>
                        <Button className="w-full mt-4 group-hover:bg-gradient-primary" variant={event.status === 'upcoming' ? 'default' : 'outline'} disabled={event.status === 'completed'}>
                          {event.status === 'upcoming' ? 'Register Now' : 'View Details'}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
              {filteredEvents.length === 0 && !loading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-2xl font-semibold mb-2">No events found</h3>
                  <p className="text-muted-foreground">Try adjusting your search or filter.
                  </p>
                </motion.div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
=======
{"code":"rate-limited","message":"You have hit the rate limit. Please upgrade to keep chatting.","providerLimitHit":false,"isRetryable":true}
>>>>>>> be9bbcc8b0c2de6c8f3ba8e43147667bfc178a8a
