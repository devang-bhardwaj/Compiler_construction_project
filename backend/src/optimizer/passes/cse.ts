import type { Instruction, Change } from '../../types/index.js';
import { formatInstruction, isBinaryOp } from '../utils.js';

export function commonSubexpressionElimination(instructions: Instruction[]): { result: Instruction[]; changes: Change[] } {
  const changes: Change[] = [];
  const seen: Record<string, Instruction> = {};

  const result = instructions.map(inst => {
    if (!isBinaryOp(inst)) return inst;

    const key = `${inst.arg1}|${inst.op}|${inst.arg2}`;
    const previous = seen[key];

    if (previous && previous.result && inst.result && inst.result !== previous.result) {
      const nextInst: Instruction = {
        ...inst,
        op: '=',
        arg1: previous.result,
        arg2: undefined
      };
      changes.push({
        type: 'modified',
        line: inst.line,
        before: formatInstruction(inst),
        after: formatInstruction(nextInst),
        description: `CSE: Reused result from line ${previous.line}`
      });
      return nextInst;
    }

    seen[key] = inst;
    return inst;
  });
  
  return { result, changes };
}
