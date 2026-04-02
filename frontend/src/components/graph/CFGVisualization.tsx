import { useEffect, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { motion } from 'framer-motion';
import { useStore } from '@/lib/store';
import { Card, CardHeader, CardTitle } from '@/components/ui';

function CFGNode({ data }: { data: { label: string; instructions: string[] } }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className="glass-elevated rounded-lg p-3 min-w-[120px] max-w-[200px] border border-border-subtle hover:border-accent-cyan/50 transition-colors"
    >
      <div className="flex items-center gap-2 mb-2">
        <div className="w-6 h-6 rounded bg-accent-cyan/20 flex items-center justify-center">
          <span className="text-xs font-mono text-accent-cyan">{data.label}</span>
        </div>
      </div>
      <div className="space-y-1">
        {data.instructions.slice(0, 4).map((inst, idx) => (
          <div key={idx} className="text-[10px] font-mono text-text-secondary truncate">
            {inst}
          </div>
        ))}
        {data.instructions.length > 4 && (
          <div className="text-[10px] font-mono text-text-tertiary">
            +{data.instructions.length - 4} more
          </div>
        )}
      </div>
    </motion.div>
  );
}

const nodeTypes = {
  cfgNode: CFGNode,
};

export function CFGVisualization() {
  const { result } = useStore();

  const initialNodes: Node[] = useMemo(() => {
    if (!result?.cfg?.nodes) return [];

    const cols = 3;
    return result.cfg.nodes.map((node, idx) => ({
      id: node.id,
      type: 'cfgNode',
      position: {
        x: (idx % cols) * 250 + 50,
        y: Math.floor(idx / cols) * 180 + 50,
      },
      data: {
        label: node.label,
        instructions: node.instructions.map(inst => {
          if (inst.label) return `${inst.label}:`;
          if (inst.op === 'if') return `if ${inst.arg1} → ${inst.goto}`;
          if (inst.result) return `${inst.result} = ${inst.arg1 || ''} ${inst.op} ${inst.arg2 || ''}`.trim();
          return inst.op;
        }),
      },
    }));
  }, [result?.cfg]);

  const initialEdges: Edge[] = useMemo(() => {
    if (!result?.cfg?.edges) return [];

    return result.cfg.edges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      type: 'smoothstep',
      animated: true,
      style: {
        stroke: edge.type === 'conditional' ? '#f59e0b' : '#00d4ff',
        strokeWidth: 2,
      },
      label: edge.type === 'conditional' ? 'T' : '',
      labelStyle: { fill: '#f59e0b', fontSize: 10 },
      labelBgStyle: { fill: '#12121a' },
    }));
  }, [result?.cfg]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    setNodes(initialNodes);
  }, [initialNodes, setNodes]);

  useEffect(() => {
    setEdges(initialEdges);
  }, [initialEdges, setEdges]);

  if (!result) {
    return (
      <Card className="h-full flex items-center justify-center" padding="lg">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-border-subtle flex items-center justify-center">
            <svg className="w-8 h-8 text-text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <p className="text-text-secondary font-mono text-sm">Run optimization to see CFG</p>
          <p className="text-text-tertiary text-xs mt-1">Control flow graph will appear here</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="h-full" padding="none">
      <CardHeader className="px-4 pt-4 pb-2 border-b border-border-subtle">
        <CardTitle className="text-sm">Control Flow Graph</CardTitle>
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 bg-accent-cyan rounded" />
            <span className="text-text-tertiary">Normal</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 bg-accent-orange rounded" />
            <span className="text-text-tertiary">Conditional</span>
          </div>
        </div>
      </CardHeader>

      <div className="h-[calc(100%-57px)] bg-bg-surface">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          proOptions={{ hideAttribution: true }}
        >
          <Background color="#2a2a3a" gap={20} size={1} />
          <Controls className="!bg-bg-elevated !border-border-subtle !rounded-lg [&>button]:!bg-bg-surface [&>button]:!border-border-subtle [&>button]:!text-text-secondary [&>button:hover]:!bg-bg-elevated" />
          <MiniMap
            className="!bg-bg-surface !border-border-subtle !rounded-lg"
            nodeColor="#00d4ff"
            maskColor="rgba(10, 10, 15, 0.8)"
          />
        </ReactFlow>
      </div>
    </Card>
  );
}
