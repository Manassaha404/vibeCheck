import { type Variants } from "framer-motion";

export const CHART_COLORS = [
  "#E2FF32", /* Primary Acid Green */
  "#A78BFA", /* Purple */
  "#34D399", /* Mint */
  "#FB923C", /* Orange */
  "#60A5FA", /* Blue */
  "#F472B6", /* Pink */
  "#2DD4BF", /* Teal */
  "#FBBF24", /* Yellow */
  "#818CF8", /* Indigo */
  "#FB7185", /* Rose */
  "#38BDF8", /* Sky */
  "#C084FC", /* Violet */
  "#FACC15", /* Gold */
  "#10B981", /* Emerald */
  "#F43F5E", /* Crimson */
];

export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};
