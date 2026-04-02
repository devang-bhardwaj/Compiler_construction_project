import { describe, it, expect } from 'vitest';
import { parseIR } from '../optimizer/parser.js';
import { constantFolding } from '../optimizer/passes/constant-folding.js';
import { constantPropagation } from '../optimizer/passes/constant-propagation.js';
import { copyPropagation } from '../optimizer/passes/copy-propagation.js';
import { commonSubexpressionElimination } from '../optimizer/passes/cse.js';
import { deadCodeElimination } from '../optimizer/passes/dead-code.js';
import { strengthReduction } from '../optimizer/passes/strength-reduction.js';

describe('optimization passes', () => {
  it('constant folds numeric expressions', () => {
    const { result } = constantFolding(parseIR('t1 = 2 + 3'));
    expect(result[0].op).toBe('=');
    expect(result[0].arg1).toBe('5');
  });

  it('propagates constants and respects redefinition', () => {
    const code = `
t1 = 5
t2 = t1 + 1
t1 = 7
t3 = t1 + 1
`.trim();
    const { result } = constantPropagation(parseIR(code));
    expect(result[1].arg1).toBe('5');
    expect(result[3].arg1).toBe('7');
  });

  it('propagates copies and kills on redefinition', () => {
    const code = `
t1 = a
t2 = t1
t1 = b
t3 = t2 + c
`.trim();
    const { result } = copyPropagation(parseIR(code));
    expect(result[1].arg1).toBe('a');
    expect(result[3].arg1).toBe('a');
  });

  it('replaces common subexpressions with copies', () => {
    const code = `
t1 = a + b
t2 = a + b
`.trim();
    const { result } = commonSubexpressionElimination(parseIR(code));
    expect(result[1].op).toBe('=');
    expect(result[1].arg1).toBe('t1');
  });

  it('eliminates dead temporaries with backward liveness', () => {
    const code = `
t1 = a + b
t2 = t1 + c
t3 = t2 + d
`.trim();
    const { result } = deadCodeElimination(parseIR(code));
    expect(result.length).toBe(0);
  });

  it('reduces strength for powers of two', () => {
    const code = `
t1 = a * 8
t2 = b * 2
`.trim();
    const { result } = strengthReduction(parseIR(code));
    expect(result[0].op).toBe('<<');
    expect(result[0].arg2).toBe('3');
    expect(result[1].op).toBe('+');
    expect(result[1].arg2).toBe('b');
  });
});
