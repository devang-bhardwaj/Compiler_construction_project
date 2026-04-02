import type { Instruction } from '../types/index.js';
import { formatInstruction, isNumericLiteral } from './utils.js';

export function parseIR(code: string): Instruction[] {
  const lines = code.split('\n');
  const instructions: Instruction[] = [];

  lines.forEach((rawLine, idx) => {
    const withoutComment = rawLine.split('//')[0];
    const trimmed = withoutComment.trim();
    if (!trimmed) return;

    const labelMatch = trimmed.match(/^([A-Za-z_]\w*):$/);
    if (labelMatch) {
      instructions.push({
        id: `L${idx}`,
        label: labelMatch[1],
        op: 'label',
        line: idx
      });
      return;
    }

    const ifMatch = trimmed.match(/^if\s+(.+?)\s+goto\s+([A-Za-z_]\w*)$/);
    if (ifMatch) {
      instructions.push({
        id: `I${idx}`,
        op: 'if',
        arg1: ifMatch[1].trim(),
        goto: ifMatch[2],
        line: idx
      });
      return;
    }

    const gotoMatch = trimmed.match(/^goto\s+([A-Za-z_]\w*)$/);
    if (gotoMatch) {
      instructions.push({
        id: `I${idx}`,
        op: 'goto',
        goto: gotoMatch[1],
        line: idx
      });
      return;
    }

    const assignMatch = trimmed.match(/^([A-Za-z_]\w*)\s*=\s*(.+)$/);
    if (assignMatch) {
      const result = assignMatch[1];
      const rhs = assignMatch[2].trim();

      const binaryMatch = rhs.match(/^(\S+)\s*(\+|-|\*|\/|<<|>>)\s*(\S+)$/);
      if (binaryMatch) {
        instructions.push({
          id: `I${idx}`,
          op: binaryMatch[2],
          arg1: binaryMatch[1],
          arg2: binaryMatch[3],
          result,
          line: idx
        });
        return;
      }

      instructions.push({
        id: `I${idx}`,
        op: '=',
        arg1: rhs,
        result,
        line: idx
      });
      return;
    }

    instructions.push({
      id: `I${idx}`,
      op: isNumericLiteral(trimmed) ? '=' : 'unknown',
      arg1: isNumericLiteral(trimmed) ? trimmed : undefined,
      line: idx
    });
  });

  return instructions;
}

export function instructionsToString(instructions: Instruction[]): string {
  return instructions.map(formatInstruction).join('\n');
}
