import { create } from 'zustand';
import type { AppState, OptimizationPass, OptimizationResult } from '@/types';

const DEFAULT_CODE = `// Intermediate Representation Example
t1 = a + b
t2 = t1 * 2
t3 = a + b
if t2 > 10 goto L1
t4 = t1 + 5
L1:
t5 = t4 - t2
t6 = t5 + 0`;

const DEFAULT_PASSES: OptimizationPass[] = [
  { id: 'constant_folding', name: 'Constant Folding', description: 'Evaluate constant expressions at compile time', icon: 'zap', enabled: true },
  { id: 'constant_propagation', name: 'Constant Propagation', description: 'Replace variables with known constant values', icon: 'arrow-right', enabled: true },
  { id: 'copy_propagation', name: 'Copy Propagation', description: 'Replace uses of variables with their copies', icon: 'copy', enabled: true },
  { id: 'cse', name: 'Common Subexpr. Elimination', description: 'Eliminate redundant expressions', icon: 'combine', enabled: true },
  { id: 'dead_code', name: 'Dead Code Elimination', description: 'Remove unreachable or unused code', icon: 'trash-2', enabled: true },
  { id: 'strength_reduction', name: 'Strength Reduction', description: 'Replace expensive operations with cheaper ones', icon: 'arrow-down', enabled: true },
];

async function runOptimizer(code: string, passes: OptimizationPass[]): Promise<OptimizationResult> {
  const enabledPassIds = passes.filter((p) => p.enabled).map((p) => p.id);
  const response = await fetch('/api/optimize', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      code,
      passes: enabledPassIds,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const message = typeof errorBody?.error === 'string' ? errorBody.error : `Request failed (${response.status})`;
    throw new Error(message);
  }

  return response.json() as Promise<OptimizationResult>;
}

export const useStore = create<AppState>((set, get) => ({
  code: DEFAULT_CODE,
  passes: DEFAULT_PASSES,
  result: null,
  isRunning: false,
  currentStep: 0,
  executionSpeed: 1,
  
  setCode: (code) => set({ code }),
  
  togglePass: (passId) => set(state => ({
    passes: state.passes.map(p =>
      p.id === passId ? { ...p, enabled: !p.enabled } : p
    )
  })),
  
  setResult: (result) => set({ result }),
  setIsRunning: (isRunning) => set({ isRunning }),
  setCurrentStep: (currentStep) => set({ currentStep }),
  setExecutionSpeed: (executionSpeed) => set({ executionSpeed }),
  
  runOptimization: async () => {
    const { code, passes, executionSpeed } = get();
    set({ isRunning: true, currentStep: 0, result: null });
    
    try {
      const result = await runOptimizer(code, passes);
      
      for (let i = 0; i <= result.steps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 600 / executionSpeed));
        set({ currentStep: i });
      }
      
      set({ result, isRunning: false });
    } catch (error) {
      console.error('Optimization error:', error);
      set({ isRunning: false });
    }
  }
}));
