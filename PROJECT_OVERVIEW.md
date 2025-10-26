# Linear PERT Estimator - Project Overview

## ✅ What's Been Built

A fully functional Next.js application for PERT estimation with Linear integration and minimalistic visualizations.

### Core Features Implemented

#### 1. PERT Calculation Engine (`lib/pert/calculator.ts`)
- Three-point estimation (Optimistic, Most Likely, Pessimistic)
- Expected time calculation: `(O + 4M + P) / 6`
- Standard deviation and variance
- Confidence intervals (68%, 95%, 99.7%)
- Project-level aggregation for multiple tasks
- Input validation

#### 2. Minimalistic Visualization Components

**TaskEstimateInput** (`components/ui/TaskEstimateInput.tsx`)
- Clean input form for O/M/P estimates
- Real-time validation
- Instant PERT calculation display

**PertDistributionChart** (`components/ui/PertDistributionChart.tsx`)
- Bar chart showing distribution from best to worst case
- Minimal design with monochrome + blue accent
- Reference line for expected value

**ConfidenceIntervals** (`components/ui/ConfidenceIntervals.tsx`)
- Visual representation of 68%, 95%, 99.7% confidence ranges
- Gradient bars for easy comprehension
- Clear labeling with statistical significance

**ProjectTimeline** (`components/ui/ProjectTimeline.tsx`)
- Horizontal bar chart for multiple tasks
- Comparison of optimistic, expected, and pessimistic times
- Aggregate project totals

#### 3. Linear Integration Setup

**Linear Client** (`lib/linear/client.ts`)
- Configured @linear/sdk
- Functions to fetch teams and issues
- Environment-based API key management

**API Routes**
- `/api/linear/teams` - Fetch all Linear teams
- `/api/linear/issues?teamId=xxx` - Fetch issues by team

#### 4. User Interface

**Landing Page** (`app/page.tsx`)
- Clean introduction to the app
- Feature highlights
- Call-to-action buttons

**Dashboard** (`app/dashboard/page.tsx`)
- Interactive PERT estimation
- Live visualizations
- Educational section explaining PERT methodology

## 🎨 Design Philosophy

### Minimalistic Visualization Approach

The app implements a **clean, professional aesthetic**:

1. **Color Palette**
   - Primary: Blue (#3b82f6) for expected values and accents
   - Neutral: Grays for secondary data
   - Minimal use of colors - only when meaningful

2. **Typography**
   - System fonts (ui-sans-serif)
   - Clear hierarchy with size and weight
   - Monospace for numerical data

3. **Chart Style**
   - Minimal gridlines (dashed, subtle)
   - No unnecessary decorations
   - Clean axes with clear labels
   - Generous whitespace

4. **Layout**
   - Card-based sections with subtle borders
   - Responsive grid system
   - Consistent spacing

## 📊 Visualization Integration with Linear

### Current Implementation: Standalone Web App

**Advantages:**
- ✅ Full control over UI/UX
- ✅ Rich, interactive visualizations
- ✅ Easy to develop and maintain
- ✅ No browser extension overhead
- ✅ Works immediately with Linear API

**Workflow:**
1. User opens Linear in one tab/window
2. Opens PERT estimator in another tab/window
3. Copies task IDs or uses API to sync
4. Views visualizations alongside Linear

### Future Enhancement Options

#### Option A: Browser Extension
- Inject PERT UI directly into Linear's interface
- Seamless integration
- Requires browser-specific development
- Maintenance overhead with Linear UI changes

#### Option B: Linear Integration
- Use Linear's integration framework (if available)
- Official integration path
- Limited by Linear's extension capabilities

#### Option C: Hybrid Approach (Recommended)
- Keep standalone app as primary interface
- Add browser extension for quick access
- Use Linear API for bidirectional sync
- Best of both worlds

## 🔧 Technical Architecture

```
┌─────────────────────────────────────────────┐
│           Next.js Application               │
├─────────────────────────────────────────────┤
│                                             │
│  Frontend (React Components)                │
│  ├── Landing Page                          │
│  ├── Dashboard                             │
│  └── UI Components                         │
│      ├── TaskEstimateInput                 │
│      ├── PertDistributionChart             │
│      ├── ConfidenceIntervals               │
│      └── ProjectTimeline                   │
│                                             │
│  Backend (API Routes)                       │
│  ├── /api/linear/teams                     │
│  └── /api/linear/issues                    │
│                                             │
│  Business Logic                             │
│  ├── PERT Calculator (lib/pert)            │
│  └── Linear Client (lib/linear)            │
│                                             │
└─────────────────────────────────────────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │   Linear API         │
         │   (@linear/sdk)      │
         └──────────────────────┘
```

## 🚀 Getting Started

See `QUICKSTART.md` for detailed instructions.

**TL;DR:**
```bash
npm install
cp .env.example .env.local
# Add your Linear API key to .env.local
npm run dev
```

## 📈 Next Steps & Roadmap

### Immediate Enhancements
1. **Database Integration**
   - Store PERT estimates persistently
   - PostgreSQL or SQLite
   - Associate estimates with Linear issue IDs

2. **OAuth Authentication**
   - Replace API key with OAuth flow
   - Better security and user experience
   - Automatic token refresh

3. **Multi-task Views**
   - Import entire projects from Linear
   - Bulk estimation interface
   - Project-level dashboards

### Medium-term Features
4. **Advanced Visualizations**
   - Gantt charts with PERT timelines
   - Monte Carlo simulations
   - Historical accuracy tracking
   - Burndown charts with confidence bands

5. **Collaboration**
   - Share estimates with team
   - Comments and discussions
   - Estimate revision history

6. **Export & Reporting**
   - PDF reports
   - CSV export
   - Integration with other tools (Slack, email)

### Long-term Vision
7. **Machine Learning**
   - Learn from historical estimates
   - Suggest O/M/P based on task description
   - Improve accuracy over time

8. **Browser Extension**
   - Inline PERT estimation in Linear
   - Quick-add from Linear UI
   - Popup visualizations

## 🎯 Key Differentiators

1. **PERT Focus**: Dedicated to three-point estimation (not generic project management)
2. **Minimalist Design**: Distraction-free, professional visualizations
3. **Linear-Native**: Built specifically for Linear users
4. **Statistical Rigor**: Proper confidence intervals and uncertainty quantification
5. **Educational**: Helps teams understand estimation uncertainty

## 📦 Project Structure

```
linear-pert-estimator/
├── app/
│   ├── api/
│   │   └── linear/
│   │       ├── issues/route.ts
│   │       └── teams/route.ts
│   ├── dashboard/
│   │   └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/ui/
│   ├── ConfidenceIntervals.tsx
│   ├── PertDistributionChart.tsx
│   ├── ProjectTimeline.tsx
│   └── TaskEstimateInput.tsx
├── lib/
│   ├── linear/
│   │   └── client.ts
│   └── pert/
│       ├── calculator.ts
│       └── types.ts
├── public/
├── .env.example
├── .gitignore
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── PROJECT_OVERVIEW.md
├── QUICKSTART.md
├── README.md
├── tailwind.config.ts
└── tsconfig.json
```

## 🔐 Environment Setup

Required environment variables:

```bash
# .env.local
NEXT_PUBLIC_LINEAR_API_KEY=lin_api_xxx
```

Get your Linear API key from: https://linear.app/settings/api

## 🧪 Testing the Build

All routes compile successfully:
- ✅ Landing page (/)
- ✅ Dashboard (/dashboard)
- ✅ Linear Teams API (/api/linear/teams)
- ✅ Linear Issues API (/api/linear/issues)

Build output: ~205KB for dashboard (includes Recharts)

## 💡 Usage Examples

### Example 1: Single Task Estimation
```
Task: "Implement user authentication"
- Optimistic: 4 hours
- Most Likely: 6 hours
- Pessimistic: 10 hours

PERT Result:
- Expected: 6.3 hours
- 95% Range: 4.3 - 8.3 hours
```

### Example 2: Project Estimation
```
Project: "E-commerce checkout flow"
Tasks:
1. Cart page: E=5h, σ=1h
2. Payment: E=8h, σ=2h
3. Confirmation: E=3h, σ=0.5h

Total Expected: 16 hours
Total σ: √(1² + 2² + 0.5²) = 2.29h
95% Range: 11.4 - 20.6 hours
```

## 🎓 Educational Value

The app teaches teams:
1. **Uncertainty quantification**: Every estimate has a range
2. **Statistical thinking**: Understanding confidence intervals
3. **Risk management**: Pessimistic scenarios matter
4. **Better planning**: Account for variance in schedules

## 📝 License

MIT - See README.md for details
