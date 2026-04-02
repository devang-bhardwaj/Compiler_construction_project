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
}

export interface Change {
  type: 'added' | 'removed' | 'modified';
  line: number;
  before?: string;
  after?: string;
  description: string;
}

export interface OptimizationStep {
  passId: string;
  passName: string;
  before: Instruction[];
  after: Instruction[];
  changes: Change[];
  timestamp: number;
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

export interface OptimizeRequest {
  code: string;
  passes: string[];
}

export const OPTIMIZATION_PASSES: OptimizationPass[] = [
  { id: 'constant_folding', name: 'Constant Folding', description: 'Evaluate constant expressions at compile time' },
  { id: 'constant_propagation', name: 'Constant Propagation', description: 'Replace variables with known constant values' },
  { id: 'copy_propagation', name: 'Copy Propagation', description: 'Replace uses of variables with their copies' },
  { id: 'cse', name: 'Common Subexpression Elimination', description: 'Eliminate redundant expressions' },
  { id: 'dead_code', name: 'Dead Code Elimination', description: 'Remove unreachable or unused code' },
  { id: 'strength_reduction', name: 'Strength Reduction', description: 'Replace expensive operations with cheaper ones' },
];
