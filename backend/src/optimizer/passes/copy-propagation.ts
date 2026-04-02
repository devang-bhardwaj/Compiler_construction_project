import type { Instruction, Change } from '../../types/index.js';
import { formatInstruction, getDefinedVar, isControlFlow, isNumericLiteral } from '../utils.js';

export function copyPropagation(instructions: Instruction[]): { result: Instruction[]; changes: Change[] } {
  const changes: Change[] = [];
  const copyMap: Record<string, string> = {};
  const definedAt: Record<string, number> = {};
  
  const result: Instruction[] = [];
  
  instructions.forEach((inst, idx) => {
    if (isControlFlow(inst)) {
      result.push(inst);
      return;
    }

    const defined = getDefinedVar(inst);
    
    if (defined && definedAt[defined] !== undefined) {
      delete copyMap[defined];
    }

    if (defined) {
      definedAt[defined] = idx;
    }

    const newInst: Instruction = { ...inst };
    const before = formatInstruction(inst);

    if (inst.arg1) {
      let resolved = inst.arg1;
      let steps = 0;
      while (copyMap[resolved] !== undefined && steps < 10) {
        if (definedAt[resolved] >= idx) {
          break;
        }
        resolved = copyMap[resolved];
        steps++;
      }
      if (resolved !== inst.arg1) {
        newInst.arg1 = resolved;
      }
    }

    if (inst.arg2) {
      let resolved = inst.arg2;
      let steps = 0;
      while (copyMap[resolved] !== undefined && steps < 10) {
        if (definedAt[resolved] >= idx) {
          break;
        }
        resolved = copyMap[resolved];
        steps++;
      }
      if (resolved !== inst.arg2) {
        newInst.arg2 = resolved;
      }
    }

    const after = formatInstruction(newInst);
    if (before !== after) {
      changes.push({
        type: 'modified',
        line: inst.line,
        before,
        after,
        description: 'Copy propagation applied'
      });
    }

    if (newInst.op === '=' && newInst.arg1 && !newInst.arg2 && newInst.result) {
      if (!isNumericLiteral(newInst.arg1)) {
        let resolved = newInst.arg1;
        let steps = 0;
        while (copyMap[resolved] !== undefined && steps < 10) {
          resolved = copyMap[resolved];
          steps++;
        }
        copyMap[newInst.result] = resolved;
      }
    }

    result.push(newInst);
  });
  
  return { result, changes };
}
