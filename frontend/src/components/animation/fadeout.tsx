"use client";

import { motion } from "framer-motion";

const fadeOut = {
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    filter: "blur(0px)",
  },
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: 16,
    filter: "blur(4px)",
    transition: {
      type: "spring",
      stiffness: 150,
      damping: 19,
      mass: 1.2,
    },
  },
};

function FadeOut({
  children,
  className,
  isVisible = true,
}: {
  children: React.ReactNode;
  className?: string;
  isVisible?: boolean;
}) {
  return (
    <motion.div
      variants={fadeOut}
      initial="visible"
      animate={isVisible ? "visible" : "hidden"}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export { FadeOut };
