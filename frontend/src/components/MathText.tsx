import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

export default function MathText({ children }: { children: string }) {
  const katexOptions = {
    macros: {
      '\\frac': '\\dfrac{#1}{#2}',
    },
  };
  return (
    <ReactMarkdown
      remarkPlugins={[remarkMath]}
      rehypePlugins={[[rehypeKatex, katexOptions]]}
      components={{ p: ({ children }) => <span>{children}</span> }}
    >
      {children}
    </ReactMarkdown>
  );
}