export type Finding = {
  id: string;
  title: string;
  detail: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: string;
  line?: number;
};

export type Analysis = {
  score: number;
  label: 'Needs attention' | 'Review recommended' | 'Looks ready';
  findings: Finding[];
  summary: string;
  checkedAt: string;
};

const rules: Array<{
  id: string;
  pattern: RegExp;
  title: string;
  detail: string;
  severity: Finding['severity'];
  category: string;
}> = [
  {
    id: 'secret',
    pattern: /(?:api[_-]?key|secret|password|access[_-]?token)\s*[:=]\s*["'][^"']{8,}["']/i,
    title: 'Possible hard-coded secret',
    detail: 'A value assigned to a secret-like variable looks hard-coded. Verify it is a placeholder and move real credentials to protected CI/CD variables.',
    severity: 'critical',
    category: 'Security'
  },
  {
    id: 'debug',
    pattern: /\bconsole\.(?:log|debug)\s*\(/,
    title: 'Debug output in changed code',
    detail: 'Debug logging may expose internal data or clutter production logs. Remove it or use your approved logger.',
    severity: 'low',
    category: 'Quality'
  },
  {
    id: 'unsafe-html',
    pattern: /dangerouslySetInnerHTML/,
    title: 'HTML injection surface',
    detail: 'Direct HTML rendering can create cross-site scripting risk if input is not sanitized. Confirm the source is trusted or sanitize it.',
    severity: 'high',
    category: 'Security'
  },
  {
    id: 'disable-tls',
    pattern: /rejectUnauthorized\s*:\s*false|NODE_TLS_REJECT_UNAUTHORIZED\s*=\s*['"]?0/,
    title: 'TLS verification disabled',
    detail: 'Disabling certificate verification weakens connection security. Avoid this in production and fix the certificate chain instead.',
    severity: 'critical',
    category: 'Security'
  },
  {
    id: 'todo',
    pattern: /\bTODO\b|\bFIXME\b/,
    title: 'Unresolved implementation note',
    detail: 'A TODO/FIXME marker appears in the change. Confirm it is intentional and does not represent unfinished release-critical work.',
    severity: 'medium',
    category: 'Readiness'
  },
  {
    id: 'broad-catch',
    pattern: /catch\s*\([^)]*\)\s*\{\s*\}/,
    title: 'Empty error handler',
    detail: 'An empty catch block can hide failures. Log, rethrow, or handle the error explicitly.',
    severity: 'medium',
    category: 'Reliability'
  }
];

export function analyzeDiff(input: string): Analysis {
  const findings: Finding[] = [];
  const seen = new Set<string>();
  const lines = input.split(/\r?\n/);

  lines.forEach((line, index) => {
    const changedLine = line.startsWith('+') && !line.startsWith('+++') ? line.slice(1) : line;
    const isDiff = line.startsWith('+') && !line.startsWith('+++');
    // Also analyze pasted source snippets when the input is not a unified diff.
    const candidate = input.includes('diff --git') ? (isDiff ? changedLine : '') : line;
    if (!candidate) return;
    rules.forEach((rule) => {
      if (rule.pattern.test(candidate)) {
        const key = `${rule.id}:${index}`;
        if (seen.has(key)) return;
        seen.add(key);
        findings.push({
          id: key,
          title: rule.title,
          detail: rule.detail,
          severity: rule.severity,
          category: rule.category,
          line: index + 1
        });
      }
    });
  });

  const weight: Record<Finding['severity'], number> = { critical: 34, high: 22, medium: 12, low: 4 };
  const score = Math.max(0, 100 - findings.reduce((sum, item) => sum + weight[item.severity], 0));
  const label = score < 55 ? 'Needs attention' : score < 82 ? 'Review recommended' : 'Looks ready';
  const summary = findings.length === 0
    ? 'No matches were found by the current heuristic checks. This is not proof that the change is safe; review tests and the full diff before merging.'
    : `${findings.length} potential issue${findings.length === 1 ? '' : 's'} detected. Review each finding in context; these checks can produce false positives and miss issues.`;
  return { score, label, findings, summary, checkedAt: new Date().toISOString() };
}

export const sampleDiff = `diff --git a/src/auth.ts b/src/auth.ts
index 19acde1..2f41bd9 100644
--- a/src/auth.ts
+++ b/src/auth.ts
@@ -1,6 +1,9 @@
 export async function signIn(email: string, password: string) {
+  const api_key = "sk_demo_only_replace_me_123456";
+  console.log("sign-in attempt", email);
+  // TODO: add rate limiting before production
+  const response = await fetch("/api/session", { method: "POST" });
   return response;
 }`;
