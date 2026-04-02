import type { Instruction } from '../types/index.js';

export function isNumericLiteral(value: string): boolean {
  return /^-?\d+(\.\d+)?$/.test(value);
}

export function isLabel(inst: Instruction): boolean {
  return Boolean(inst.label) || inst.op === 'label';
}

export function isGoto(inst: Instruction): boolean {
  return inst.op === 'goto';
}

export function isIf(inst: Instruction): boolean {
  return inst.op === 'if';
}

export function isControlFlow(inst: Instruction): boolean {
  return isLabel(inst) || isGoto(inst) || isIf(inst);
}

export function isAssignment(inst: Instruction): boolean {
  return Boolean(inst.result) && !isControlFlow(inst);
}

export function isBinaryOp(inst: Instruction): boolean {
  return isAssignment(inst) && Boolean(inst.arg1) && Boolean(inst.arg2) && inst.op !== '=';
}

export function extractVarsFromText(text: string): string[] {
  const matches = text.match(/[A-Za-z_]\w*/g);
  if (!matches) return [];
  return matches;
}

export function getUsedVars(inst: Instruction): string[] {
  if (isLabel(inst)) return [];
  if (isIf(inst)) {
    return inst.arg1 ? extractVarsFromText(inst.arg1) : [];
  }
  const used: string[] = [];
  if (inst.arg1) used.push(...extractVarsFromText(inst.arg1));
  if (inst.arg2) used.push(...extractVarsFromText(inst.arg2));
  return used;
}

export function getDefinedVar(inst: Instruction): string | undefined {
  if (isAssignment(inst)) return inst.result;
  return undefined;
}

export function isTempVar(name: string): boolean {
  return name.startsWith('t');
}

export function formatInstruction(inst: Instruction): string {
  if (inst.label) return `${inst.label}:`;
  if (inst.op === 'if') return `if ${inst.arg1} goto ${inst.goto}`;
  if (inst.op === 'goto') return `goto ${inst.goto}`;
  if (inst.result) {
    if (inst.op === '=' || !inst.arg2) return `${inst.result} = ${inst.arg1}`;
    return `${inst.result} = ${inst.arg1} ${inst.op} ${inst.arg2}`;
  }
  return inst.op;
}
