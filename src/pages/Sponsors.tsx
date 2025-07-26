import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Award, Download, CheckCircle, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase'; // Make sure this path is correct

// --- Interfaces ---
interface Sponsor {
  id: string;
  name: string;
  logo_name: string;
  website_url: string;
  description: string;
  tier: 'Title' | 'Gold' | 'Silver';
  logo: string; // Constructed URL
}
interface SponsorTier {
  tier: string;
  description: string;
  icon: React.ElementType;
  sponsors: Sponsor[];
}
interface SponsorshipPackage {
  id: string;
  name: string;
  price: string;
  color: string; // Renamed from border_color_class
  benefits: string[];
}
interface FormState {
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  interest: string;
  message: string;
}

// Map tier names to icons and descriptions
const tierInfoMap = {
  'Title': { description: 'Our premier partners who make everything possible.', icon: Trophy },
  'Gold': { description: 'Valuable partners supporting our major initiatives.', icon: Star },
  'Silver': { description: 'Supporting partners helping us grow and succeed.', icon: Award },
};

export default function Sponsors() {
  // --- State Management ---
  const [sponsorTiers, setSponsorTiers] = useState<SponsorTier[]>([]);
  const [sponsorshipPackages, setSponsorshipPackages] = useState<SponsorshipPackage[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [formState, setFormState] = useState<FormState>({ companyName: '', contactPerson: '', email: '', phone: '', interest: '', message: '' });
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  // --- Data Fetching ---
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [sponsorsRes, packagesRes] = await Promise.all([
        supabase.from('sponsors').select('*'),
        supabase.from('sponsorship_packages').select('*').order('sort_order'),
      ]);

      if (sponsorsRes.error) console.error('Error fetching sponsors:', sponsorsRes.error);
      if (packagesRes.error) console.error('Error fetching packages:', packagesRes.error);

      // Process sponsors: group them by tier
      if (sponsorsRes.data) {
        const grouped = sponsorsRes.data.reduce((acc, sponsor) => {
          const tier = sponsor.tier || 'Silver';
          if (!acc[tier]) {
            acc[tier] = [];
          }
          acc[tier].push({
            ...sponsor,
            logo: supabase.storage.from('sponsor_logos').getPublicUrl(sponsor.logo_name).data.publicUrl,
          });
          return acc;
        }, {} as Record<string, Sponsor[]>);
        
        const tiers: SponsorTier[] = Object.keys(tierInfoMap).map(tierName => ({
            tier: `${tierName} Sponsors`,
            description: tierInfoMap[tierName as keyof typeof tierInfoMap].description,
            icon: tierInfoMap[tierName as keyof typeof tierInfoMap].icon,
            sponsors: grouped[tierName] || [],
        })).filter(tier => tier.sponsors.length > 0);

        setSponsorTiers(tiers);
      }

      // Set sponsorship packages
      if (packagesRes.data) {
        setSponsorshipPackages(packagesRes.data.map(pkg => ({
          ...pkg,
          color: pkg.border_color_class // Keep original field name for mapping
        })));
      }
      setLoading(false);
    };
    fetchData();
  }, []);
  
  // --- Form Handling ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prevState => ({ ...prevState, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionStatus('submitting');
    const { error } = await supabase.from('sponsorship_inquiries').insert({
      company_name: formState.companyName,
      contact_person: formState.contactPerson,
      email: formState.email,
      phone: formState.phone,
      interest_level: formState.interest,
      message: formState.message,
    });

    if (error) {
      setSubmissionStatus('error');
      console.error(error);
    } else {
      setSubmissionStatus('success');
      setFormState({ companyName: '', contactPerson: '', email: '', phone: '', interest: '', message: '' });
    }
  };

  return (
    <div className="min-h-screen bg-background pt-16">
      {/* Header */}
      <section className="py-20 bg-gradient-hero text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-5xl font-bold mb-4">Our <span className="bg-gradient-primary bg-clip-text text-transparent">Sponsors</span></h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">We're grateful to our sponsors for their incredible support.</p>
        </motion.div>
      </section>

      {/* Sponsor Tiers */}
      {loading ? (
        <div className="text-center py-16">Loading sponsors...</div>
      ) : (
        sponsorTiers.map((tier, tierIndex) => (
          <section key={tier.tier} className={tierIndex % 2 === 0 ? 'py-16 bg-background' : 'py-16 bg-gradient-subtle'}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div /* ... intro ... */ className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-gradient-primary shadow-glow-primary">
                  <tier.icon className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-4xl font-bold mb-4">{tier.tier}</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">{tier.description}</p>
              </motion.div>
              <div className={`grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3`}>
                {tier.sponsors.map((sponsor, index) => (
                  <motion.div key={sponsor.id} /* ... animation ... */>
                    <Card className="group h-full ...">
                      <CardContent className="p-8 text-center">
                        <a href={sponsor.website_url} target="_blank" rel="noopener noreferrer" className="block w-full h-24 mb-6 bg-white/90 rounded-lg flex items-center justify-center p-2 overflow-hidden">
                          <img src={sponsor.logo} alt={sponsor.name} className="max-w-full max-h-full object-contain"/>
                        </a>
                        <h3 className="text-xl font-semibold mb-2">{sponsor.name}</h3>
                        <p className="text-muted-foreground mb-4 flex-grow">{sponsor.description}</p>
                        <a href={sponsor.website_url} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" size="sm" className="group-hover:border-primary group-hover:text-primary">Visit Website</Button>
                        </a>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        ))
      )}
      
      {/* Sponsorship Packages */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <motion.div /* ... intro ... */ className="text-center mb-16">
             <h2 className="text-4xl font-bold mb-6">Sponsorship Packages</h2>
             <p className="text-xl text-muted-foreground max-w-3xl mx-auto">Join our community of supporters and help us create amazing opportunities.</p>
           </motion.div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {sponsorshipPackages.map((pkg, index) => (
               <motion.div key={pkg.id} /* ... animation ... */>
                 <Card className={`relative h-full overflow-hidden border-2 ${pkg.color} ...`}>
                   <CardContent className="p-8 flex flex-col h-full">
                     <div className="text-center mb-8">
                       <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
                       <div className="text-3xl font-bold ...">{pkg.price}</div>
                     </div>
                     <ul className="space-y-3 mb-8 flex-grow">
                       {pkg.benefits.map((benefit, benefitIndex) => (
                         <li key={benefitIndex} className="flex items-start">
                           <CheckCircle className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                           <span className="text-sm">{benefit}</span>
                         </li>
                       ))}
                     </ul>
                     <Button className="w-full mt-auto bg-gradient-primary hover:shadow-glow-primary">Choose Package</Button>
                   </CardContent>
                 </Card>
               </motion.div>
             ))}
           </div>
        </div>
      </section>

      {/* Inquiry Form */}
      <section id="inquiry" className="py-20 bg-gradient-subtle">
         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div /* ... intro ... */ className="text-center mb-12">
               <h2 className="text-4xl font-bold mb-6">Become a Sponsor</h2>
               <p className="text-xl text-muted-foreground">Ready to support our community? Get in touch!</p>
            </motion.div>
            <motion.div /* ... animation ... */>
               <Card className="bg-gradient-card border-border/50">
                  <CardContent className="p-8">
                     <form onSubmit={handleFormSubmit} className="space-y-6">
                        {/* Form fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <Input name="companyName" placeholder="Company Name" value={formState.companyName} onChange={handleInputChange} required />
                          <Input name="contactPerson" placeholder="Contact Person" value={formState.contactPerson} onChange={handleInputChange} required />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <Input name="email" type="email" placeholder="Email Address" value={formState.email} onChange={handleInputChange} required />
                          <Input name="phone" placeholder="Phone Number" value={formState.phone} onChange={handleInputChange} />
                        </div>
                        <select name="interest" value={formState.interest} onChange={handleInputChange} required className="w-full px-4 py-3 rounded-lg bg-card border border-border ...">
                          <option value="">Select a package of interest</option>
                          <option value="Title">Title Sponsor</option>
                          <option value="Gold">Gold Sponsor</option>
                          <option value="Silver">Silver Sponsor</option>
                          <option value="Custom">Custom Package</option>
                        </select>
                        <Textarea name="message" placeholder="Your message..." value={formState.message} onChange={handleInputChange} rows={4} />
                        
                        <Button type="submit" className="w-full bg-gradient-primary hover:shadow-glow-primary" disabled={submissionStatus === 'submitting'}>
                          <Send className="w-4 h-4 mr-2" />
                          {submissionStatus === 'submitting' ? 'Sending...' : 'Send Inquiry'}
                        </Button>
                        
                        {/* Submission Status Message */}
                        {submissionStatus === 'success' && <p className="text-green-500 text-center mt-4">Thank you! Your inquiry has been sent.</p>}
                        {submissionStatus === 'error' && <p className="text-red-500 text-center mt-4">An error occurred. Please try again.</p>}
                     </form>
                  </CardContent>
               </Card>
            </motion.div>
         </div>
      </section>
    </div>
  );
}