import { motion } from 'framer-motion';
import { ReactNode } from 'react';

const DEFAULT_TRANSITION = {
  duration: 0.5,
  ease: [0.4, 0, 0.2, 1] as const,
};

type Props = {
  children: ReactNode;
  /** Optional custom className */
  className?: string;
};

export default function TransitionWrapper({ children, className }: Props) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={DEFAULT_TRANSITION}
    >
      {children}
    </motion.div>
  );
}
