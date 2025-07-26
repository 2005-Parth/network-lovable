import { motion } from 'framer-motion';
import { Home, ArrowLeft, Search, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const quickLinks = [
  { name: 'Home', path: '/', icon: Home },
  { name: 'Events', path: '/events', icon: Search },
  { name: 'Committee', path: '/committee', icon: Search },
  { name: 'Contact', path: '/contact', icon: Mail },
];

export default function NotFound() {
  return (
    <div className="min-h-screen pt-16 flex items-center justify-center bg-gradient-hero">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* 404 Animation */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", bounce: 0.6 }}
            className="mb-8"
          >
            <div className="text-8xl lg:text-9xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
              404
            </div>
            <div className="text-6xl mb-6">🚀</div>
          </motion.div>

          {/* Error Message */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
            <p className="text-xl text-muted-foreground mb-2">
              Oops! It looks like this page has been moved to another dimension.
            </p>
            <p className="text-muted-foreground">
              Don't worry, our network can help you find your way back.
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <Link to="/">
              <Button size="lg" className="bg-gradient-primary hover:shadow-glow-primary">
                <Home className="mr-2 w-4 h-4" />
                Back to Home
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => window.history.back()}
              className="hover:border-primary hover:text-primary"
            >
              <ArrowLeft className="mr-2 w-4 h-4" />
              Go Back
            </Button>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
          >
            <h2 className="text-2xl font-semibold mb-6">Or try these popular pages:</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickLinks.map((link, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 + index * 0.1, duration: 0.4 }}
                >
                  <Link to={link.path}>
                    <Card className="group hover:shadow-glass transition-all duration-300 bg-gradient-card border-border/50 hover:border-primary/30">
                      <CardContent className="p-6 text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 mb-3 rounded-full bg-gradient-primary shadow-glow-primary group-hover:shadow-glow-accent transition-all duration-300">
                          <link.icon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="font-semibold group-hover:text-primary transition-colors">
                          {link.name}
                        </h3>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Help Text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.6 }}
            className="mt-12 p-6 bg-card/50 backdrop-blur-sm rounded-lg border border-border"
          >
            <p className="text-muted-foreground">
              Still can't find what you're looking for? 
              <Link to="/contact" className="text-primary hover:underline ml-1">
                Contact our support team
              </Link>
              {" "}and we'll help you navigate The Network.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}