import React from "react";
import Link from "next/link";
import { Compass, ArrowRight, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        {/* Custom Atlas Celestial Coordinate 404 Illustration */}
        <div className="relative mb-6 flex h-28 w-28 items-center justify-center" aria-hidden="true">
          <div className="absolute inset-0 rounded-full bg-primary/15 blur-2xl" />
          <svg
            className="relative h-28 w-28 text-muted-foreground/35"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Outer dotted orbit */}
            <circle cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="1" strokeDasharray="3 4" />
            
            {/* Tilted celestial coordinate ring */}
            <ellipse cx="50" cy="50" rx="42" ry="18" stroke="currentColor" strokeWidth="1.2" transform="rotate(-25 50 50)" />
            <ellipse cx="50" cy="50" rx="42" ry="18" stroke="currentColor" strokeWidth="1.2" transform="rotate(35 50 50)" strokeDasharray="2 3" />

            {/* Central Globe Core */}
            <circle cx="50" cy="50" r="22" stroke="currentColor" strokeWidth="1.5" className="fill-card/80" />
            
            {/* Meridian lines */}
            <ellipse cx="50" cy="50" rx="10" ry="22" stroke="currentColor" strokeWidth="1" />
            <line x1="28" y1="50" x2="72" y2="50" stroke="currentColor" strokeWidth="1" />

            {/* Disconnected waypoint beacon */}
            <circle cx="50" cy="50" r="4" className="fill-primary" />
            <circle cx="28" cy="22" r="2.5" className="fill-brand-cyan" />
            <circle cx="72" cy="78" r="2.5" className="fill-brand-purple" />
          </svg>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          404: Model or Route Not Found
        </h1>
        <p className="mt-3 max-w-md text-sm text-muted-foreground">
          The AI model, provider, or page you are looking for does not exist in our catalog or may have been renamed.
        </p>
        <div className="mt-8 flex items-center gap-3">
          <Link href="/models">
            <Button className="gap-2">
              <Compass className="h-4 w-4" />
              Explore All Models
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
