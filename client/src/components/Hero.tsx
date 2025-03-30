
import React from "react";
import { motion } from "framer-motion";
import { LogoSvg } from "./Logo";

export default function Hero() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-white to-gray-50 py-16 sm:py-24">
      {/* Animated background elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-teal-100/30"
            style={{
              width: Math.random() * 100 + 50,
              height: Math.random() * 100 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: 0.4, 
              scale: 1,
              x: Math.random() * 40 - 20,
              y: Math.random() * 40 - 20,
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex justify-center mb-6"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20">
              <LogoSvg />
            </div>
          </motion.div>
          
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 tracking-tight"
          >
            <span className="block">Logos</span>
            <span className="block text-teal-600">Argument Analyzer</span>
          </motion.h1>
          
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="mt-6 text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Analyze arguments with AI to identify logical structure, premises, conclusions, and fallacies. Improve your critical thinking skills with detailed analysis.
          </motion.p>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            className="mt-8 flex justify-center"
          >
            <a
              href="#analyze"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-200"
            >
              Start Analyzing
            </a>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
