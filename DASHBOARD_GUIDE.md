# Dashboard Guide - New Multi-View Interface

## 🎯 Overview

The dashboard has been completely reworked with a professional, multi-view interface for managing PERT estimates across your Linear workspace.

## 📊 Dashboard Views

### 1. Overview Dashboard (Main Screen)
**What it shows:**
- Active Projects count and statistics
- Total Tasks across all projects
- Total Expected Hours
- Completion Rate (estimated vs total tasks)
- Bar chart showing Optimistic, Expected, and Pessimistic times for active projects
- List of all projects with time estimates

**Features:**
- Quick stats cards with visual indicators
- Active projects visualization
- One-click navigation to projects

### 2. Projects View
**What it shows:**
- Grid of all Linear projects
- Progress bars for each project
- Issue counts
- Project state (started, planned, completed, etc.)
- Visual project icons and colors

**Features:**
- Click any project to view its tasks
- Color-coded project cards
- Real-time progress tracking
- Search and filter (coming soon)

### 3. Tasks View
**What it shows:**
- All tasks/issues for selected project
- Task identifiers (e.g., "ENG-123")
- Priority levels (Urgent, High, Medium, Low)
- Current state
- Assignees with avatars
- PERT estimates (if added)

**Features:**
- Quick estimation interface
- One-click estimate addition
- Edit existing estimates
- Visual estimate display

## 🎨 Interface Components

### Navigation Bar
- Workspace name and icon (top left)
- Linear connection status (top right)
- Sticky header for easy access

### Breadcrumb Navigation
```
Overview / Projects / Tasks
```
Click any level to navigate back

### View Tabs
- 📊 Dashboard - Overview with charts
- 📁 Projects - Project list

## ⚡ Quick Estimation Feature

### How to Add Estimates (Fast!)

1. **Navigate to a project's tasks**
2. **Click "+ Add PERT estimate"** on any task
3. **Use Quick Presets** for instant setup:
   - `1h` → O: 0.5h, M: 1h, P: 2h
   - `2h` → O: 1h, M: 2h, P: 4h
   - `4h` → O: 2h, M: 4h, P: 8h
   - `8h` → O: 4h, M: 8h, P: 16h
   - `16h` → O: 8h, M: 16h, P: 32h

4. **Or manually enter** O/M/P values
5. **See expected time** calculated in real-time
6. **Click "Save Estimate"**

### Preset Logic
Quick presets use a simple formula:
- Optimistic = Hours × 0.5
- Most Likely = Hours
- Pessimistic = Hours × 2

This is a good starting point, but you can adjust any value manually.

## 🔄 Workflow

### Typical User Flow

```
1. Login & Connect Linear
   ↓
2. View Dashboard Overview
   - See all active projects
   - Check total expected hours
   - Identify projects needing estimates
   ↓
3. Click "View All Projects" or "📁 Projects" tab
   ↓
4. Select a project to estimate
   ↓
5. Add PERT estimates to tasks
   - Use quick presets for speed
   - Manually adjust for accuracy
   ↓
6. Return to Overview
   - See updated charts
   - Track progress
```

## 📱 Key Features

### 1. Workspace Display
Shows your current Linear workspace at the top:
- Workspace name
- Workspace URL (e.g., "company.linear.app")
- Workspace icon

### 2. Project Cards
Each project card shows:
- Project icon/color
- Project name
- Current state (Started, Planned, etc.)
- Progress bar
- Issue count
- Time estimates (once added)

### 3. Task List
Each task shows:
- Identifier (e.g., "ENG-123")
- Title and description
- Priority badge
- State badge
- Assignee avatar
- PERT estimate (if added)

### 4. Quick Estimate Input
Inline estimation form with:
- Quick preset buttons (1h, 2h, 4h, 8h, 16h)
- Three input fields (O, M, P)
- Real-time expected time calculation
- Save/Cancel buttons

### 5. Stats Cards
Color-coded statistics:
- 📊 Active Projects (blue)
- ✓ Total Tasks (green)
- ⏱ Expected Hours (orange)
- 🎯 Completion Rate (purple)

## 🎨 Minimalistic Design

The new dashboard follows these principles:

### Color Palette
- **Primary**: Blue (#3b82f6) for actions and highlights
- **Success**: Green for completed/positive states
- **Warning**: Orange for time-sensitive info
- **Neutral**: Grays for backgrounds and borders
- **Accent**: Project-specific colors from Linear

### Typography
- **Headings**: Bold, clear hierarchy
- **Body**: Readable sizes (14-16px)
- **Data**: Monospace for numbers
- **Labels**: Small, muted (12px)

### Layout
- **Cards**: Clean borders, subtle shadows on hover
- **Spacing**: Generous whitespace
- **Grid**: Responsive (1/2/3 columns based on screen size)
- **Sticky Nav**: Always accessible

## 🔧 Technical Details

### Data Flow

```
Dashboard → API Routes → Linear SDK → Your Workspace

/api/linear/workspace     → Get workspace info
/api/linear/projects      → Get all projects
/api/linear/projects/:id/issues → Get project tasks
/api/linear/dashboard     → Get aggregated stats
```

### State Management
- React useState for local state
- View switching (overview/projects/tasks)
- Selected project tracking
- Estimates stored locally (to be saved to DB)

### Components

```
components/dashboard/
├── WorkspaceHeader.tsx       - Shows current workspace
├── DashboardOverview.tsx     - Main stats and charts
├── ProjectList.tsx           - Grid of projects
├── TaskList.tsx              - List of tasks with estimates
└── QuickEstimateInput        - Fast estimation form (inline)
```

## 🚀 Next Steps

### Features Coming Soon
1. **Persist Estimates** - Save to database
2. **Project-Level PERT** - Aggregate all task estimates
3. **Gantt Chart** - Timeline visualization
4. **Export** - PDF/CSV reports
5. **Filtering** - Filter by state, assignee, priority
6. **Search** - Find projects and tasks quickly
7. **History** - Track estimate changes over time

### Database Integration
Currently, estimates are calculated on-the-fly but not persisted. Next step:
- Create estimates table
- Link estimates to Linear issue IDs
- API endpoints for CRUD operations
- Real-time chart updates

## 💡 Tips for Best Use

### 1. Start with Quick Presets
Use the preset buttons (1h, 2h, 4h, 8h, 16h) to quickly add estimates, then fine-tune as needed.

### 2. Focus on Active Projects
The overview shows active projects first - these are your priorities.

### 3. Estimate in Batches
Go through one project at a time, estimating all tasks before moving to the next.

### 4. Review the Overview
After estimating, return to the overview to see aggregated data and identify outliers.

### 5. Update Regularly
As tasks progress, update estimates to improve accuracy over time.

## 🎯 Example: Estimating a Project

**Scenario:** You have a project "Mobile App Redesign" with 10 tasks

**Steps:**
1. Go to Dashboard → Click "📁 Projects"
2. Click "Mobile App Redesign" card
3. See list of 10 tasks
4. For first task "Update login screen":
   - Click "+ Add PERT estimate"
   - Click "4h" preset (sets O:2, M:4, P:8)
   - Adjust M to 5 if needed
   - Click "Save Estimate"
   - Expected time shows: 5.0h
5. Repeat for all 10 tasks
6. Return to Overview
7. See "Mobile App Redesign" in charts with total expected time

## 📊 Understanding the Charts

### Bar Chart (Dashboard Overview)
- **X-axis**: Project names
- **Y-axis**: Hours
- **Three bars per project**:
  - Gray: Optimistic (best case)
  - Blue: Expected (PERT calculation)
  - Red: Pessimistic (worst case)

This helps you visualize risk and uncertainty across projects.

### Progress Bars (Project Cards)
- Shows % of completed issues
- Green fill indicates progress
- Based on Linear's issue states

## 🔐 Privacy & Data

- All data fetched from Linear via OAuth
- Estimates calculated in real-time
- No data stored on server (yet)
- Session-based authentication
- HTTPS required for production

## 🆘 Troubleshooting

### "No projects" showing
- Make sure you're connected to Linear (green badge top-right)
- Check that you have projects in your Linear workspace
- Try refreshing the page

### Can't see tasks
- Make sure project has issues in Linear
- Check that you selected a project from the Projects view
- Verify Linear API permissions

### Estimates not saving
- Currently estimates are local only
- Database integration coming soon
- Refresh will clear unsaved estimates

### Charts not updating
- Estimates need to be saved first
- Try navigating away and back to overview
- Clear browser cache if issues persist

---

**Ready to start?** Navigate to the Dashboard and click "📁 Projects" to begin estimating! 🚀
