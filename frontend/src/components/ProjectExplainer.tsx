import { Card, CardHeader, CardTitle } from '@/components/ui';

export function ProjectExplainer() {
  return (
    <Card className="mb-6" padding="none">
      <CardHeader className="px-4 pt-4 pb-2 border-b border-border-subtle">
        <CardTitle className="text-sm">Plain-Language Summary</CardTitle>
      </CardHeader>
      <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div className="glass rounded-lg p-3">
          <p className="font-mono text-text-primary mb-1">What it does</p>
          <p className="text-text-secondary">
            Takes a small code snippet and removes wasteful steps while keeping the same output.
          </p>
        </div>
        <div className="glass rounded-lg p-3">
          <p className="font-mono text-text-primary mb-1">Why it matters</p>
          <p className="text-text-secondary">
            Better code uses fewer operations, which can improve speed and reduce compute cost.
          </p>
        </div>
        <div className="glass rounded-lg p-3">
          <p className="font-mono text-text-primary mb-1">Why this project exists</p>
          <p className="text-text-secondary">
            It makes compiler optimization visible and explainable for learning, demos, and teaching.
          </p>
        </div>
      </div>
    </Card>
  );
}

