import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface CodePanelProps {
  code: string;
  language?: string;
}

export default function CodePanel({
  code,
  language = "python",
}: CodePanelProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border-2 border-navy shadow-brutal-sm">
      <div className="flex items-center justify-between bg-navy px-4 py-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-white">
          {language}
        </span>

        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-2 rounded-md bg-white/10 px-3 py-1 text-xs text-white transition hover:bg-white/20"
        >
          {copied ? (
            <>
              <Check size={14} />
              Copied
            </>
          ) : (
            <>
              <Copy size={14} />
              Copy
            </>
          )}
        </button>
      </div>

      <pre className="overflow-x-auto bg-[#1E1E1E] p-4 text-sm text-gray-100">
        <code>{code}</code>
      </pre>
    </div>
  );
}