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
      className="relative overflow-hidden bg-secondary neo-border-thick py-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Bold geometric background shapes */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-20 h-20 bg-primary neo-border rotate-12 neo-shadow"></div>
        <div className="absolute top-20 right-20 w-16 h-16 bg-accent neo-border -rotate-12 neo-shadow"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-foreground neo-border rotate-45"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-primary neo-border neo-shadow-lg"></div>
      </div>

      {/* Simple geometric patterns for Neobrutalism */}
      <div className="absolute inset-0 z-0 overflow-hidden opacity-20">
        <div className="absolute top-1/3 left-1/3 w-32 h-32 bg-foreground transform rotate-45"></div>
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-foreground transform -rotate-12"></div>
        <div className="absolute top-1/4 right-1/3 w-16 h-16 bg-foreground transform rotate-12"></div>
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <motion.div className="flex flex-col items-center text-center">
          <motion.div
            variants={itemVariants}
            className="mb-4 inline-block bg-accent text-accent-foreground px-6 py-2 font-bold uppercase tracking-wider neo-border neo-shadow-primary text-sm"
            whileHover={{
              scale: 1.05,
              transition: { duration: 0.2 }
            }}
          >
            🔥 BRUTAL ANALYSIS
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="max-w-4xl text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-secondary-foreground mb-4 font-arvo uppercase leading-tight"
          >
            DESTROY{" "}
            <motion.span
              className="bg-primary text-primary-foreground px-4 py-2 inline-block neo-border neo-shadow-accent -rotate-2"
              animate={{
                rotate: [-2, 2, -2],
                transition: {
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "mirror",
                  ease: "easeInOut"
                }
              }}
            >
              BAD LOGIC
            </motion.span>
            <br />
            WITH AI
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="max-w-2xl text-lg font-bold text-secondary-foreground mb-6 leading-relaxed"
          >
            SMASH logical fallacies. CRUSH weak arguments. BUILD bulletproof reasoning with our BRUTAL AI analysis engine.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-row gap-4 justify-center"
          >
            <motion.div
              whileHover={{
                scale: 1.05,
                rotate: 1
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Button className="neo-button bg-primary text-primary-foreground text-lg font-bold px-8 py-4 uppercase tracking-wider">
                ANALYZE NOW
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}