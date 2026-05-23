import React from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
} from "lucide-react";
import { Button } from "../ui/button";
export const Pricing = () => (
  <section id="pricing" className="py-24 px-6">
    <div className="container mx-auto max-w-5xl">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Simple, transparent pricing
        </h2>
        <p className="text-muted-foreground text-lg">
          Start for free, upgrade when you need more power.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Free Tier */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="p-8 rounded-3xl bg-card border border-border"
        >
          <h3 className="text-2xl font-semibold mb-2">Hobby</h3>
          <div className="text-4xl font-bold mb-6">
            $0
            <span className="text-lg text-muted-foreground font-normal">
              /mo
            </span>
          </div>
          <p className="text-muted-foreground mb-8">
            Perfect for exploring the platform and personal projects.
          </p>
          <ul className="space-y-4 mb-8">
            {[
              "Up to 3 active forms",
              "100 responses per month",
              "Standard themes",
              "Public & unlisted visibility",
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3">
                <CheckCircle2 size={18} className="text-primary" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <Button variant="outline" className="w-full">
            Get Started Free
          </Button>
        </motion.div>

        {/* Pro Tier */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="p-8 rounded-3xl bg-secondary border border-primary relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
            Most Popular
          </div>
          <h3 className="text-2xl font-semibold mb-2">Pro</h3>
          <div className="text-4xl font-bold mb-6">
            $29
            <span className="text-lg text-muted-foreground font-normal">
              /mo
            </span>
          </div>
          <p className="text-muted-foreground mb-8">
            For professionals who need advanced logic and analytics.
          </p>
          <ul className="space-y-4 mb-8">
            {[
              "Unlimited active forms",
              "Unlimited responses",
              "Conditional logic & Multi-page",
              "CSV Exports & Analytics",
              "Password protected forms",
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3">
                <CheckCircle2 size={18} className="text-primary" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <Button className="w-full">Upgrade to Pro</Button>
        </motion.div>
      </div>
    </div>
  </section>
);