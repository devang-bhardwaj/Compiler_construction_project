import { motion } from 'framer-motion';
import { Zap, ArrowRight, Copy, Combine, Trash2, ArrowDown, Check, ChevronRight } from 'lucide-react';
import { useStore } from '@/lib/store';
import { Card, CardHeader, CardTitle, PulseIndicator } from '@/components/ui';

const ICONS: Record<string, React.ReactNode> = {
  zap: <Zap className="w-4 h-4" />,
  'arrow-right': <ArrowRight className="w-4 h-4" />,
  copy: <Copy className="w-4 h-4" />,
  combine: <Combine className="w-4 h-4" />,
  'trash-2': <Trash2 className="w-4 h-4" />,
  'arrow-down': <ArrowDown className="w-4 h-4" />,
};

export function OptimizationPipeline() {
  const { passes, togglePass, isRunning, currentStep, result } = useStore();

  return (
    <Card className="h-full" padding="none">
      <CardHeader className="px-4 pt-4 pb-2 border-b border-border-subtle">
        <CardTitle className="text-sm">Optimization Pipeline</CardTitle>
        <PulseIndicator active={isRunning} />
      </CardHeader>

      <div className="p-4 space-y-2">
        {passes.map((pass, index) => {
          const isComplete = result && result.steps.some(s => s.passId === pass.id);
          const isCurrent = isRunning && index === currentStep - 1;

          return (
            <motion.div
              key={pass.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center gap-3">
                <motion.button
                  onClick={() => !isRunning && togglePass(pass.id)}
                  disabled={isRunning}
                  whileHover={!pass.enabled ? { scale: 1.02 } : {}}
                  whileTap={!pass.enabled ? { scale: 0.98 } : {}}
                  className={`
                    relative flex-1 flex items-center gap-3 px-3 py-2.5 rounded-lg
                    border transition-all duration-200
                    ${pass.enabled
                      ? 'border-accent-cyan/30 bg-accent-cyan/5 hover:bg-accent-cyan/10'
                      : 'border-border-subtle bg-bg-surface hover:bg-bg-elevated'
                    }
                    ${isCurrent ? 'glow-border' : ''}
                    ${isComplete ? 'border-accent-green/30 bg-accent-green/5' : ''}
                    disabled:cursor-not-allowed
                  `}
                >
                  <motion.div
                    className={`
                      flex items-center justify-center w-8 h-8 rounded-lg
                      ${pass.enabled
                        ? 'bg-accent-cyan/20 text-accent-cyan'
                        : 'bg-border-subtle text-text-tertiary'
                      }
                      ${isComplete ? 'bg-accent-green/20 text-accent-green' : ''}
                    `}
                    animate={isCurrent ? {
                      boxShadow: ['0 0 0 0 rgba(0, 212, 255, 0.4)', '0 0 0 8px rgba(0, 212, 255, 0)'],
                    } : {}}
                    transition={{ duration: 1, repeat: isCurrent ? Infinity : 0 }}
                  >
                    {isComplete ? (
                      <Check className="w-4 h-4 text-accent-green" />
                    ) : (
                      ICONS[pass.icon] || <Zap className="w-4 h-4" />
                    )}
                  </motion.div>

                  <div className="flex-1 text-left">
                    <p className={`text-sm font-medium ${pass.enabled ? 'text-text-primary' : 'text-text-secondary'}`}>
                      {pass.name}
                    </p>
                    <p className="text-xs text-text-tertiary line-clamp-1">
                      {pass.description}
                    </p>
                  </div>

                  {isCurrent && (
                    <motion.div
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity }}
                    >
                      <ChevronRight className="w-4 h-4 text-accent-cyan" />
                    </motion.div>
                  )}
                </motion.button>

                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono
                  ${isComplete ? 'bg-accent-green/20 text-accent-green' : 'bg-border-subtle text-text-tertiary'}
                `}>
                  {index + 1}
                </div>
              </div>

              {index < passes.length - 1 && (
                <div className="flex justify-center py-1">
                  <motion.div
                    className={`w-0.5 h-4 rounded-full ${
                      isComplete ? 'bg-accent-green/50' : 'bg-border-subtle'
                    }`}
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ delay: index * 0.1 + 0.2 }}
                  />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {result && result.steps.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 pb-4"
        >
          <div className="border-t border-border-subtle pt-4">
            <p className="text-xs text-text-tertiary mb-2 font-mono">Applied Optimizations</p>
            <div className="space-y-1">
              {result.steps.map((step, idx) => (
                <motion.div
                  key={`${step.passId}-${idx}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center gap-2 text-xs"
                >
                  <Check className="w-3 h-3 text-accent-green" />
                  <span className="text-text-secondary">{step.passName}</span>
                  <span className="text-text-tertiary">•</span>
                  <span className="text-accent-green">{step.changes.length} changes</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </Card>
  );
}
