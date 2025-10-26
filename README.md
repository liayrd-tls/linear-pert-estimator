# Linear PERT Estimator

A minimalistic web application for PERT (Program Evaluation and Review Technique) estimation with Linear integration and clean visualizations.

## Features

- **PERT Estimation**: Three-point estimation using optimistic, most likely, and pessimistic estimates
- **Minimalistic Visualizations**: Clean, distraction-free charts and confidence intervals
- **Linear Integration**: Sync with your Linear workspace, teams, and issues
- **Confidence Intervals**: Statistical probability ranges (68%, 95%, 99.7%)
- **Project-level Aggregation**: Calculate PERT estimates for entire projects

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Linear account with OAuth app configured

### Installation

1. Install dependencies:

```bash
npm install
```

2. Set up your Linear OAuth credentials:

Your OAuth credentials are already configured in `.env.local`:
```
LINEAR_CLIENT_ID=30cbea086793cf06d7c197faf6918407
LINEAR_CLIENT_SECRET=6f4cddc966f7bb1654882e6aae1023f6
LINEAR_REDIRECT_URI=http://localhost:3000/api/auth/callback
SESSION_SECRET=your-random-secret-key-change-this-in-production
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

3. Run the development server:

```bash
npm run dev
```

4. Connect to Linear:

- Open [http://localhost:3000](http://localhost:3000)
- Click **"Connect Linear"**
- Authorize the app on Linear
- You'll be redirected back with a success message

**See `CONNECT_LINEAR.md` for detailed connection instructions.**

## How PERT Works

PERT uses three time estimates to calculate expected completion time:

- **Optimistic (O)**: Best-case scenario
- **Most Likely (M)**: Most realistic estimate
- **Pessimistic (P)**: Worst-case scenario

### Formulas

- **Expected Time**: `(O + 4M + P) / 6`
- **Standard Deviation**: `(P - O) / 6`
- **Variance**: `σ²`

### Confidence Intervals

- **68% (±1σ)**: Most likely outcome range
- **95% (±2σ)**: High confidence range
- **99.7% (±3σ)**: Nearly certain range

## Usage

### Basic Estimation

1. Navigate to the dashboard
2. Enter your three estimates (optimistic, most likely, pessimistic)
3. View the calculated expected time and confidence intervals
4. Analyze the distribution chart

### Linear Integration

1. Connect your Linear account via the "Connect Linear" button
2. Select a team and project
3. Import tasks from Linear
4. Add PERT estimates to each task
5. View project-level aggregated estimates

## Visualization Approach

For seamless integration with Linear, this app offers:

1. **Standalone Dashboard** (Current): Run alongside Linear in a separate tab/window
2. **Future: Browser Extension**: Inject visualizations directly into Linear's UI
3. **Future: Linear Custom Views**: Embed via Linear's integration framework

The minimalistic design uses:
- Monochrome color palette with blue accents
- Clean typography (system fonts)
- Simple chart types (bars, lines)
- No unnecessary decorations

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Linear**: @linear/sdk
- **Validation**: Zod

## Project Structure

```
├── app/
│   ├── api/auth/          # Linear OAuth endpoints
│   ├── dashboard/         # Main dashboard
│   ├── layout.tsx
│   └── page.tsx          # Landing page
├── components/ui/         # Reusable UI components
│   ├── PertDistributionChart.tsx
│   ├── ConfidenceIntervals.tsx
│   └── TaskEstimateInput.tsx
├── lib/
│   ├── pert/             # PERT calculation engine
│   │   ├── calculator.ts
│   │   └── types.ts
│   └── linear/           # Linear API client
│       └── client.ts
└── public/               # Static assets
```

## Roadmap

- [ ] OAuth authentication for Linear
- [ ] Persist PERT estimates to database
- [ ] Multi-task project views
- [ ] Gantt chart visualization
- [ ] Export to CSV/PDF
- [ ] Browser extension for inline Linear integration
- [ ] Team collaboration features
- [ ] Historical estimate tracking

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
