import { useState } from 'react';
import { track } from '../analytics';

interface CodeBlockProps {
  code: string;
  language?: string;
}

export function CodeBlock({ code, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    track('code_copied', { language });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group rounded-lg bg-[#1e1e2e] overflow-hidden">
      {language && (
        <div className="flex items-center justify-between px-4 py-2 bg-[#181825] text-xs text-gray-400 border-b border-gray-700">
          <span>{language}</span>
          <button
            onClick={handleCopy}
            className="text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      )}
      <pre className="p-4 overflow-x-auto text-sm leading-relaxed">
        <code className="text-gray-200 whitespace-pre">{code}</code>
      </pre>
      {!language && (
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-gray-400 hover:text-white bg-[#181825] rounded px-2 py-1 cursor-pointer"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      )}
    </div>
  );
}
