// src/components/MathText.tsx
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

const katexOptions = {
  macros: { '\\frac': '\\dfrac{#1}{#2}' },
};

// "$15 per hour" is money, not math
const escapeCurrency = (text: string) =>
  text.replace(
    /(?<!\\)\$(\d[\d,]*(?:\.\d+)?)(?=\s+[A-Za-z]|[.,;?!)]|\s*$)/g,
    '\\$$$1'
  );

// --- find "runs" of math in text that has no (or broken) $ delimiters ---
const CMD = String.raw`\\[A-Za-z]+(?:\{(?:[^{}]|\{[^{}]*\})*\})*`; // \frac{3}{4}, \times, \sqrt{x}
const TOKEN = String.raw`(?:${CMD}|\d+(?:\.\d+)?|(?<![A-Za-z])[A-Za-z](?![A-Za-z])|[=+\-*/^()<>])`;
const RUN = new RegExp(String.raw`${TOKEN}(?:\s*${TOKEN})*`, 'g');

const wrapMathRuns = (text: string) =>
  text.replace(RUN, (run) => {
    const [, lead, core, trail] = run.match(/^([\s=+\-*/^<>]*)([\s\S]*?)([\s=+\-*/^<>]*)$/)!;
    const hasCommand = /\\[A-Za-z]/.test(core);
    const hasEquation = /[\dA-Za-z]/.test(core) && /[=+\-*/^<>]/.test(core);
    if (!hasCommand && !hasEquation) return run; // lone number/letter: leave as text
    return `${lead}$${core.replace(/\*/g, '\\times ')}$${trail}`;
  });

// A $...$ segment containing real words ("This is incorrect") isn't math
const looksLikeProse = (s: string) =>
  /[A-Za-z]{4,}/.test(
    s.replace(/\\(?:text|mathrm|mathbf)\{[^}]*\}/g, '').replace(/\\[A-Za-z]+/g, '')
  );

const normalizeMath = (text: string) => {
  const dollars = text.match(/(?<!\\)\$/g)?.length ?? 0;

  if (dollars > 0 && dollars % 2 === 0) {
    const segments = [...text.matchAll(/(?<!\\)\$([^$]*)(?<!\\)\$/g)];
    if (segments.every((m) => !looksLikeProse(m[1]))) return text; // delimiters are trustworthy
  }

  // missing or broken delimiters: drop them and re-wrap the math ourselves
  return wrapMathRuns(text.replace(/(?<!\\)\$/g, ''));
};

export default function MathText({ children }: { children: string }) {
  const prepared = normalizeMath(escapeCurrency(children ?? ''));

  return (
    <ReactMarkdown
      remarkPlugins={[remarkMath]}
      rehypePlugins={[[rehypeKatex, katexOptions]]}
      components={{ p: ({ children }) => <span>{children}</span> }}
    >
      {prepared}
    </ReactMarkdown>
  );
}