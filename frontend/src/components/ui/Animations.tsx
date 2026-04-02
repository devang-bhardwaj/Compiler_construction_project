import { motion } from 'framer-motion';
import type { CSSProperties } from 'react';

interface AnimatedNumberProps {
  value: number;
  suffix?: string;
  prefix?: string;
  className?: string;
  style?: CSSProperties;
}

export function AnimatedNumber({ value, suffix = '', prefix = '', className = '', style }: AnimatedNumberProps) {
  return (
    <motion.span
      key={value}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={className}
      style={style}
    >
      {prefix}{value.toLocaleString()}{suffix}
    </motion.span>
  );
}

interface ProgressRingProps {
  value: number;
  max: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  className?: string;
}

export function ProgressRing({ value, max, size = 80, strokeWidth = 6, color = '#00d4ff', className = '' }: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percentage = Math.min((value / max) * 100, 100);
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <svg width={size} height={size} className={className}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#2a2a3a"
        strokeWidth={strokeWidth}
      />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
      />
    </svg>
  );
}

interface PulseIndicatorProps {
  active: boolean;
  color?: string;
  className?: string;
}

export function PulseIndicator({ active, color = '#00d4ff', className = '' }: PulseIndicatorProps) {
  return (
    <span className={className}>
      {active ? (
        <motion.span
          animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="inline-block w-2 h-2 rounded-full"
          style={{ backgroundColor: color }}
        />
      ) : (
        <span className="inline-block w-2 h-2 rounded-full bg-text-tertiary" />
      )}
    </span>
  );
}
