import { useState } from 'react';
import { motion } from 'framer-motion';
import Editor from '@monaco-editor/react';
import { Copy, Check, Download, ChevronDown, ChevronRight } from 'lucide-react';
import { useStore } from '@/lib/store';
import { Button, Card, CardHeader, CardTitle } from '@/components/ui';

export function OutputPanel() {
  const { result } = useStore();
  const [copied, setCopied] = useState(false);
  const [showLog, setShowLog] = useState(false);

  const handleCopy = async () => {
    if (result?.optimizedCode) {
      await navigator.clipboard.writeText(result.optimizedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (result?.optimizedCode) {
      const blob = new Blob([result.optimizedCode], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'optimized.ir';
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  if (!result) {
    return (
      <Card className="h-full flex items-center justify-center" padding="lg">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-border-subtle flex items-center justify-center">
            <svg className="w-8 h-8 text-text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-text-secondary font-mono text-sm">No output yet</p>
          <p className="text-text-tertiary text-xs mt-1">Optimized IR will appear here</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col" padding="none">
      <CardHeader className="px-4 pt-4 pb-2 border-b border-border-subtle">
        <div className="flex items-center gap-2">
          <CardTitle className="text-sm">Optimized Code</CardTitle>
          <span className="px-2 py-0.5 rounded-full bg-accent-green/20 text-accent-green text-xs font-mono">
            {result.steps.length} passes
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={handleCopy}>
            {copied ? <Check className="w-3.5 h-3.5 text-accent-green" /> : <Copy className="w-3.5 h-3.5" />}
          </Button>
          <Button variant="ghost" size="sm" onClick={handleDownload}>
            <Download className="w-3.5 h-3.5" />
          </Button>
        </div>
      </CardHeader>

      <div className="flex-1 min-h-0">
        <Editor
          height="100%"
          defaultLanguage="ir"
          value={result.optimizedCode}
          options={{
            readOnly: true,
            fontSize: 14,
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            lineNumbers: 'on',
            folding: false,
            renderLineHighlight: 'none',
            scrollbar: {
              verticalScrollbarSize: 8,
              horizontalScrollbarSize: 8,
            },
            padding: { top: 16, bottom: 16 },
            automaticLayout: true,
            wordWrap: 'on',
          }}
          theme="vs-dark"
        />
      </div>

      {result.steps.length > 0 && (
        <div className="border-t border-border-subtle">
          <button
            onClick={() => setShowLog(!showLog)}
            className="w-full px-4 py-3 flex items-center justify-between text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            <span className="font-mono">Optimization Log</span>
            {showLog ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
          
          {showLog && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="px-4 pb-4 space-y-2 max-h-[200px] overflow-y-auto"
            >
              {result.steps.map((step, idx) => (
                <div key={`${step.passId}-${idx}`} className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-mono text-accent-cyan">
                    <span className="w-4 h-4 rounded bg-accent-cyan/20 flex items-center justify-center text-[10px]">
                      {idx + 1}
                    </span>
                    {step.passName}
                  </div>
                  {step.changes.map((change, cIdx) => (
                    <motion.div
                      key={cIdx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: cIdx * 0.05 }}
                      className={`ml-6 text-xs font-mono ${
                        change.type === 'removed'
                          ? 'text-accent-red'
                          : change.type === 'added'
                          ? 'text-accent-green'
                          : 'text-text-secondary'
                      }`}
                    >
                      {change.type === 'removed' && '− '}
                      {change.type === 'added' && '+ '}
                      {change.description}
                    </motion.div>
                  ))}
                </div>
              ))}
            </motion.div>
          )}
        </div>
      )}
    </Card>
  );
}
