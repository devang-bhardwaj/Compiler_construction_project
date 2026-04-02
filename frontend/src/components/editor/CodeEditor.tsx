import { useCallback } from 'react';
import Editor, { type OnMount } from '@monaco-editor/react';
import { motion } from 'framer-motion';
import { Play, RotateCcw, Loader2 } from 'lucide-react';
import type { editor } from 'monaco-editor';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';

const IR_LANGUAGE_ID = 'ir';

export function CodeEditor() {
  const { code, setCode, runOptimization, isRunning } = useStore();

  const handleEditorMount: OnMount = useCallback((editor: editor.IStandaloneCodeEditor, monaco) => {
    monaco.languages.register({ id: IR_LANGUAGE_ID });
    
    monaco.languages.setMonarchTokensProvider(IR_LANGUAGE_ID, {
      tokenizer: {
        root: [
          [/t\d+\s*=/, 'variable'],
          [/L\d+:/, 'label'],
          [/if\b/, 'keyword'],
          [/goto\b/, 'keyword'],
          [/\d+/, 'number'],
          [/[+\-*/=<>]/, 'operator'],
          [/[a-zA-Z_]\w*/, 'identifier'],
        ],
      },
    });

    monaco.editor.defineTheme('ir-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'variable', foreground: '00d4ff', fontStyle: 'bold' },
        { token: 'label', foreground: 'a855f7', fontStyle: 'bold' },
        { token: 'keyword', foreground: 'f59e0b' },
        { token: 'number', foreground: '10b981' },
        { token: 'operator', foreground: 'f0f0f5' },
        { token: 'identifier', foreground: 'f0f0f5' },
      ],
      colors: {
        'editor.background': '#12121a',
        'editor.foreground': '#f0f0f5',
        'editor.lineHighlightBackground': '#1a1a2440',
        'editor.selectionBackground': '#00d4ff30',
        'editorLineNumber.foreground': '#5a5a70',
        'editorLineNumber.activeForeground': '#00d4ff',
        'editorCursor.foreground': '#00d4ff',
        'editor.inactiveSelectionBackground': '#2a2a3a',
      },
    });

    monaco.editor.setTheme('ir-dark');
    editor.focus();
  }, []);

  const handleReset = () => {
    setCode(`// Example IR code
t1 = a + b
t2 = t1 * 2
t3 = a + b
if t2 > 10 goto L1
t4 = t1 + 5
L1:
t5 = t4 - t2
t6 = t5 + 0`);
  };

  return (
    <Card className="h-full flex flex-col" padding="none">
      <CardHeader className="px-4 pt-4 pb-2 border-b border-border-subtle">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-accent-red/60" />
            <span className="w-3 h-3 rounded-full bg-accent-orange/60" />
            <span className="w-3 h-3 rounded-full bg-accent-green/60" />
          </div>
          <CardTitle className="text-sm ml-2">Intermediate Representation</CardTitle>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleReset} disabled={isRunning}>
            <RotateCcw className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={runOptimization}
            isLoading={isRunning}
          >
            <Play className="w-3.5 h-3.5" />
            {isRunning ? 'Running...' : 'Optimize'}
          </Button>
        </div>
      </CardHeader>
      
      <div className="flex-1 min-h-0">
        <Editor
          height="100%"
          defaultLanguage={IR_LANGUAGE_ID}
          value={code}
          onChange={(value) => setCode(value || '')}
          onMount={handleEditorMount}
          options={{
            fontSize: 14,
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            lineNumbers: 'on',
            glyphMargin: false,
            folding: false,
            lineDecorationsWidth: 0,
            lineNumbersMinChars: 3,
            renderLineHighlight: 'line',
            scrollbar: {
              verticalScrollbarSize: 8,
              horizontalScrollbarSize: 8,
            },
            padding: { top: 16, bottom: 16 },
            automaticLayout: true,
            tabSize: 2,
            wordWrap: 'on',
          }}
          loading={
            <div className="flex items-center justify-center h-full bg-bg-surface">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <Loader2 className="w-6 h-6 text-accent-cyan" />
              </motion.div>
            </div>
          }
        />
      </div>
    </Card>
  );
}
