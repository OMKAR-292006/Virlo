import { motion } from 'framer-motion';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  className?: string;
};

export default function TransitionWrapper({ children, className }: Props) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  );
}
