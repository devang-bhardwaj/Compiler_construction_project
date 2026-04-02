import { motion } from 'framer-motion';
import { Github, Zap } from 'lucide-react';

export function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-50 glass border-b border-border-subtle"
    >
      <div className="max-w-[1600px] mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              className="relative w-10 h-10 rounded-lg bg-gradient-to-br from-accent-cyan to-accent-purple flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Zap className="w-5 h-5 text-bg-deep" />
              <motion.div
                className="absolute inset-0 rounded-lg bg-gradient-to-br from-accent-cyan to-accent-purple"
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ filter: 'blur(8px)' }}
              />
            </motion.div>
            
            <div>
              <h1 className="font-mono font-bold text-lg text-gradient">
                ICO
              </h1>
              <p className="text-xs text-text-tertiary font-mono">
                Intermediate Code Optimizer
              </p>
            </div>
          </div>

          <nav className="flex items-center gap-6">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-secondary hover:text-text-primary transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
            
            <motion.div
              className="h-6 w-px bg-border-subtle"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: 0.2 }}
            />
            
            <span className="text-xs text-text-tertiary font-mono">
              v0.1.0
            </span>
          </nav>
        </div>
      </div>
    </motion.header>
  );
}
