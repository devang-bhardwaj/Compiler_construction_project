export interface Instruction {
  id: string;
  op: string;
  arg1?: string;
  arg2?: string;
  result?: string;
  label?: string;
  goto?: string;
  line: number;
}

export interface OptimizationPass {
  id: string;
  name: string;
  description: string;
  icon: string;
  enabled: boolean;
}

export interface OptimizationStep {
  passId: string;
  passName: string;
  before: Instruction[];
  after: Instruction[];
  changes: Change[];
  timestamp: number;
}

export interface Change {
  type: 'added' | 'removed' | 'modified';
  line: number;
  before?: string;
  after?: string;
  description: string;
}

export interface Metrics {
  instructionCount: number;
  estimatedCycles: number;
  redundantOps: number;
}

export interface CFGNode {
  id: string;
  label: string;
  instructions: Instruction[];
  position?: { x: number; y: number };
}

export interface CFGEdge {
  id: string;
  source: string;
  target: string;
  type?: 'normal' | 'conditional';
}

export interface CFGData {
  nodes: CFGNode[];
  edges: CFGEdge[];
}

export interface OptimizationResult {
  optimizedCode: string;
  steps: OptimizationStep[];
  metrics: {
    before: Metrics;
    after: Metrics;
  };
  cfg: CFGData;
}

export interface AppState {
  code: string;
  passes: OptimizationPass[];
  result: OptimizationResult | null;
  isRunning: boolean;
  currentStep: number;
  executionSpeed: number;
  setCode: (code: string) => void;
  togglePass: (passId: string) => void;
  setResult: (result: OptimizationResult | null) => void;
  setIsRunning: (isRunning: boolean) => void;
  setCurrentStep: (step: number) => void;
  setExecutionSpeed: (speed: number) => void;
  runOptimization: () => Promise<void>;
}
