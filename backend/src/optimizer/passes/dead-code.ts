import type { Instruction, Change } from '../../types/index.js';
import { formatInstruction, getDefinedVar, getUsedVars, isControlFlow, isTempVar } from '../utils.js';

export function deadCodeElimination(instructions: Instruction[]): { result: Instruction[]; changes: Change[] } {
  const changes: Change[] = [];

  const live = new Set<string>();
  const result: Instruction[] = [];

  for (let i = instructions.length - 1; i >= 0; i--) {
    const inst = instructions[i];

    if (isControlFlow(inst)) {
      getUsedVars(inst).forEach(v => live.add(v));
      result.push(inst);
      continue;
    }

    const defined = getDefinedVar(inst);
    const used = getUsedVars(inst);

    if (defined && isTempVar(defined) && !live.has(defined)) {
      changes.push({
        type: 'removed',
        line: inst.line,
        before: formatInstruction(inst),
        description: `Dead code eliminated: ${defined} is never used`
      });
      continue;
    }

    if (defined) live.delete(defined);
    used.forEach(v => live.add(v));
    result.push(inst);
  }

  result.reverse();
  
  return { result, changes };
}
