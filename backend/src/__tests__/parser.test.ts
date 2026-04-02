import { describe, it, expect } from 'vitest';
import { parseIR, instructionsToString } from '../optimizer/parser.js';

describe('parseIR', () => {
  it('parses labels, gotos, ifs, and assignments with round-trip', () => {
    const code = `
L1:
t1 = a + b
t2 = t1
if t2 > 10 goto L1
goto L2
L2:
t3 = 2 * 4
`.trim();

    const instructions = parseIR(code);
    expect(instructions.length).toBe(7);

    const roundTrip = instructionsToString(instructions);
    expect(roundTrip).toBe(code);
  });
});
