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
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive mb-6">
          <AlertTriangle className="h-8 w-8" />
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
