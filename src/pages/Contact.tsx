import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, Users, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase';
import { useState } from 'react';

const contactInfo = [
  {
    icon: Mail,
    title: 'Email Us',
    details: 'hello@thenetwork.club',
    description: 'Send us an email anytime'
  },
  {
    icon: Phone,
    title: 'Call Us',
    details: '+1 (555) 123-4567',
    description: 'Mon-Fri 9AM-6PM EST'
  },
  {
    icon: MapPin,
    title: 'Visit Us',
    details: 'Innovation Hub, Tech Campus',
    description: 'Room 301, Building A'
  },
  {
    icon: Clock,
    title: 'Office Hours',
    details: 'Mon-Fri: 9AM-6PM',
    description: 'Weekend by appointment'
  }
];

const committeeContacts = [
  {
    name: 'Alex Thompson',
    role: 'President',
    email: 'president@thenetwork.club',
    phone: '+1 (555) 123-4567',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    department: 'General Inquiries'
  },
  {
    name: 'Emily Wang',
    role: 'Vice President',
    email: 'vp@thenetwork.club',
    phone: '+1 (555) 123-4568',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    department: 'Partnerships & Events'
  },
  {
    name: 'David Kim',
    role: 'Technical Lead',
    email: 'tech@thenetwork.club',
    phone: '+1 (555) 123-4569',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    department: 'Technical Support'
  },
  {
    name: 'Sophia Martinez',
    role: 'Events Head',
    email: 'events@thenetwork.club',
    phone: '+1 (555) 123-4570',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
    department: 'Event Planning'
  },
  {
    name: 'Ryan O\'Connor',
    role: 'Marketing Head',
    email: 'marketing@thenetwork.club',
    phone: '+1 (555) 123-4571',
    image: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&h=100&fit=crop',
    department: 'Marketing & Outreach'
  },
  {
    name: 'Priya Patel',
    role: 'Partnerships Head',
    email: 'partnerships@thenetwork.club',
    phone: '+1 (555) 123-4572',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
    department: 'Corporate Relations'
  }
];

const quickActions = [
  {
    icon: Calendar,
    title: 'Schedule a Meeting',
    description: 'Book a time slot with our team',
    action: 'Schedule Now'
  },
  {
    icon: Users,
    title: 'Join Our Community',
    description: 'Become a member today',
    action: 'Join Now'
  },
  {
    icon: MessageSquare,
    title: 'Live Chat',
    description: 'Chat with us in real-time',
    action: 'Start Chat'
  }
];

export default function Contact() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert([{
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          message_type: 'general'
        }]);

      if (error) throw error;
      
      alert('Message sent successfully! We\'ll get back to you soon.');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error: any) {
      alert('Error sending message: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-16">
      {/* Header */}
      <section className="py-20 bg-gradient-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl font-bold mb-6">
              Get in <span className="bg-gradient-primary bg-clip-text text-transparent">Touch</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Have questions about our community, events, or want to collaborate? 
              We'd love to hear from you and help you get involved.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="group hover:shadow-glass transition-all duration-300 bg-gradient-card border-border/50 hover:border-primary/30 text-center">
                  <CardContent className="p-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-gradient-primary shadow-glow-primary group-hover:shadow-glow-accent transition-all duration-300">
                      <info.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{info.title}</h3>
                    <p className="text-primary font-medium mb-1">{info.details}</p>
                    <p className="text-sm text-muted-foreground">{info.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="py-16 bg-gradient-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-4">Send us a Message</h2>
                <p className="text-muted-foreground">
                  Fill out the form below and we'll get back to you as soon as possible.
                </p>
              </div>

              <Card className="bg-gradient-card border-border/50">
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">First Name</label>
                        <Input 
                          placeholder="John" 
                          value={formData.firstName}
                          onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Last Name</label>
                        <Input 
                          placeholder="Doe" 
                          value={formData.lastName}
                          onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Email Address</label>
                      <Input 
                        type="email" 
                        placeholder="john.doe@example.com" 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Subject</label>
                      <Input 
                        placeholder="What's this about?" 
                        value={formData.subject}
                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Message</label>
                      <Textarea 
                        placeholder="Tell us more about your inquiry..."
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        rows={5}
                        required
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      disabled={submitting}
                      className="w-full bg-gradient-primary hover:shadow-glow-primary"
                    >
                      <Send className="mr-2 w-4 h-4" />
                      {submitting ? 'Sending...' : 'Send Message'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-3xl font-bold mb-4">Quick Actions</h2>
                <p className="text-muted-foreground">
                  Looking for something specific? Try these quick actions to get started.
                </p>
              </div>

              <div className="space-y-4">
                {quickActions.map((action, index) => (
                  <Card key={index} className="group hover:shadow-glass transition-all duration-300 bg-gradient-card border-border/50 hover:border-primary/30">
                    <CardContent className="p-6">
                      <div className="flex items-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 mr-4 rounded-full bg-gradient-primary shadow-glow-primary">
                          <action.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold mb-1">{action.title}</h3>
                          <p className="text-muted-foreground text-sm">{action.description}</p>
                        </div>
                        <Button variant="outline" size="sm" className="group-hover:border-primary group-hover:text-primary">
                          {action.action}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Map Placeholder */}
              <Card className="overflow-hidden bg-gradient-card border-border/50">
                <CardContent className="p-0">
                  <div className="h-64 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="w-12 h-12 text-primary mb-4 mx-auto" />
                      <h3 className="text-lg font-semibold mb-2">Our Location</h3>
                      <p className="text-muted-foreground">Innovation Hub, Tech Campus</p>
                      <p className="text-muted-foreground">Room 301, Building A</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Committee Contacts */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Committee Contacts</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Need to reach a specific department? Contact our committee members directly 
              for specialized assistance and inquiries.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {committeeContacts.map((contact, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="group hover:shadow-glass transition-all duration-300 bg-gradient-card border-border/50 hover:border-primary/30">
                  <CardContent className="p-6 text-center">
                    <img
                      src={contact.image}
                      alt={contact.name}
                      className="w-20 h-20 mx-auto rounded-full object-cover border-4 border-primary/20 group-hover:border-primary/40 transition-colors mb-4"
                    />
                    
                    <h3 className="text-lg font-semibold mb-1">{contact.name}</h3>
                    <p className="text-primary font-medium mb-1">{contact.role}</p>
                    <p className="text-sm text-muted-foreground mb-4">{contact.department}</p>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-center text-muted-foreground">
                        <Mail className="w-4 h-4 mr-2" />
                        <a href={`mailto:${contact.email}`} className="hover:text-primary transition-colors">
                          {contact.email}
                        </a>
                      </div>
                      <div className="flex items-center justify-center text-muted-foreground">
                        <Phone className="w-4 h-4 mr-2" />
                        <a href={`tel:${contact.phone}`} className="hover:text-primary transition-colors">
                          {contact.phone}
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}