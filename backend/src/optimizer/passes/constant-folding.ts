import type { Instruction, Change } from '../../types/index.js';
import { formatInstruction, isBinaryOp, isNumericLiteral } from '../utils.js';

export function constantFolding(instructions: Instruction[]): { result: Instruction[]; changes: Change[] } {
  const changes: Change[] = [];
  const result = instructions.map(inst => {
    if (!isBinaryOp(inst)) return inst;

    const a = inst.arg1 ? parseFloat(inst.arg1) : NaN;
    const b = inst.arg2 ? parseFloat(inst.arg2) : NaN;

    if (!isNumericLiteral(inst.arg1!) || !isNumericLiteral(inst.arg2!)) {
      return inst;
    }

    let computed: number | null = null;

    switch (inst.op) {
      case '+': computed = a + b; break;
      case '-': computed = a - b; break;
      case '*': computed = a * b; break;
      case '/': computed = b !== 0 ? a / b : null; break;
      default: break;
    }

    if (computed !== null) {
      const nextInst: Instruction = { ...inst, op: '=', arg1: computed.toString(), arg2: undefined };
      changes.push({
        type: 'modified',
        line: inst.line,
        before: formatInstruction(inst),
        after: formatInstruction(nextInst),
        description: `Constant folded: ${inst.arg1} ${inst.op} ${inst.arg2} → ${computed}`
      });
      return nextInst;
    }
    return inst;
  });
  
  return { result, changes };
}
