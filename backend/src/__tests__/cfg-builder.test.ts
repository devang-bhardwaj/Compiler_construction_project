import { describe, it, expect } from 'vitest';
import { parseIR } from '../optimizer/parser.js';
import { buildCFG } from '../optimizer/cfg-builder.js';

describe('buildCFG', () => {
  it('builds blocks and edges for if/goto flow', () => {
    const code = `
t1 = a + b
if t1 > 0 goto L1
t2 = a + b
goto L2
L1:
t3 = a + b
L2:
t4 = a + b
`.trim();

    const cfg = buildCFG(parseIR(code));
    expect(cfg.nodes.length).toBe(4);

    const l1Node = cfg.nodes.find(node => node.instructions.some(inst => inst.label === 'L1'));
    const l2Node = cfg.nodes.find(node => node.instructions.some(inst => inst.label === 'L2'));
    expect(l1Node).toBeTruthy();
    expect(l2Node).toBeTruthy();

    expect(cfg.edges).toEqual(
      expect.arrayContaining([
        { id: 'e0_if', source: 'block_0', target: l1Node!.id, type: 'conditional' },
        { id: 'e0_fallthrough', source: 'block_0', target: 'block_1', type: 'normal' },
        { id: 'e1_goto', source: 'block_1', target: l2Node!.id, type: 'normal' },
        { id: 'e2_next', source: 'block_2', target: 'block_3', type: 'normal' }
      ])
    );
  });
});
