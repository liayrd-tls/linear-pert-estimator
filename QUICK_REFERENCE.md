# Quick Reference - Linear PERT Estimator

## 🚀 Getting Started (30 seconds)

```bash
npm run dev
```

Open http://localhost:3000 → Click "Connect Linear" → Done!

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| `app/dashboard/page.tsx` | Main dashboard UI |
| `lib/pert/calculator.ts` | PERT calculation engine |
| `lib/auth/oauth.ts` | OAuth authentication |
| `components/ui/LinearConnectionStatus.tsx` | Connection status widget |
| `CONNECT_LINEAR.md` | Detailed connection guide |

---

## 🔗 API Endpoints

### Authentication
```
GET  /api/auth/login      → Start OAuth flow
GET  /api/auth/callback   → OAuth callback
POST /api/auth/logout     → Disconnect
GET  /api/auth/me         → Check session
```

### Linear Data
```
GET /api/linear/teams              → Fetch all teams
GET /api/linear/issues?teamId=xxx  → Fetch team issues
```

---

## 🎨 UI Components

### TaskEstimateInput
```tsx
import TaskEstimateInput from '@/components/ui/TaskEstimateInput';

<TaskEstimateInput
  onEstimateChange={(estimate) => console.log(estimate)}
  unit="hours"
/>
```

### PertDistributionChart
```tsx
import PertDistributionChart from '@/components/ui/PertDistributionChart';
import { calculatePert } from '@/lib/pert/calculator';

const result = calculatePert({ optimistic: 2, mostLikely: 4, pessimistic: 8 });

<PertDistributionChart result={result} unit="hours" />
```

### ConfidenceIntervals
```tsx
import ConfidenceIntervals from '@/components/ui/ConfidenceIntervals';

<ConfidenceIntervals result={result} unit="hours" />
```

---

## 🧮 PERT Calculations

### Expected Time
```typescript
import { calculateExpectedTime } from '@/lib/pert/calculator';

const expected = calculateExpectedTime({
  optimistic: 4,
  mostLikely: 6,
  pessimistic: 10
});
// Result: 6.33 hours
```

### Standard Deviation
```typescript
import { calculateStandardDeviation } from '@/lib/pert/calculator';

const stdDev = calculateStandardDeviation({
  optimistic: 4,
  mostLikely: 6,
  pessimistic: 10
});
// Result: 1.0 hours
```

### Full PERT Analysis
```typescript
import { calculatePert } from '@/lib/pert/calculator';

const result = calculatePert({
  optimistic: 4,
  mostLikely: 6,
  pessimistic: 10
});

console.log(result.expectedTime);  // 6.33
console.log(result.standardDeviation);  // 1.0
console.log(result.confidenceIntervals.twoStdDev);  // { lower: 4.33, upper: 8.33 }
```

---

## 🔐 Environment Variables

```bash
# OAuth (already configured)
LINEAR_CLIENT_ID=30cbea086793cf06d7c197faf6918407
LINEAR_CLIENT_SECRET=6f4cddc966f7bb1654882e6aae1023f6
LINEAR_REDIRECT_URI=http://localhost:3000/api/auth/callback

# Session
SESSION_SECRET=your-random-secret-key-change-this-in-production
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

---

## 🛠️ Common Tasks

### Connect to Linear
1. Click "Connect Linear" button
2. Authorize on Linear
3. Success!

### Disconnect from Linear
1. Click "Disconnect" in navbar
2. Session cleared

### Fetch Linear Teams
```typescript
const response = await fetch('/api/linear/teams');
const { teams } = await response.json();
```

### Fetch Linear Issues
```typescript
const response = await fetch('/api/linear/issues?teamId=team-123');
const { issues } = await response.json();
```

### Calculate PERT for Project
```typescript
import { calculateProjectPert } from '@/lib/pert/calculator';

const tasks = [
  { optimistic: 2, mostLikely: 4, pessimistic: 6 },
  { optimistic: 3, mostLikely: 5, pessimistic: 9 },
  { optimistic: 1, mostLikely: 2, pessimistic: 4 },
];

const projectResult = calculateProjectPert(tasks);
console.log(projectResult.expectedTime);  // Total expected time
```

---

## 📊 PERT Formulas

| Metric | Formula | Example (O=4, M=6, P=10) |
|--------|---------|--------------------------|
| Expected Time | `(O + 4M + P) / 6` | `(4 + 24 + 10) / 6 = 6.33` |
| Std Deviation | `(P - O) / 6` | `(10 - 4) / 6 = 1.0` |
| Variance | `σ²` | `1.0² = 1.0` |
| 68% Range | `E ± 1σ` | `6.33 ± 1.0 = [5.33, 7.33]` |
| 95% Range | `E ± 2σ` | `6.33 ± 2.0 = [4.33, 8.33]` |
| 99.7% Range | `E ± 3σ` | `6.33 ± 3.0 = [3.33, 9.33]` |

---

## 🎯 Example Use Cases

### Single Task Estimation
```
Task: "Implement authentication"
O: 4 hours (best case)
M: 6 hours (realistic)
P: 10 hours (worst case)

Result:
Expected: 6.3 hours
95% Range: 4.3 - 8.3 hours
```

### Project Estimation
```
Project: "E-commerce checkout"
Task 1: Auth (E=6.3h, σ=1.0h)
Task 2: Payment (E=8.3h, σ=2.0h)
Task 3: UI (E=4.3h, σ=0.83h)

Total Expected: 18.9 hours
Total σ: √(1² + 2² + 0.83²) = 2.3h
95% Range: 14.3 - 23.5 hours
```

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| OAuth fails | Check credentials in `.env.local` |
| Session expires | Reconnect (sessions last 7 days) |
| API returns 401 | Not authenticated - connect Linear |
| Build warnings | "encoding" warning is harmless |

---

## 📚 Documentation

- **START_HERE.md** - Quick start guide
- **CONNECT_LINEAR.md** - Detailed OAuth setup
- **OAUTH_SETUP_COMPLETE.md** - What was implemented
- **PROJECT_OVERVIEW.md** - Architecture and roadmap
- **VISUALIZATION_STRATEGY.md** - Design philosophy

---

## 🚢 Production Deployment

```bash
# 1. Generate secure secret
openssl rand -base64 32

# 2. Update .env
LINEAR_REDIRECT_URI=https://yourdomain.com/api/auth/callback
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
SESSION_SECRET=<generated-secret>

# 3. Update Linear OAuth app
# Add production redirect URI at linear.app/settings/api

# 4. Deploy
npm run build
npm start
```

---

**Quick Start:** `npm run dev` → http://localhost:3000 → "Connect Linear" 🚀
