
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

// Define the particle interface
interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
}

export default function Hero() {
  // State for particles
  const [particles, setParticles] = useState<Particle[]>([]);
  
  // Generate particles on component mount
  useEffect(() => {
    const generateParticles = () => {
      const newParticles: Particle[] = [];
      // Generate 25 particles
      for (let i = 0; i < 25; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100, // Random x position (0-100%)
          y: Math.random() * 100, // Random y position (0-100%)
          size: Math.random() * 4 + 1, // Random size (1-5px)
          opacity: Math.random() * 0.4 + 0.1, // Random opacity (0.1-0.5)
          duration: Math.random() * 15 + 25, // Random duration (25-40s)
          delay: Math.random() * 5, // Random delay (0-5s)
        });
      }
      setParticles(newParticles);
    };

    generateParticles();
  }, []);

  // Animation variants for staggered entrance with gentler transitions
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        duration: 1.2,
        ease: "easeOut"
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.section 
      className="relative overflow-hidden bg-white py-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-white to-blue-50 opacity-30"></div>
      
      {/* Moving particles background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {particles.map(particle => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-primary/10"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              opacity: particle.opacity,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              opacity: [particle.opacity, particle.opacity / 2, particle.opacity],
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "linear"
            }}
          />
        ))}
        
        {/* Larger floating elements for additional motion */}
        <motion.div 
          className="absolute w-32 h-32 rounded-full bg-primary/5 top-10 left-1/4 blur-xl"
          animate={{ 
            y: [0, -8, 0],
            transition: {
              duration: 6,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut"
            }
          }}
          initial={{ opacity: 0.5 }}
        />
        <motion.div 
          className="absolute w-48 h-48 rounded-full bg-primary/5 bottom-10 right-1/4 blur-xl"
          animate={{ 
            x: [0, 8, 0],
            transition: {
              duration: 7,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut"
            }
          }}
          initial={{ opacity: 0.5 }}
        />
        <motion.div 
          className="absolute w-24 h-24 rounded-full bg-secondary/5 top-1/2 left-1/3 blur-xl"
          animate={{ 
            scale: [1, 1.03, 1],
            opacity: [0.6, 0.8, 0.6],
            transition: {
              duration: 8,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut"
            }
          }}
          initial={{ opacity: 0.5 }}
        />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <motion.div className="flex flex-col items-center text-center">
          <motion.div 
            variants={itemVariants} 
            className="mb-2 inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
            whileHover={{ 
              scale: 1.03,
              transition: { duration: 0.2 }
            }}
          >
            Introducing Critique
          </motion.div>
          
          <motion.h1 
            variants={itemVariants}
            className="max-w-4xl text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl mb-2"
          >
            Analyze Arguments with{" "}
            <motion.span 
              className="text-primary bg-clip-text"
              animate={{ 
                opacity: [0.9, 1, 0.9],
                scale: [1, 1.01, 1],
                transition: {
                  duration: 5,
                  repeat: Infinity,
                  repeatType: "mirror",
                  ease: "easeInOut"
                }
              }}
            >
              AI-Powered Analysis
            </motion.span>
          </motion.h1>
          
          <motion.p 
            variants={itemVariants}
            className="max-w-xl text-sm text-muted-foreground mb-3"
          >
            Identify logical fallacies, evaluate premises, and strengthen your critical thinking with AI.
          </motion.p>
          
          <motion.div 
            variants={itemVariants} 
            className="flex flex-row gap-3 justify-center"
          >
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <Button size="sm" className="px-3 shadow-sm">
                Get Started
                <motion.div
                  animate={{ 
                    x: [0, 4, 0],
                    transition: { 
                      duration: 2, 
                      repeat: Infinity, 
                      repeatType: "mirror",
                      ease: "easeInOut" 
                    }
                  }}
                >
                  <ArrowRight className="ml-1 h-3 w-3" />
                </motion.div>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}
