import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Target, Zap, Calendar, BookOpen, Award, Quote } from 'lucide-react';
import HeroCarousel from '@/components/HeroCarousel';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/lib/supabase'; // Make sure this path is correct

// 1. Create a map to link DB string to actual Icon component
const iconMap = {
  Users: Users,
  Target: Target,
  Zap: Zap,
};

// Define types for our data for better TypeScript support
interface Feature {
  id: string;
  icon_name: keyof typeof iconMap; // Ensures icon_name is a valid key
  title: string;
  description: string;
}
interface Stat {
  id: string;
  number_text: string;
  label: string;
}
interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
}

export default function Home() {
  // 2. Set up state to hold dynamic data and loading status
  const [features, setFeatures] = useState<Feature[]>([]);
  const [stats, setStats] = useState<Stat[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  // 3. Fetch all data when the component mounts
  useEffect(() => {
    const fetchHomepageData = async () => {
      try {
        setLoading(true);
        // Fetch all data concurrently for better performance
        const [featuresRes, statsRes, testimonialsRes] = await Promise.all([
          supabase.from('features').select('*').order('id'),
          supabase.from('stats').select('*').order('sort_order'),
          supabase.from('testimonials').select('*').order('created_at'),
        ]);

        if (featuresRes.error) throw featuresRes.error;
        if (statsRes.error) throw statsRes.error;
        if (testimonialsRes.error) throw testimonialsRes.error;

        setFeatures(featuresRes.data);
        setStats(statsRes.data);
        setTestimonials(testimonialsRes.data);

      } catch (error) {
        console.error("Error fetching homepage data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomepageData();
  }, []);

  return (
    <div className="min-h-screen">
      <HeroCarousel />

      {/* Features Section */}
      <section className="py-20 bg-gradient-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div /* ... intro animation ... */ className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Why Choose <span className="bg-gradient-primary bg-clip-text text-transparent">The Network</span>?</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">We're more than just a tech club - we're a community of innovators, creators, and visionaries working together to shape the future of technology.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              // 4. Look up the Icon component from our map
              const IconComponent = iconMap[feature.icon_name];
              return (
                <motion.div key={feature.id} /* ... card animation ... */>
                  <Card className="group hover:shadow-glass transition-all duration-300 bg-gradient-card border-border/50 hover:border-primary/30">
                    <CardContent className="p-8 text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-gradient-primary shadow-glow-primary group-hover:shadow-glow-accent transition-all duration-300">
                        {/* Render the dynamic icon component */}
                        {IconComponent && <IconComponent className="w-8 h-8 text-white" />}
                      </div>
                      <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div /* ... intro animation ... */ className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Our Impact in Numbers</h2>
            <p className="text-xl text-muted-foreground">See the growth and success of our amazing community</p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div key={stat.id} /* ... card animation ... */ className="text-center">
                <div className="text-4xl lg:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
                  {stat.number_text}
                </div>
                <div className="text-muted-foreground font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div /* ... intro animation ... */ className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">What Our Members Say</h2>
            <p className="text-xl text-muted-foreground">Hear from our community members about their transformative experiences</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div key={testimonial.id} /* ... card animation ... */>
                <Card className="group hover:shadow-glass transition-all duration-300 bg-gradient-card border-border/50 hover:border-primary/30 h-full">
                  <CardContent className="p-8 flex flex-col h-full">
                    <Quote className="w-8 h-8 text-primary mb-6" />
                    <blockquote className="text-lg text-muted-foreground mb-6 flex-grow">"{testimonial.quote}"</blockquote>
                    <div className="flex items-center mt-auto">
                      <div>
                        <div className="font-semibold text-foreground">{testimonial.name}</div>
                        <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 mb-8 rounded-full bg-gradient-primary shadow-glow-primary">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            
            <h2 className="text-4xl font-bold mb-6">Stay in the Loop</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Get the latest updates on events, workshops, and community news delivered to your inbox.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg bg-card border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
              />
              <Button className="bg-gradient-primary hover:shadow-glow-primary">
                Subscribe
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}