import { describe, expect, it } from 'vitest';
import { analyzeDiff } from './analysis';

describe('analyzeDiff', () => {
  it('flags a possible hard-coded secret in a diff addition', () => {
    const result = analyzeDiff(`diff --git a/a.ts b/a.ts\n+const api_key = "sk_example_value_long";`);
    expect(result.findings.some((finding) => finding.id.startsWith('secret:'))).toBe(true);
    expect(result.score).toBeLessThan(100);
  });

  it('ignores removed lines in a unified diff', () => {
    const result = analyzeDiff(`diff --git a/a.ts b/a.ts\n- console.log("old debug");\n+ const answer = 42;`);
    expect(result.findings).toHaveLength(0);
  });

  it('returns a cautious message when no rules match', () => {
    const result = analyzeDiff('export const add = (a: number, b: number) => a + b;');
    expect(result.findings).toHaveLength(0);
    expect(result.summary).toContain('not proof');
  });

  it('flags TLS verification being disabled', () => {
    const result = analyzeDiff(`diff --git a/a.js b/a.js\n+const options = { rejectUnauthorized: false };`);
    expect(result.findings.some((finding) => finding.title === 'TLS verification disabled')).toBe(true);
  });
});