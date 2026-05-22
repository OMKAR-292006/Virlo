"use client";

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function AuthSuccess({ message = "Setting up your workspace..." }: { message?: string }) {
  return (
    <motion.div
      className="fixed inset-0 bg-black z-[999] flex flex-col items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_50%,rgba(59,130,246,0.12),transparent)]" />

      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Animated logo */}
        <motion.div
          className="relative"
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* Outer ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-blue-500/30"
            animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            style={{ margin: '-12px' }}
          />
          {/* Inner ring */}
          <motion.div
            className="absolute inset-0 rounded-full border border-blue-400/20"
            animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
            style={{ margin: '-6px' }}
          />
          <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-sm">
            <Sparkles size={28} className="text-white" />
          </div>
        </motion.div>

        {/* Brand name */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <p className="text-white font-bold text-xl tracking-tight mb-1">Brand Matic</p>
          <p className="text-neutral-500 text-sm">{message}</p>
        </motion.div>

        {/* Progress bar */}
        <motion.div
          className="w-48 h-0.5 bg-white/10 rounded-full overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ delay: 0.5, duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
