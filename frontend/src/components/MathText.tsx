import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

const katexOptions = {
  macros: {
    '\\frac': '\\dfrac{#1}{#2}',
  },
};

// "$15 per hour" is money, not math: escape it so it isn't parsed as a math block
const escapeCurrency = (text: string) => {
  return text.replace(/(?<!\\)\$(\d[\d,]*(?:\.\d+)?)(?=\s+[A-Za-z]|[.,;?!)]|\s*$)/g,
    '\\$$$1'
  )
};

const autoWrapArithmetic = (text: string) => {
  if (/(?<!\\)\$/.test(text)) return text; // already has real math delimiters
  return text.replace(
    /(?<![\w\\])(\d+(?:\.\d+)?(?:\s*[+\-*/=]\s*\d+(?:\.\d+)?)+)/g,
    (expr) => `$${expr.replace(/\*/g, '\\times ').replace(/\//g, '\\div ')}$`
  );
};

interface MathTextProps {
  children: string;
}

export default function MathText({ children }: MathTextProps) {
  const processedText = escapeCurrency(autoWrapArithmetic(children));
  return (
    <ReactMarkdown
      remarkPlugins={[remarkMath]}
      rehypePlugins={[[rehypeKatex, katexOptions]]}
      components={{ p: ({ children }) => <span>{children}</span> }}
    >
      {processedText}
    </ReactMarkdown>
  );
}