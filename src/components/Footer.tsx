import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone, Twitter, Linkedin, Github, Instagram } from 'lucide-react';
import logo from '@/assets/logo.png';

const footerLinks = [
  {
    title: 'Quick Links',
    links: [
      { name: 'Home', href: '/' },
      { name: 'Events', href: '/events' },
      { name: 'Committee', href: '/committee' },
      { name: 'Gallery', href: '/gallery' },
    ]
  },
  {
    title: 'Community',
    links: [
      { name: 'Blog', href: '/blog' },
      { name: 'Sponsors', href: '/sponsors' },
      { name: 'Contact', href: '/contact' },
      { name: 'Join Us', href: '/committee#join' },
    ]
  },
  {
    title: 'Resources',
    links: [
      { name: 'Documentation', href: '#' },
      { name: 'API Reference', href: '#' },
      { name: 'Tutorials', href: '#' },
      { name: 'FAQs', href: '#' },
    ]
  }
];

const socialLinks = [
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Github, href: '#', label: 'GitHub' },
  { icon: Instagram, href: '#', label: 'Instagram' },
];

export default function Footer() {
  return (
    <footer className="bg-gradient-subtle border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-3 mb-6">
              <img src={logo} alt="The Network" className="h-10 w-10" />
              <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                THE NETWORK
              </span>
            </Link>
            
            <p className="text-muted-foreground mb-6 max-w-md">
              Connecting brilliant minds to shape the future of technology. 
              Join our community of innovators, creators, and visionaries.
            </p>

            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-muted-foreground">
                <Mail className="w-5 h-5 text-primary" />
                <span>hello@thenetwork.club</span>
              </div>
              <div className="flex items-center space-x-3 text-muted-foreground">
                <MapPin className="w-5 h-5 text-primary" />
                <span>Innovation Hub, Tech Campus</span>
              </div>
              <div className="flex items-center space-x-3 text-muted-foreground">
                <Phone className="w-5 h-5 text-primary" />
                <span>+1 (555) 123-4567</span>
              </div>
            </div>
          </div>

          {/* Link Sections */}
          {footerLinks.map((section, index) => (
            <div key={index}>
              <h3 className="text-lg font-semibold mb-4 text-foreground">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      to={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors duration-300"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row items-center justify-between">
            {/* Tagline */}
            <div className="text-center md:text-left mb-4 md:mb-0">
              <p className="text-lg font-medium bg-gradient-primary bg-clip-text text-transparent">
                Originality • Intent • Opportunity
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                © 2024 The Network. All rights reserved.
              </p>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="p-2 rounded-full bg-card border border-border hover:border-primary/30 hover:bg-primary/10 transition-all duration-300 group"
                >
                  <social.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}