import React from "react";
import { motion } from "framer-motion";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import ApiGuide from "@/components/ApiGuide";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import Pricing from "@/components/Pricing";
import Faq from "@/components/Faq";
import NewsletterSignup from "@/components/NewsletterSignup";
import Testimonials from "@/components/Testimonials";
import ArgumentForm from "@/components/ArgumentForm";
import ResultsDisplay from "@/components/ResultsDisplay";
import { useParams, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Home() {
  const params = useParams();
  const location = useLocation();
  const [results, setResults] = React.useState(null);
  const [argumentText, setArgumentText] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const resultsRef = React.useRef(null);

  const handleSubmit = async (text: string, model: string) => {
    setArgumentText(text);
    setIsLoading(true);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text, model }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze argument");
      }

      const data = await response.json();
      setResults(data);

      // Scroll to results
      if (resultsRef.current) {
        resultsRef.current.scrollIntoView({ behavior: "smooth" });
      }
    } catch (error) {
      console.error("Error:", error);
      // Handle error state here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <ArgumentForm onSubmit={handleSubmit} isLoading={isLoading} />
          <div ref={resultsRef}>
            {results && (
              <ResultsDisplay results={results} argumentText={argumentText} />
            )}
          </div>
        </div>
      </section>
      <ApiGuide />
      <Features />
      <Pricing />
      <Testimonials />
      <Faq />
      <NewsletterSignup />
      <Footer />
    </div>
  );
}