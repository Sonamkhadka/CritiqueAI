
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  // Animation variants for floating elements
  const floatingAnimation = {
    y: ["-0.5rem", "0.5rem"],
    transition: {
      y: {
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }
    }
  };

  // Animation variants for staggered entrance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background to-background/80 py-20 md:py-32">
      {/* Animated background elements */}
      <div className="absolute inset-0 z-0 opacity-20 overflow-hidden">
        <motion.div 
          className="absolute w-64 h-64 rounded-full bg-primary/20 top-10 left-1/4"
          animate={{
            x: ["-10%", "10%"],
            y: ["-5%", "15%"],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute w-96 h-96 rounded-full bg-secondary/20 bottom-10 right-1/4"
          animate={{
            x: ["5%", "-15%"],
            y: ["10%", "-5%"],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute w-48 h-48 rounded-full bg-accent/20 top-1/2 right-1/4"
          animate={{
            x: ["15%", "-5%"],
            y: ["-10%", "5%"],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <motion.div 
          className="flex flex-col items-center text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            Introducing Logos
          </motion.div>
          
          <motion.h1 
            variants={itemVariants}
            className="max-w-4xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl mb-6"
          >
            Analyze Arguments with{" "}
            <span className="text-primary">AI-Powered Logic</span>
          </motion.h1>
          
          <motion.p 
            variants={itemVariants}
            className="max-w-2xl text-lg text-muted-foreground mb-8"
          >
            Logos helps you identify logical fallacies, evaluate premises, and strengthen your critical thinking skills through AI-powered analysis.
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="px-8">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            className="mt-12 relative w-full max-w-5xl rounded-lg border border-border/40 bg-card/30 p-2 backdrop-blur-sm shadow-lg"
            animate={floatingAnimation}
          >
            <img
              src="/images/hero-image.png"
              alt="Logos argument analyzer interface"
              className="w-full rounded-md shadow-md"
              onError={(e) => {
                e.currentTarget.src = "https://placehold.co/1200x630/1e293b/e2e8f0?text=Logos+Argument+Analyzer";
              }}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
