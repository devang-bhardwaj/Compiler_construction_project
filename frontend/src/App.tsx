import { motion } from 'framer-motion';
import { Header } from '@/components/Header';
import { CodeEditor } from '@/components/editor';
import { OptimizationPipeline } from '@/components/pipeline';
import { CFGVisualization } from '@/components/graph';
import { MetricsDashboard, OutputPanel } from '@/components/metrics';
import { ProjectExplainer } from '@/components/ProjectExplainer';

function BackgroundOrbs() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      <div className="bg-orb w-[500px] h-[500px] bg-accent-cyan -top-48 -left-48" />
      <div className="bg-orb w-[360px] h-[360px] bg-accent-purple bottom-0 right-0" />
    </div>
  );
}

function GridBackground() {
  return <div className="fixed inset-0 bg-grid opacity-30 pointer-events-none -z-10" />;
}

export default function App() {
  return (
    <div className="min-h-screen bg-bg-deep text-text-primary">
      <BackgroundOrbs />
      <GridBackground />
      
      <Header />

      <main className="max-w-[1600px] mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-mono font-bold mb-2">
            <span className="text-gradient">See</span> your code get simpler
          </h2>
          <p className="text-text-secondary">
            Paste IR code, run selected optimization passes, and compare before vs after instantly.
          </p>
        </motion.div>

        <ProjectExplainer />

        <div className="grid grid-cols-12 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="col-span-12 lg:col-span-5 xl:col-span-5"
          >
            <div className="space-y-6 h-full">
              <div className="h-[400px]">
                <CodeEditor />
              </div>
              <div className="h-[calc(100%-416px)] min-h-[300px]">
                <OptimizationPipeline />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="col-span-12 lg:col-span-7 xl:col-span-7"
          >
            <div className="h-[500px] mb-6">
              <CFGVisualization />
            </div>
            
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12 xl:col-span-4">
                <MetricsDashboard />
              </div>
              <div className="col-span-12 xl:col-span-8">
                <OutputPanel />
              </div>
            </div>
          </motion.div>
        </div>

        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-16 py-8 border-t border-border-subtle text-center"
        >
          <p className="text-text-tertiary text-sm font-mono">
            Built with precision • ICO v0.1.0
          </p>
        </motion.footer>
      </main>
    </div>
  );
}
