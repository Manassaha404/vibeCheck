import React from "react";
import { motion, Variants } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Button } from "../ui/button";


export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

export const Hero = () => (
  <section className="pt-32 pb-20 md:pt-40 md:pb-32 px-6">
    <div className="container mx-auto text-center max-w-4xl">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="flex flex-col items-center gap-6"
      >
        <motion.div
          variants={fadeUp}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm font-medium border border-border"
        >
          <Sparkles size={16} className="text-primary" />
          <span>V2.0 is now live. Export to CSV & Conditional Logic</span>
        </motion.div>

        <motion.h1
          variants={fadeUp}
          className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1]"
        >
          Build Dynamic Forms. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
            Publish Anywhere.
          </span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
        >
          Create production-style forms with creative themes, advanced logic,
          and deep analytics. Share unlisted links or feature them publicly. No
          login required for respondents.
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="flex flex-col sm:flex-row items-center gap-4 mt-4"
        >
          <Button asChild className="h-12 px-8 text-base">
            <Link href="/form/create-form">
              Start Building Free <ArrowRight className="ml-2" size={18} />
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-12 px-8 text-base">
            <Link href="/dashboard">
              Go to Dashboard
            </Link>
          </Button>
        </motion.div>
      </motion.div>

      {/* Mockup Dashboard Preview */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
        className="mt-16 rounded-xl border border-border bg-card p-2 shadow-2xl relative"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 rounded-xl" />
        <img
          src="https://images.pexels.com/photos/1604025/pexels-photo-1604025.jpeg?auto=format&fit=crop&q=80&w=2000"
          alt="Dashboard Analytics Preview"
          className="rounded-lg opacity-50 grayscale hover:grayscale-0 transition-all duration-700 object-cover h-[400px] w-full"
        />
      </motion.div>
    </div>
  </section>
);