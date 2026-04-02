import type { Instruction, Metrics, OptimizationStep, CFGData } from '../types/index.js';
import { parseIR, instructionsToString } from './parser.js';
import { buildCFG } from './cfg-builder.js';
import { constantFolding, commonSubexpressionElimination, deadCodeElimination, copyPropagation, strengthReduction, constantPropagation } from './passes/index.js';
import { flattenBlocks, splitIntoBasicBlocks } from './blocks.js';

export interface OptimizeOptions {
  code: string;
  passes: string[];
}

export interface OptimizeResult {
  optimizedCode: string;
  steps: OptimizationStep[];
  metrics: {
    before: Metrics;
    after: Metrics;
  };
  cfg: CFGData;
}

function calculateMetrics(instructions: Instruction[]): Metrics {
  let cycles = 0;
  let redundant = 0;
  
  const expressions: string[] = [];
  
  instructions.forEach(inst => {
    if (inst.arg1 && inst.arg2 && !inst.goto) {
      const expr = `${inst.arg1}${inst.op}${inst.arg2}`;
      if (expressions.includes(expr)) redundant++;
      expressions.push(expr);
    }
    
    switch (inst.op) {
      case '+': case '-': case '<<': case '>>': cycles += 1; break;
      case '*': case '/': cycles += 3; break;
      case '=': cycles += 1; break;
      default: cycles += 1;
    }
  });
  
  return {
    instructionCount: instructions.length,
    estimatedCycles: cycles,
    redundantOps: redundant
  };
}

const passFunctions: Record<string, (instructions: Instruction[]) => { result: Instruction[]; changes: any[] }> = {
  constant_folding: constantFolding,
  constant_propagation: constantPropagation,
  copy_propagation: copyPropagation,
  cse: commonSubexpressionElimination,
  dead_code: deadCodeElimination,
  strength_reduction: strengthReduction,
};

const passNames: Record<string, string> = {
  constant_folding: 'Constant Folding',
  constant_propagation: 'Constant Propagation',
  copy_propagation: 'Copy Propagation',
  cse: 'Common Subexpression Elimination',
  dead_code: 'Dead Code Elimination',
  strength_reduction: 'Strength Reduction',
};

export function optimize({ code, passes }: OptimizeOptions): OptimizeResult {
  let instructions = parseIR(code);
  const beforeMetrics = calculateMetrics(instructions);
  const steps: OptimizationStep[] = [];
  
  const enabledPasses = passes.filter(p => passFunctions[p]);

  let blocks = splitIntoBasicBlocks(instructions).blocks;

  for (const passId of enabledPasses) {
    const beforeAll = flattenBlocks(blocks);
    const passFn = passFunctions[passId];
    
    if (!passFn) continue;

    const nextBlocks: Instruction[][] = [];
    const allChanges: any[] = [];

    blocks.forEach(block => {
      const { result, changes } = passFn(block);
      nextBlocks.push(result);
      allChanges.push(...changes);
    });

    const afterAll = flattenBlocks(nextBlocks);

    if (JSON.stringify(beforeAll) !== JSON.stringify(afterAll)) {
      steps.push({
        passId,
        passName: passNames[passId] || passId,
        before: beforeAll,
        after: afterAll,
        changes: allChanges.map(c => ({
          type: c.type,
          line: c.line,
          before: c.before,
          after: c.after,
          description: c.description
        })),
        timestamp: Date.now()
      });

      blocks = nextBlocks;
    }
  }

  instructions = flattenBlocks(blocks);
  const afterMetrics = calculateMetrics(instructions);
  const cfg = buildCFG(instructions);
  
  return {
    optimizedCode: instructionsToString(instructions),
    steps,
    metrics: { before: beforeMetrics, after: afterMetrics },
    cfg
  };
}
