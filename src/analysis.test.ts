import { describe, expect, it } from 'vitest';
import { analyzeDiff } from './analysis';

describe('analyzeDiff', () => {
  it('flags a possible hard-coded secret in a diff addition', () => {
    const result = analyzeDiff(`diff --git a/a.ts b/a.ts
@@ -1,1 +1,2 @@
+const api_key = "sk_example_value_long";`);
    expect(result.findings.some((finding) => finding.id.startsWith('secret:'))).toBe(true);
    expect(result.score).toBeLessThan(100);
  });

  it('ignores removed lines in a unified diff', () => {
    const result = analyzeDiff(`diff --git a/a.ts b/a.ts
@@ -1,2 +1,2 @@
- console.log("old debug");
+ const answer = 42;`);
    expect(result.findings).toHaveLength(0);
  });

  it('reports the new-file line number from a hunk header', () => {
    const result = analyzeDiff(`diff --git a/a.ts b/a.ts
index 1111111..2222222 100644
--- a/a.ts
+++ b/a.ts
@@ -20,2 +20,3 @@
 const first = 1;
+console.log("debug");
 const second = 2;`);
    expect(result.findings[0]?.line).toBe(21);
  });

  it('counts context lines but not removed lines when mapping line numbers', () => {
    const result = analyzeDiff(`diff --git a/a.ts b/a.ts
@@ -5,3 +5,3 @@
 const first = 1;
-const oldValue = 2;
+console.log("debug");
 const last = 3;`);
    expect(result.findings[0]?.line).toBe(6);
  });

  it('handles CRLF unified diffs', () => {
    const result = analyzeDiff('diff --git a/a.ts b/a.ts\r\n@@ -1,1 +1,1 @@\r\n+console.log("debug");');
    expect(result.findings[0]?.line).toBe(1);
  });

  it('analyzes pasted source snippets with source line numbers', () => {
    const result = analyzeDiff('const answer = 42;\nconsole.log(answer);');
    expect(result.findings[0]?.line).toBe(2);
  });

  it('returns a cautious message when no rules match', () => {
    const result = analyzeDiff('export const add = (a: number, b: number) => a + b;');
    expect(result.findings).toHaveLength(0);
    expect(result.summary).toContain('not proof');
    expect(result.label).toBe('Ready for human review');
  });

  it('flags TLS verification being disabled', () => {
    const result = analyzeDiff(`diff --git a/a.js b/a.js
@@ -1,1 +1,1 @@
+const options = { rejectUnauthorized: false };`);
    expect(result.findings.some((finding) => finding.title === 'TLS verification disabled')).toBe(true);
  });

  it('detects HTML injection surfaces, unfinished notes, and empty catch blocks', () => {
    const result = analyzeDiff([
      'const view = { dangerouslySetInnerHTML: { __html: value } };',
      '// TODO: revisit',
      'try { work(); } catch (error) {}'
    ].join('\n'));
    expect(result.findings.map(finding => finding.id)).toEqual([
      'unsafe-html:1',
      'todo:2',
      'broad-catch:3'
    ]);
  });
});
