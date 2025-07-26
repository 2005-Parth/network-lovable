import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, Clock, ArrowRight, Search, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase'; // Make sure this path is correct

// Define the shape of our Blog Post data
interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  author_name: string;
  author_image_name: string;
  post_date: string;
  read_time_minutes: number;
  category: string;
  image_name: string;
  is_featured: boolean;
  // --- Constructed URLs ---
  image: string;
  authorImage: string;
}

export default function Blog() {
  // === STATE MANAGEMENT ===
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [featuredPost, setFeaturedPost] = useState<BlogPost | null>(null);
  const [regularPosts, setRegularPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // === DATA FETCHING EFFECT (RUNS ONCE) ===
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('post_date', { ascending: false });

      if (error) {
        console.error("Error fetching blog posts:", error);
      } else {
        const postsWithUrls = data.map(post => ({
          ...post,
          image: supabase.storage.from('blog_images').getPublicUrl(post.image_name).data.publicUrl,
          // Assuming author images are in a 'committee_photos' or similar bucket
          authorImage: supabase.storage.from('committee_photos').getPublicUrl(post.author_image_name).data.publicUrl,
        }));
        
        setAllPosts(postsWithUrls);
        setFeaturedPost(postsWithUrls.find(p => p.is_featured) || null);

        // Dynamically create category list
        const uniqueCategories = [...new Set(data.map(post => post.category))];
        setCategories(['All', ...uniqueCategories]);
      }
      setLoading(false);
    };
    fetchPosts();
  }, []);

  // === FILTERING EFFECT (RUNS WHEN FILTERS CHANGE) ===
  useEffect(() => {
    const filtered = allPosts.filter(post => {
      const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
    
    // Exclude the featured post from the regular grid
    setRegularPosts(filtered.filter(post => !post.is_featured));
  }, [allPosts, selectedCategory, searchTerm]);

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
         {/* ... Header JSX ... */}
      </section>

      {/* Search and Filters */}
      <section className="sticky top-0 z-10 py-4 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input type="text" placeholder="Search articles..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
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

      {loading ? (
        <div className="text-center py-20">Loading articles...</div>
      ) : (
        <>
          {/* Featured Post */}
          {featuredPost && selectedCategory === 'All' && searchTerm === '' && (
            <section className="py-16 bg-gradient-subtle">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                  <Card className="overflow-hidden bg-gradient-card ...">
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                      <div className="relative h-64 lg:h-auto"><img src={featuredPost.image} alt={featuredPost.title} className="w-full h-full object-cover" /></div>
                      <CardContent className="p-8 lg:p-12 flex flex-col justify-center">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs ..."><Tag className="w-3 h-3 mr-1" />{featuredPost.category}</span>
                        <h2 className="text-3xl font-bold my-4 ...">{featuredPost.title}</h2>
                        <p className="text-muted-foreground mb-6 text-lg">{featuredPost.excerpt}</p>
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center">
                            <img src={featuredPost.authorImage} alt={featuredPost.author_name} className="w-10 h-10 rounded-full mr-3" />
                            <div>
                              <div className="font-medium">{featuredPost.author_name}</div>
                              <div className="text-sm text-muted-foreground">{formatDate(featuredPost.post_date)}</div>
                            </div>
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground"><Clock className="w-4 h-4 mr-1" />{featuredPost.read_time_minutes} min read</div>
                        </div>
                        <Button className="self-start group ...">Read More<ArrowRight className="ml-2 w-4 h-4 ..." /></Button>
                      </CardContent>
                    </div>
                  </Card>
                </motion.div>
              </div>
            </section>
          )}

          {/* Blog Posts Grid */}
          <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {regularPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {regularPosts.map((post, index) => (
                    <motion.div key={post.id} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: index * 0.1 }}>
                      <Card className="group ... h-full">
                        <div className="relative h-48 overflow-hidden">
                          <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 ..."/>
                        </div>
                        <CardContent className="p-6 flex flex-col flex-1">
                          <h3 className="text-xl font-semibold mb-3 ...">{post.title}</h3>
                          <p className="text-muted-foreground mb-4 flex-1 line-clamp-3">{post.excerpt}</p>
                          <div className="flex items-center justify-between mt-auto">
                             <div className="flex items-center">
                               <img src={post.authorImage} alt={post.author_name} className="w-8 h-8 rounded-full mr-2"/>
                               <div>
                                  <div className="text-sm font-medium">{post.author_name}</div>
                                  <div className="text-xs text-muted-foreground">{formatDate(post.post_date)}</div>
                               </div>
                             </div>
                             <div className="text-xs text-muted-foreground flex items-center"><Clock className="w-3 h-3 mr-1" />{post.read_time_minutes} min read</div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
                  <div className="text-6xl mb-4">📝</div>
                  <h3 className="text-2xl font-semibold mb-2">No articles found</h3>
                  <p className="text-muted-foreground">Try adjusting your search or check back later for new content.</p>
                </motion.div>
              )}
            </div>
          </section>
        </>
      )}

      {/* Newsletter Signup */}
      <section className="py-20 bg-gradient-subtle">
        {/* ... Newsletter JSX ... */}
      </section>
    </div>
  );
}