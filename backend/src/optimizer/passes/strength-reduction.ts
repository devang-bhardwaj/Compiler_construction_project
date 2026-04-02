import type { Instruction, Change } from '../../types/index.js';
import { formatInstruction, isBinaryOp, isNumericLiteral } from '../utils.js';

export function strengthReduction(instructions: Instruction[]): { result: Instruction[]; changes: Change[] } {
  const changes: Change[] = [];
  
  const result = instructions.map(inst => {
    if (!isBinaryOp(inst)) return inst;
    if (inst.op !== '*' || !inst.arg2 || !isNumericLiteral(inst.arg2)) return inst;

    if (inst.arg2 === '2') {
      const nextInst: Instruction = { ...inst, op: '+', arg2: inst.arg1 };
      changes.push({
        type: 'modified',
        line: inst.line,
        before: formatInstruction(inst),
        after: formatInstruction(nextInst),
        description: 'Strength reduction: x * 2 → x + x'
      });
      return nextInst;
    }

    const power = parseInt(inst.arg2, 10);
    if (!Number.isNaN(power) && power >= 4 && (power & (power - 1)) === 0) {
      const shiftAmount = Math.log2(power);
      const nextInst: Instruction = { ...inst, op: '<<', arg2: shiftAmount.toString() };
      changes.push({
        type: 'modified',
        line: inst.line,
        before: formatInstruction(inst),
        after: formatInstruction(nextInst),
        description: `Strength reduction: multiplication by ${power} → left shift by ${shiftAmount}`
      });
      return nextInst;
    }

    return inst;
  });
  
  return { result, changes };
}
