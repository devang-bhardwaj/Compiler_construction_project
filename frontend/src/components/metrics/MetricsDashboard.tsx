import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Code2, Cpu, AlertTriangle } from 'lucide-react';
import { useStore } from '@/lib/store';
import { Card, CardHeader, CardTitle, AnimatedNumber, ProgressRing } from '@/components/ui';

interface MetricCardProps {
  label: string;
  before: number;
  after: number;
  icon: React.ReactNode;
  color: string;
  suffix?: string;
}

function MetricCard({ label, before, after, icon, color, suffix = '' }: MetricCardProps) {
  const diff = before - after;
  const isImproved = diff > 0;
  const isSame = diff === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-elevated rounded-xl p-4 relative overflow-hidden"
    >
      <div
        className="absolute inset-0 opacity-5"
        style={{
          background: `radial-gradient(circle at top right, ${color}, transparent 70%)`,
        }}
      />

      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${color}20`, color }}
            >
              {icon}
            </div>
            <span className="text-xs text-text-tertiary font-mono uppercase tracking-wide">
              {label}
            </span>
          </div>
          
          {!isSame && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-mono ${
                isImproved
                  ? 'bg-accent-green/20 text-accent-green'
                  : 'bg-accent-red/20 text-accent-red'
              }`}
            >
              {isImproved ? (
                <TrendingDown className="w-3 h-3" />
              ) : (
                <TrendingUp className="w-3 h-3" />
              )}
              {Math.abs(diff)}
            </motion.div>
          )}
        </div>

        <div className="flex items-end gap-3">
          <div className="flex-1">
            <div className="text-xs text-text-tertiary mb-1">Before</div>
            <AnimatedNumber
              value={before}
              suffix={suffix}
              className="text-2xl font-mono font-bold text-text-secondary"
            />
          </div>
          
          <div className="text-text-tertiary">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
          
          <div className="flex-1 text-right">
            <div className="text-xs text-text-tertiary mb-1">After</div>
            <AnimatedNumber
              value={after}
              suffix={suffix}
              className="text-2xl font-mono font-bold"
              style={{ color: isImproved ? '#10b981' : isSame ? '#f0f0f5' : '#ef4444' }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function MetricsDashboard() {
  const { result } = useStore();

  if (!result) {
    return (
      <Card className="h-full flex items-center justify-center" padding="lg">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-border-subtle flex items-center justify-center">
            <Cpu className="w-8 h-8 text-text-tertiary" />
          </div>
          <p className="text-text-secondary font-mono text-sm">No metrics yet</p>
          <p className="text-text-tertiary text-xs mt-1">Run optimization to see performance metrics</p>
        </div>
      </Card>
    );
  }

  const { before, after } = result.metrics;
  const improvementPercent = before.instructionCount > 0
    ? Math.round(((before.instructionCount - after.instructionCount) / before.instructionCount) * 100)
    : 0;

  return (
    <div className="space-y-4">
      <Card padding="none">
        <CardHeader className="px-4 pt-4 pb-2">
          <CardTitle className="text-sm">Performance Metrics</CardTitle>
        </CardHeader>
        <div className="p-4">
          <div className="flex items-center gap-6">
            <ProgressRing
              value={Math.max(0, improvementPercent)}
              max={100}
              size={100}
              strokeWidth={8}
              color={improvementPercent > 0 ? '#10b981' : improvementPercent < 0 ? '#ef4444' : '#f0f0f5'}
            />
            <div className="flex-1">
              <div className="text-3xl font-mono font-bold text-gradient mb-1">
                {improvementPercent > 0 ? '-' : improvementPercent < 0 ? '+' : ''}
                {Math.abs(improvementPercent)}%
              </div>
              <p className="text-sm text-text-secondary">
                {improvementPercent > 0 ? 'Instructions Reduced' : improvementPercent < 0 ? 'Instructions Added' : 'No Change'}
              </p>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-3">
        <MetricCard
          label="Instructions"
          before={before.instructionCount}
          after={after.instructionCount}
          icon={<Code2 className="w-4 h-4" />}
          color="#00d4ff"
        />
        <MetricCard
          label="Est. Cycles"
          before={before.estimatedCycles}
          after={after.estimatedCycles}
          icon={<Cpu className="w-4 h-4" />}
          color="#a855f7"
        />
        <MetricCard
          label="Redundant Ops"
          before={before.redundantOps}
          after={after.redundantOps}
          icon={<AlertTriangle className="w-4 h-4" />}
          color="#f59e0b"
        />
      </div>
    </div>
  );
}
