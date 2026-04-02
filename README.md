# ICO — Intermediate Code Optimizer

<p align="center">
  <img src="frontend/public/favicon.svg" alt="ICO Logo" width="64" height="64" />
</p>

<p align="center">
  <strong>Watch your code evolve.</strong>
</p>

<p align="center">
  A premium developer tool that transforms compiler optimization learning into an immersive, visual experience.
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#project-structure">Project Structure</a>
</p>

---

## Features

## Explaining This Project to Non-Technical Reviewers

### What it does
ICO takes simple intermediate code and rewrites it into a cleaner version that does the same job with fewer unnecessary steps.

### Why it matters
Fewer operations usually means better performance and less wasted compute. This is the same core idea used in real compilers before software is executed.

### Why this project exists
Compiler optimization is usually hard to see. ICO turns it into a visual, step-by-step experience so students and reviewers can understand exactly what changed and why.

### 🎯 Interactive Optimization Pipeline
- Step-by-step visualization of compiler optimization techniques
- Toggle individual optimization passes on/off
- Real-time animation showing each transformation

### 📊 Visual Metrics Dashboard
- Before/after comparison with animated counters
- Instruction count, estimated cycles, redundant operations
- Visual progress rings showing improvement percentage

### 🔀 Control Flow Graph Visualization
- Interactive node-based CFG display
- Conditional and normal flow edges
- Click-to-highlight functionality

### ✨ Futuristic Dark Theme
- Neural interface aesthetic inspired by cyberpunk dashboards
- Glassmorphism cards with subtle glow effects
- Smooth spring-based animations throughout

### 📝 Custom IR Editor
- Monaco Editor with custom IR syntax highlighting
- Real-time validation
- Keyboard shortcuts for common actions

## Supported Optimizations

| Pass | Description |
|------|-------------|
| Constant Folding | Evaluate constant expressions at compile time |
| Constant Propagation | Replace variables with known constant values |
| Copy Propagation | Replace uses of variables with their copies |
| Common Subexpression Elimination | Eliminate redundant expressions |
| Dead Code Elimination | Remove unreachable or unused code |
| Strength Reduction | Replace expensive operations with cheaper ones |

## Tech Stack

### Frontend
- **React 18** + TypeScript
- **Vite** — Build tool
- **TailwindCSS** — Styling
- **Framer Motion** — Animations
- **Monaco Editor** — Code editing
- **React Flow** — Graph visualization
- **Zustand** — State management

### Backend
- **Express** — API server
- **TypeScript** — Type safety
- **Zod** — Validation

## Getting Started

### Prerequisites
- Node.js 18+
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd intermediate-code-optimizer

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

### Running the Application

**Development mode (Full stack):**
```bash
# Terminal 1: Start backend
cd backend
npm run dev

# Terminal 2: Start frontend
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:3000`
The backend API will be available at `http://localhost:3001`

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check |
| `/api/passes` | GET | List available optimization passes |
| `/api/optimize` | POST | Run optimization on IR code |

**Example request:**
```json
POST /api/optimize
{
  "code": "t1 = a + b\nt2 = t1 * 2",
  "passes": ["constant_folding", "cse"]
}
```

## Project Structure

```
intermediate-code-optimizer/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/           # Base UI components (Button, Card, etc.)
│   │   │   ├── editor/       # Monaco code editor wrapper
│   │   │   ├── pipeline/     # Optimization pipeline visualization
│   │   │   ├── graph/        # CFG visualization with React Flow
│   │   │   └── metrics/      # Metrics dashboard & output panel
│   │   ├── lib/
│   │   │   └── store.ts      # Zustand state management
│   │   ├── styles/
│   │   │   └── index.css     # Global styles & Tailwind config
│   │   ├── types/
│   │   │   └── index.ts      # TypeScript type definitions
│   │   ├── App.tsx           # Main application component
│   │   └── main.tsx          # React entry point
│   ├── public/
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
├── backend/
│   ├── src/
│   │   ├── optimizer/
│   │   │   ├── passes/       # Individual optimization passes
│   │   │   ├── parser.ts     # IR parser
│   │   │   ├── cfg-builder.ts # Control flow graph builder
│   │   │   └── engine.ts     # Main optimization engine
│   │   ├── types/
│   │   │   └── index.ts      # Shared type definitions
│   │   └── index.ts          # Express API server
│   ├── package.json
│   └── tsconfig.json
│
├── SPEC.md                   # Detailed project specification
├── README.md
└── project_idea.txt          # Original project idea document
```

## IR Syntax

The Intermediate Representation uses a simple three-address code format:

```ir
// Comments start with //
t1 = a + b        // Temporary assignment
t2 = t1 * 2       // Binary operations
if t2 > 10 goto L1  // Conditional jump
L1:               // Label definition
t3 = t1 + 5       // Continue execution
```

### Supported Operations
- Arithmetic: `+`, `-`, `*`, `/`
- Comparisons: `>`, `<`, `>=`, `<=`, `==`, `!=`
- Control flow: `if ... goto LABEL`, `goto LABEL`
- Labels: `LABEL:`

## Design System

### Color Palette
| Color | Hex | Usage |
|-------|-----|-------|
| Background Deep | `#0a0a0f` | Main background |
| Background Surface | `#12121a` | Card backgrounds |
| Accent Cyan | `#00d4ff` | Primary actions |
| Accent Purple | `#a855f7` | Secondary highlights |
| Accent Green | `#10b981` | Success states |
| Accent Orange | `#f59e0b` | Warnings |
| Accent Red | `#ef4444` | Errors |

### Typography
- **Headings & Code:** JetBrains Mono
- **Body:** Inter

## Future Enhancements

- [ ] SSA conversion
- [ ] Loop optimization
- [ ] Register allocation visualization
- [ ] Data flow analysis
- [ ] AI-powered optimization explanations
- [ ] VS Code extension
- [ ] Share/export functionality

## License

MIT
