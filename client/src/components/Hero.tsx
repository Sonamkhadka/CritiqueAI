
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Hero() {
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
    <section className="relative overflow-hidden bg-white py-6">
      {/* Subtle background elements */}
      <div className="absolute inset-0 z-0 opacity-10 overflow-hidden">
        <motion.div 
          className="absolute w-32 h-32 rounded-full bg-primary/20 top-10 left-1/4"
          animate={{
            x: ["-5%", "5%"],
            y: ["-3%", "7%"],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute w-48 h-48 rounded-full bg-secondary/20 bottom-10 right-1/4"
          animate={{
            x: ["3%", "-7%"],
            y: ["5%", "-3%"],
          }}
          transition={{
            duration: 9,
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
          <motion.div 
            variants={itemVariants} 
            className="mb-2 inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
          >
            Introducing Logos
          </motion.div>
          
          <motion.h1 
            variants={itemVariants}
            className="max-w-4xl text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl mb-2"
          >
            Analyze Arguments with{" "}
            <span className="text-primary">AI-Powered Logic</span>
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
            <Button size="sm" className="px-3">
              Get Started
              <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
