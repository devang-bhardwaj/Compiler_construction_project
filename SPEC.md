# ICO — Intermediate Code Optimizer

## Vision & Concept

**ICO** is a premium developer tool that transforms compiler optimization learning into an immersive, visual experience. It feels like a futuristic IDE crossed with a real-time analytics dashboard — where code optimization isn't just functional, it's *satisfying* to watch. Each transformation animates fluidly, metrics update in real-time, and the entire interface responds with precision.

**Tagline:** *"Watch your code evolve."*

**Personality:** Technical precision meets visual elegance. The interface should feel like a high-end development tool used by professionals, not a student project.

---

## Design Language

### Aesthetic Direction
**"Neural Interface"** — Inspired by cyberpunk dashboards, Bloomberg terminals, and modern AI tools like Cursor/Raycast. Deep space blacks with electric accent glows. Every element feels *responsive* and *alive*.

### Color Palette
```
Background Deep:     #0a0a0f (near-black with blue undertone)
Background Surface:  #12121a (card backgrounds)
Background Elevated: #1a1a24 (elevated elements)
Border Subtle:       #2a2a3a (subtle separations)
Border Glow:         #3a3a4a (hover states)

Text Primary:        #f0f0f5 (high contrast)
Text Secondary:      #8888a0 (muted labels)
Text Tertiary:       #5a5a70 (disabled/hints)

Accent Cyan:         #00d4ff (primary actions, links)
Accent Purple:       #a855f7 (secondary highlights)
Accent Green:        #10b981 (success, optimization applied)
Accent Orange:       #f59e0b (warnings, metrics)
Accent Red:          #ef4444 (errors, removed code)

Glow Cyan:           rgba(0, 212, 255, 0.15)
Glow Purple:         rgba(168, 85, 247, 0.15)
Glow Green:          rgba(16, 185, 129, 0.15)
```

### Typography
- **Headings:** JetBrains Mono — technical, distinctive, modern
- **Body:** Inter — clean, highly legible at small sizes
- **Code:** JetBrains Mono — consistent with technical context
- **Metrics/Numbers:** Tabular figures from JetBrains Mono

### Spatial System
- Base unit: 4px
- Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64, 96
- Border radius: 6px (buttons), 12px (cards), 16px (panels)
- Content max-width: 1600px

### Motion Philosophy
- **Spring-based animations** — Natural, physical feel (stiffness: 300, damping: 30)
- **Micro-interactions** — 150ms for hovers, 200ms for state changes
- **Page transitions** — 400ms with staggered reveals
- **Code transformations** — 600ms with smooth morphing
- **Number counters** — Animate on change with spring physics

### Visual Assets
- **Icons:** Lucide React — consistent stroke weight, minimal style
- **Graphs:** Custom SVG with gradient fills and glow effects
- **Decorative:** Subtle grid patterns, animated gradient orbs in background
- **Code diffs:** Inline highlighting with colored backgrounds

---

## Layout & Structure

### Overall Architecture
```
┌─────────────────────────────────────────────────────────────────────┐
│  HEADER: Logo + Nav + Theme Toggle                                  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────────┐  ┌──────────────────────────────────────┐ │
│  │                      │  │                                      │ │
│  │    CODE INPUT        │  │      VISUALIZATION CANVAS            │ │
│  │    (Monaco Editor)   │  │      (CFG + Transformations)        │ │
│  │                      │  │                                      │ │
│  │                      │  │                                      │ │
│  └──────────────────────┘  └──────────────────────────────────────┘ │
│                                                                     │
│  ┌──────────────────────┐  ┌──────────────────────────────────────┐ │
│  │  OPTIMIZATION        │  │      OUTPUT PANEL                    │ │
│  │  PIPELINE            │  │      (Optimized Code + Metrics)      │ │
│  │  (Step by Step)      │  │                                      │ │
│  └──────────────────────┘  └──────────────────────────────────────┘ │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Visual Pacing
- **Hero section:** Breathing space, animated gradient background
- **Work area:** Dense, functional, maximum information density
- **Transitions:** Smooth scroll, elements fade/slide into view

### Responsive Strategy
- **Desktop (1200px+):** Full 2-column layout
- **Tablet (768-1199px):** Stacked panels, collapsible sidebar
- **Mobile (< 768px):** Single column, tabbed navigation

---

## Features & Interactions

### 1. Code Input Editor
- Monaco Editor with custom IR syntax highlighting
- Real-time validation with inline error markers
- Auto-complete for IR instructions (t1, t2, goto L1, etc.)
- Line numbers with jump-to-line
- **Interactions:**
  - Paste detection shows "Format" action
  - Hover on instruction shows IR type tooltip
  - Cmd/Ctrl+Enter runs optimization

### 2. Optimization Pipeline
- Visual pipeline showing each pass as a connected node
- Passes light up sequentially when running
- Each pass expandable to show transformation
- **Available passes:**
  - Constant Folding (⚡ icon)
  - Constant Propagation (→ icon)
  - Copy Propagation (= icon)
  - Common Subexpression Elimination (⊃ icon)
  - Dead Code Elimination (✕ icon)
  - Strength Reduction (↓ icon)
- **Interactions:**
  - Toggle individual passes on/off
  - "Run All" executes with animation
  - "Step Mode" runs one pass at a time with play button
  - Speed control slider (0.5x to 3x)

### 3. Visualization Canvas
- **Control Flow Graph:** Interactive node graph
  - Nodes glow on hover
  - Edges animate flow direction
  - Click node to highlight corresponding code
  - Zoom/pan with mouse gestures
- **Transformation View:** Split view showing before/after
  - Diff highlighting with green (added) / red (removed)
  - Connecting lines show transformation mapping
  - Animated morphing between states

### 4. Metrics Dashboard
- Real-time updating counters with spring animation
- **Primary metrics:**
  - Instruction Count (before → after)
  - Estimated Cycles (before → after)
  - Optimization Score (percentage)
- **Secondary metrics:**
  - Passes Applied count
  - Lines Changed
  - Time Complexity improvement
- Circular progress indicators for visual impact

### 5. Output Panel
- Optimized IR code with syntax highlighting
- Copy button with success feedback
- Download as .ir file option
- **Optimization log:** Expandable list of all changes made
  - Each entry shows: pass name, instruction affected, transformation

---

## Component Inventory

### Header
- **Default:** Transparent background, logo glows subtly
- **Scrolled:** Adds blur backdrop, border appears
- **Elements:** Logo (animated icon), nav links, GitHub link, theme toggle

### Button (Primary)
- **Default:** Cyan background, dark text, subtle glow
- **Hover:** Glow intensifies, slight scale (1.02)
- **Active:** Scale down (0.98), glow pulses
- **Disabled:** Gray, no glow, cursor not-allowed
- **Loading:** Spinner replaces text, pulse animation

### Button (Secondary)
- **Default:** Transparent, cyan border, cyan text
- **Hover:** Background fills with cyan at 10% opacity
- **Active:** Background at 20% opacity

### Code Card
- **Default:** Glass effect, subtle border, dark background
- **Hover:** Border brightens, shadow intensifies
- **Focus:** Cyan border glow

### Pipeline Node
- **Default:** Dark circle with icon, muted
- **Active (running):** Cyan glow, pulse animation
- **Complete:** Green check overlay
- **Disabled:** Grayed out, strikethrough

### Metric Card
- **Default:** Glass panel with large number
- **Updating:** Number morphs with spring animation
- **Improved:** Green flash + arrow up indicator
- **Degraded:** Red flash + arrow down indicator

### Graph Node (CFG)
- **Default:** Rounded rectangle, subtle fill
- **Hover:** Glow effect, tooltip appears
- **Selected:** Cyan border, connected edges highlight
- **Active (executing):** Pulse animation with ripple

---

## Technical Approach

### Frontend Stack
- **Framework:** React 18 + TypeScript
- **Styling:** TailwindCSS + CSS custom properties
- **Animations:** Framer Motion
- **Code Editor:** Monaco Editor
- **Graphs:** React Flow + custom D3 rendering
- **Icons:** Lucide React

### Backend Stack
- **Runtime:** Node.js + Express (or Fastify)
- **Language:** TypeScript
- **Validation:** Zod

### Project Structure
```
intermediate-code-optimizer/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/          # Base components
│   │   │   ├── editor/      # Monaco wrapper
│   │   │   ├── pipeline/    # Optimization pipeline
│   │   │   ├── graph/       # CFG visualization
│   │   │   └── metrics/     # Dashboard
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── styles/
│   │   └── types/
│   └── public/
├── backend/
│   ├── src/
│   │   ├── api/
│   │   ├── optimizer/
│   │   │   ├── parser.ts
│   │   │   ├── passes/
│   │   │   └── engine.ts
│   │   └── types/
│   └── package.json
├── docs/
└── SPEC.md
```

### API Design

**POST /api/optimize**
```typescript
// Request
{
  code: string,
  passes: ("constant_folding" | "constant_propagation" | "copy_propagation" | "cse" | "dead_code" | "strength_reduction")[]
}

// Response
{
  optimizedCode: string,
  steps: OptimizationStep[],
  metrics: {
    before: Metrics,
    after: Metrics
  },
  cfg: CFGData
}
```

**GET /api/passes**
```typescript
// Response
{
  passes: {
    id: string,
    name: string,
    description: string,
    icon: string
  }[]
}
```

---

## Development Phases

### Phase 1: Foundation
- Project setup with all dependencies
- Design system implementation (colors, typography, spacing)
- Base UI components with dark theme
- Monaco editor integration with custom language

### Phase 2: Core Experience
- IR parser implementation
- Single-pass optimization engine
- Code input → output flow
- Basic metrics display

### Phase 3: Visualization
- CFG builder and renderer
- Pipeline visualization component
- Step-by-step execution with animations
- Interactive graph with hover/click

### Phase 4: Polish
- All optimization passes
- Full metrics dashboard
- Responsive design
- Performance optimization
- Error handling and edge cases

### Phase 5: Enhancement (Future)
- SSA conversion
- Loop optimization
- AI explanations
- Export/share functionality
