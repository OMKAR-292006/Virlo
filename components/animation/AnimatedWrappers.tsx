import { motion, MotionProps } from 'framer-motion';
import { ReactNode } from 'react';

const defaultProps: MotionProps = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
};

type Props = {
  children: ReactNode;
  /** optional additional motion props */
  motionProps?: MotionProps;
  className?: string;
};

export function FadeIn({ children, motionProps, className }: Props) {
  return (
    <motion.div
      className={className}
      {...defaultProps}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
}

export function SlideUp({ children, motionProps, className }: Props) {
  const slideProps: MotionProps = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
    ...motionProps,
  };
  return (
    <motion.div className={className} {...slideProps}>
      {children}
    </motion.div>
  );
}

export function ScaleIn({ children, motionProps, className }: Props) {
  const scaleProps: MotionProps = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
    ...motionProps,
  };
  return (
    <motion.div className={className} {...scaleProps}>
      {children}
    </motion.div>
  );
}
