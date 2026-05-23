
import React from "react";
import { motion } from "framer-motion";
import {
  Lock,
  Globe,
  BarChart3,
  Palette,
  Share2,
  Workflow,
} from "lucide-react";
import { fadeUp, staggerContainer } from "./Hero";

export const Features = () => {
  const features = [
    {
      icon: <Globe size={24} />,
      title: "Public & Unlisted Modes",
      description:
        "Feature your forms on public explore pages, or keep them totally private with direct unlisted URL links.",
    },
    {
      icon: <Workflow size={24} />,
      title: "Conditional Logic",
      description:
        "Build dynamic, multi-page experiences that adapt based on how users answer previous questions.",
    },
    {
      icon: <Palette size={24} />,
      title: "Creative Themes",
      description:
        "Apply stunning aesthetics out of the box—from minimal tech startups to vibrant anime and gaming themes.",
    },
    {
      icon: <BarChart3 size={24} />,
      title: "Advanced Analytics",
      description:
        "View real-time dashboards, charts, response limits, and export all your data instantly to CSV.",
    },
    {
      icon: <Lock size={24} />,
      title: "Access Controls",
      description:
        "Secure forms with passwords, set strict form expiries, or limit total submission counts.",
    },
    {
      icon: <Share2 size={24} />,
      title: "Frictionless Sharing",
      description:
        "Generate custom slugs, QR codes, and shareable links. Respondents submit without needing an account.",
    },
  ];

  return (
    <section id="features" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything you need to collect data
          </h2>
          <p className="text-muted-foreground text-lg">
            A truly native SaaS experience with all the pro features built right
            in.
          </p>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              variants={fadeUp}
              whileHover={{ y: -5 }}
              className="p-6 rounded-2xl bg-card border border-border flex flex-col gap-4"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
