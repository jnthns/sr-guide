import { useState, useMemo } from 'react';
import { track } from '../analytics';

interface CodeBlockProps {
  code: string;
  language?: string;
}

/* ── Lightweight syntax highlighter ──────────────────────────────── */

type TokenType = 'comment' | 'string' | 'keyword' | 'number' | 'punctuation' | 'default';

interface Token {
  type: TokenType;
  value: string;
}

const JS_KEYWORDS = new Set([
  'import', 'from', 'export', 'default', 'const', 'let', 'var', 'function',
  'return', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break',
  'continue', 'new', 'this', 'class', 'extends', 'async', 'await', 'try',
  'catch', 'throw', 'typeof', 'instanceof', 'in', 'of', 'true', 'false',
  'null', 'undefined', 'void', 'yield', 'delete', 'type', 'interface', 'as',
]);

const SWIFT_KEYWORDS = new Set([
  'import', 'let', 'var', 'func', 'class', 'struct', 'enum', 'protocol',
  'return', 'if', 'else', 'for', 'while', 'switch', 'case', 'break',
  'true', 'false', 'nil', 'self', 'Self', 'guard', 'defer', 'do', 'try',
  'catch', 'throw', 'throws', 'async', 'await', 'override', 'init',
  'static', 'private', 'public', 'internal', 'open', 'fileprivate', 'in',
]);

const KOTLIN_KEYWORDS = new Set([
  'import', 'val', 'var', 'fun', 'class', 'object', 'interface', 'return',
  'if', 'else', 'for', 'while', 'when', 'is', 'in', 'true', 'false',
  'null', 'this', 'super', 'override', 'private', 'public', 'internal',
  'protected', 'open', 'data', 'sealed', 'companion', 'lateinit', 'by',
  'suspend', 'async', 'await', 'try', 'catch', 'throw',
]);

function getKeywords(language?: string): Set<string> {
  switch (language) {
    case 'swift':
      return SWIFT_KEYWORDS;
    case 'kotlin':
      return KOTLIN_KEYWORDS;
    default:
      return JS_KEYWORDS;
  }
}

function tokenize(code: string, language?: string): Token[] {
  if (language === 'shell') {
    return [{ type: 'default', value: code }];
  }

  const keywords = getKeywords(language);
  const tokens: Token[] = [];
  let i = 0;
  let buf = '';

  function flush() {
    if (buf) {
      tokens.push({ type: 'default', value: buf });
      buf = '';
    }
  }

  function pushKeywordsFromBuffer() {
    if (!buf) return;
    const parts = buf.split(/\b/);
    for (const part of parts) {
      if (keywords.has(part)) {
        tokens.push({ type: 'keyword', value: part });
      } else if (/^\d[\d._]*$/.test(part)) {
        tokens.push({ type: 'number', value: part });
      } else {
        tokens.push({ type: 'default', value: part });
      }
    }
    buf = '';
  }

  while (i < code.length) {
    const ch = code[i];
    const next = code[i + 1];

    // HTML comments
    if (language === 'html' && ch === '<' && code.slice(i, i + 4) === '<!--') {
      pushKeywordsFromBuffer();
      const end = code.indexOf('-->', i + 4);
      const commentEnd = end === -1 ? code.length : end + 3;
      tokens.push({ type: 'comment', value: code.slice(i, commentEnd) });
      i = commentEnd;
      continue;
    }

    // Block comments /* */
    if (ch === '/' && next === '*') {
      pushKeywordsFromBuffer();
      const end = code.indexOf('*/', i + 2);
      const commentEnd = end === -1 ? code.length : end + 2;
      tokens.push({ type: 'comment', value: code.slice(i, commentEnd) });
      i = commentEnd;
      continue;
    }

    // Line comments //
    if (ch === '/' && next === '/') {
      pushKeywordsFromBuffer();
      const end = code.indexOf('\n', i);
      const commentEnd = end === -1 ? code.length : end;
      tokens.push({ type: 'comment', value: code.slice(i, commentEnd) });
      i = commentEnd;
      continue;
    }

    // Shell/Python comments #
    if (ch === '#' && (language === 'shell' || i === 0 || code[i - 1] === '\n' || code[i - 1] === ' ')) {
      if (language !== 'html') {
        pushKeywordsFromBuffer();
        const end = code.indexOf('\n', i);
        const commentEnd = end === -1 ? code.length : end;
        tokens.push({ type: 'comment', value: code.slice(i, commentEnd) });
        i = commentEnd;
        continue;
      }
    }

    // Strings: single quote, double quote, backtick
    if (ch === "'" || ch === '"' || ch === '`') {
      pushKeywordsFromBuffer();
      const quote = ch;
      let j = i + 1;
      while (j < code.length) {
        if (code[j] === '\\') {
          j += 2;
          continue;
        }
        if (code[j] === quote) {
          j++;
          break;
        }
        if (quote !== '`' && code[j] === '\n') break;
        j++;
      }
      tokens.push({ type: 'string', value: code.slice(i, j) });
      i = j;
      continue;
    }

    // HTML tags get default treatment
    buf += ch;
    i++;
  }

  pushKeywordsFromBuffer();
  return tokens;
}

const tokenColors: Record<TokenType, string> = {
  comment: 'text-[#6a9955]',
  string: 'text-[#ce9178]',
  keyword: 'text-[#c586c0]',
  number: 'text-[#b5cea8]',
  punctuation: 'text-[#d4d4d4]',
  default: 'text-[#d4d4d4]',
};

function HighlightedCode({ code, language }: { code: string; language?: string }) {
  const tokens = useMemo(() => tokenize(code, language), [code, language]);

  return (
    <>
      {tokens.map((t, i) => (
        <span key={i} className={tokenColors[t.type]}>{t.value}</span>
      ))}
    </>
  );
}

/* ── CodeBlock component ─────────────────────────────────────────── */

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
        <code className="whitespace-pre">
          <HighlightedCode code={code} language={language} />
        </code>
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
