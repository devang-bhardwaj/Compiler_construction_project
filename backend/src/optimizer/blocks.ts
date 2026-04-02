import type { Instruction } from '../types/index.js';
import { isIf, isGoto, isLabel } from './utils.js';

export interface BasicBlockResult {
  blocks: Instruction[][];
  indexToBlock: number[];
  labelToIndex: Record<string, number>;
}

export function splitIntoBasicBlocks(instructions: Instruction[]): BasicBlockResult {
  const labelToIndex: Record<string, number> = {};
  instructions.forEach((inst, idx) => {
    if (inst.label) labelToIndex[inst.label] = idx;
  });

  const leaders = new Set<number>();
  if (instructions.length > 0) leaders.add(0);

  instructions.forEach((inst, idx) => {
    if (isLabel(inst)) leaders.add(idx);

    if (isIf(inst) || isGoto(inst)) {
      if (typeof inst.goto === 'string' && labelToIndex[inst.goto] !== undefined) {
        leaders.add(labelToIndex[inst.goto]);
      }
      if (idx + 1 < instructions.length) {
        leaders.add(idx + 1);
      }
    }
  });

  const leaderList = Array.from(leaders).sort((a, b) => a - b);
  const blocks: Instruction[][] = [];
  const indexToBlock: number[] = new Array(instructions.length).fill(-1);

  for (let i = 0; i < leaderList.length; i++) {
    const start = leaderList[i];
    const end = i + 1 < leaderList.length ? leaderList[i + 1] : instructions.length;
    const block = instructions.slice(start, end);
    const blockIndex = blocks.length;
    block.forEach((_inst, offset) => {
      indexToBlock[start + offset] = blockIndex;
    });
    blocks.push(block);
  }

  return { blocks, indexToBlock, labelToIndex };
}

export function flattenBlocks(blocks: Instruction[][]): Instruction[] {
  return blocks.flat();
}
