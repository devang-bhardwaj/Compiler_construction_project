import type { Instruction, CFGData } from '../types/index.js';
import { splitIntoBasicBlocks } from './blocks.js';
import { isIf, isGoto } from './utils.js';

export function buildCFG(instructions: Instruction[]): CFGData {
  const nodes: CFGData['nodes'] = [];
  const edges: CFGData['edges'] = [];

  const { blocks, indexToBlock, labelToIndex } = splitIntoBasicBlocks(instructions);
  const labelToBlock: Record<string, number> = {};

  Object.entries(labelToIndex).forEach(([label, index]) => {
    const blockIndex = indexToBlock[index];
    if (blockIndex >= 0) labelToBlock[label] = blockIndex;
  });

  blocks.forEach((block, idx) => {
    const lastInst = block[block.length - 1];

    nodes.push({
      id: `block_${idx}`,
      label: `B${idx}`,
      instructions: block,
    });

    if (lastInst && isIf(lastInst) && lastInst.goto && labelToBlock[lastInst.goto] !== undefined) {
      edges.push({
        id: `e${idx}_if`,
        source: `block_${idx}`,
        target: `block_${labelToBlock[lastInst.goto]}`,
        type: 'conditional'
      });
      if (idx < blocks.length - 1) {
        edges.push({
          id: `e${idx}_fallthrough`,
          source: `block_${idx}`,
          target: `block_${idx + 1}`,
          type: 'normal'
        });
      }
      return;
    }

    if (lastInst && isGoto(lastInst) && lastInst.goto && labelToBlock[lastInst.goto] !== undefined) {
      edges.push({
        id: `e${idx}_goto`,
        source: `block_${idx}`,
        target: `block_${labelToBlock[lastInst.goto]}`,
        type: 'normal'
      });
      return;
    }

    if (idx < blocks.length - 1) {
      edges.push({
        id: `e${idx}_next`,
        source: `block_${idx}`,
        target: `block_${idx + 1}`,
        type: 'normal'
      });
    }
  });

  return { nodes, edges };
}
