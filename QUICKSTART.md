# Quick Start Guide

## 🚀 Get Started in 3 Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Get Your Linear API Key

1. Go to https://linear.app/settings/api
2. Click "Create new" under Personal API keys
3. Copy your API key (starts with `lin_api_`)

### 3. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local` and paste your API key:
```
NEXT_PUBLIC_LINEAR_API_KEY=lin_api_your_key_here
```

### 4. Run the App

```bash
npm run dev
```

Open http://localhost:3000 in your browser!

## 📊 What You Can Do

### Dashboard View
- Navigate to `/dashboard`
- Enter optimistic, most likely, and pessimistic estimates
- See real-time PERT calculations
- View distribution charts and confidence intervals

### Understanding the Visualizations

**Distribution Chart**: Shows the spread of possible outcomes from best to worst case

**Confidence Intervals**:
- 68% range: Most likely outcome (±1 standard deviation)
- 95% range: High confidence (±2 standard deviations)
- 99.7% range: Nearly certain (±3 standard deviations)

### Tips for Better Estimates

1. **Optimistic**: What if everything goes perfectly?
2. **Most Likely**: What do you realistically expect?
3. **Pessimistic**: What if you hit roadblocks?

The formula weighs the "most likely" 4x more than the extremes, giving you a balanced expected time.

## 🔗 Next Steps: Linear Integration

To sync with your Linear workspace:

1. Connect your Linear account (button in dashboard)
2. Select a team
3. Import issues/tasks
4. Add PERT estimates to each
5. View aggregated project timeline

## 🎨 Visualization Style

This app uses a **minimalistic design philosophy**:
- Monochrome palette with blue accents
- Clean typography with system fonts
- Simple, focused charts
- No visual clutter

Perfect for professional project management alongside Linear.

## 🛠️ Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Recharts (visualizations)
- @linear/sdk

## 📝 Example Use Case

**Task**: "Implement user authentication"

- **Optimistic**: 4 hours (everything works first try)
- **Most Likely**: 6 hours (some debugging needed)
- **Pessimistic**: 10 hours (integration issues, security review)

**PERT Calculation**:
- Expected Time: `(4 + 4×6 + 10) / 6 = 6.3 hours`
- 95% Confidence: `4.3 - 8.3 hours`

This gives you and your team realistic expectations!
