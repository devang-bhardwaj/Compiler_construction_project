import type { Instruction, Change } from '../../types/index.js';
import { formatInstruction, getDefinedVar, isControlFlow, isNumericLiteral } from '../utils.js';

export function constantPropagation(instructions: Instruction[]): { result: Instruction[]; changes: Change[] } {
  const changes: Change[] = [];
  const constVals: Record<string, string> = {};
  
  const result = instructions.map(inst => {
    if (isControlFlow(inst)) return inst;

    const newInst: Instruction = { ...inst };
    const before = formatInstruction(inst);

    if (inst.arg1 && constVals[inst.arg1]) {
      newInst.arg1 = constVals[inst.arg1];
    }

    if (inst.arg2 && constVals[inst.arg2]) {
      newInst.arg2 = constVals[inst.arg2];
    }

    const after = formatInstruction(newInst);
    if (before !== after) {
      changes.push({
        type: 'modified',
        line: inst.line,
        before,
        after,
        description: 'Constant propagation applied'
      });
    }

    const defined = getDefinedVar(inst);
    if (defined) {
      delete constVals[defined];
    }

    if (newInst.op === '=' && !newInst.arg2 && newInst.arg1 && newInst.result) {
      if (isNumericLiteral(newInst.arg1)) {
        constVals[newInst.result] = newInst.arg1;
      }
    }

    return newInst;
  });
  
  return { result, changes };
}
