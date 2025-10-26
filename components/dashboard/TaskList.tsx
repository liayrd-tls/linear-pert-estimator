"use client";

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PertEstimate } from '@/lib/pert/calculator';

interface Label {
  id: string;
  name: string;
  color: string;
}

interface Task {
  id: string;
  identifier: string;
  title: string;
  description?: string;
  state: string;
  priority: number;
  assignee?: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  labels?: Label[];
  project?: {
    id: string;
    name: string;
    milestone?: {
      id: string;
      name: string;
    };
  };
  estimate?: {
    optimistic: number;
    mostLikely: number;
    pessimistic: number;
  };
}

interface TaskListProps {
  projectId: string;
  onEstimateChange: (taskId: string, estimate: PertEstimate) => void;
}

type FilterOption = 'all' | 'assigned' | 'unassigned';

export default function TaskList({ projectId, onEstimateChange }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  // Filters
  const [selectedMilestone, setSelectedMilestone] = useState<string>('all');
  const [selectedLabel, setSelectedLabel] = useState<string>('all');
  const [selectedAssignee, setSelectedAssignee] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchTasks();
  }, [projectId]);

  useEffect(() => {
    applyFilters();
  }, [tasks, selectedMilestone, selectedLabel, selectedAssignee, selectedPriority, searchQuery]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/linear/projects/${projectId}/issues`);
      if (response.ok) {
        const data = await response.json();

        // Fetch estimates for each task
        const tasksWithEstimates = await Promise.all(
          data.issues.map(async (task: Task) => {
            const estimateRes = await fetch(`/api/estimates?issueId=${task.id}`);
            if (estimateRes.ok) {
              const estimateData = await estimateRes.json();
              return { ...task, estimate: estimateData.estimate };
            }
            return task;
          })
        );

        setTasks(tasksWithEstimates);
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...tasks];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.identifier.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Milestone filter
    if (selectedMilestone !== 'all') {
      filtered = filtered.filter(task => task.project?.milestone?.id === selectedMilestone);
    }

    // Label filter
    if (selectedLabel !== 'all') {
      filtered = filtered.filter(task =>
        task.labels?.some(label => label.id === selectedLabel)
      );
    }

    // Assignee filter
    if (selectedAssignee !== 'all') {
      filtered = filtered.filter(task => task.assignee?.id === selectedAssignee);
    }

    // Priority filter
    if (selectedPriority !== 'all') {
      filtered = filtered.filter(task => task.priority.toString() === selectedPriority);
    }

    setFilteredTasks(filtered);
  };

  const handleSaveEstimate = async (taskId: string, estimate: PertEstimate) => {
    try {
      const response = await fetch('/api/estimates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ issueId: taskId, estimate }),
      });

      if (response.ok) {
        // Update local state
        setTasks(tasks.map(t =>
          t.id === taskId ? { ...t, estimate } : t
        ));
        onEstimateChange(taskId, estimate);
        setEditingTaskId(null);
      }
    } catch (error) {
      console.error('Failed to save estimate:', error);
    }
  };

  // Get unique values for filters
  const uniqueMilestones = Array.from(new Set(tasks.map(t => t.project?.milestone).filter(Boolean)));
  const uniqueLabels = Array.from(new Set(tasks.flatMap(t => t.labels || []).map(l => l.id)))
    .map(id => tasks.flatMap(t => t.labels || []).find(l => l.id === id)!).filter(Boolean);
  const uniqueAssignees = Array.from(new Set(tasks.map(t => t.assignee).filter(Boolean)));
  const uniquePriorities = Array.from(new Set(tasks.map(t => t.priority)));

  const getPriorityLabel = (priority: number) => {
    const labels = ['None', 'Urgent', 'High', 'Medium', 'Low'];
    return labels[priority] || 'None';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin h-8 w-8 border-2 border-muted border-t-foreground rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <Card className="p-4 bg-card border-border">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <Label className="text-xs text-muted-foreground mb-2">Search</Label>
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-background border-border"
            />
          </div>

          {uniqueMilestones.length > 0 && (
            <div>
              <Label className="text-xs text-muted-foreground mb-2">Milestone</Label>
              <Select value={selectedMilestone} onValueChange={setSelectedMilestone}>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Milestones</SelectItem>
                  {uniqueMilestones.map(milestone => (
                    <SelectItem key={milestone!.id} value={milestone!.id}>
                      {milestone!.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {uniqueLabels.length > 0 && (
            <div>
              <Label className="text-xs text-muted-foreground mb-2">Label</Label>
              <Select value={selectedLabel} onValueChange={setSelectedLabel}>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Labels</SelectItem>
                  {uniqueLabels.map(label => (
                    <SelectItem key={label.id} value={label.id}>
                      {label.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Label className="text-xs text-muted-foreground mb-2">Assignee</Label>
            <Select value={selectedAssignee} onValueChange={setSelectedAssignee}>
              <SelectTrigger className="bg-background border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Assignees</SelectItem>
                {uniqueAssignees.map(assignee => (
                  <SelectItem key={assignee!.id} value={assignee!.id}>
                    {assignee!.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs text-muted-foreground mb-2">Priority</Label>
            <Select value={selectedPriority} onValueChange={setSelectedPriority}>
              <SelectTrigger className="bg-background border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                {uniquePriorities.map(priority => (
                  <SelectItem key={priority} value={priority.toString()}>
                    {getPriorityLabel(priority)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
          <span>Showing {filteredTasks.length} of {tasks.length} tasks</span>
          {(selectedMilestone !== 'all' || selectedLabel !== 'all' || selectedAssignee !== 'all' || selectedPriority !== 'all' || searchQuery) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedMilestone('all');
                setSelectedLabel('all');
                setSelectedAssignee('all');
                setSelectedPriority('all');
                setSearchQuery('');
              }}
              className="h-7 text-xs"
            >
              Clear filters
            </Button>
          )}
        </div>
      </Card>

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="text-muted-foreground">
            {tasks.length === 0 ? 'No tasks in this project' : 'No tasks match your filters'}
          </div>
        </Card>
      ) : (
        <div className="space-y-2">
          {filteredTasks.map((task) => (
            <Card key={task.id} className="p-4 bg-card border-border hover:border-muted transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <code className="text-xs text-muted-foreground font-mono">{task.identifier}</code>
                    <Badge variant="outline" className="text-xs">
                      {task.state}
                    </Badge>
                    {task.priority > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {getPriorityLabel(task.priority)}
                      </Badge>
                    )}
                    {task.labels?.map(label => (
                      <Badge
                        key={label.id}
                        style={{ backgroundColor: `${label.color}20`, borderColor: label.color }}
                        className="text-xs border"
                      >
                        {label.name}
                      </Badge>
                    ))}
                  </div>
                  <h4 className="font-medium mb-1">{task.title}</h4>
                  {task.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {task.description}
                    </p>
                  )}
                </div>
                {task.assignee && (
                  <div className="ml-4 flex items-center gap-2">
                    {task.assignee.avatarUrl ? (
                      <img
                        src={task.assignee.avatarUrl}
                        alt={task.assignee.name}
                        className="w-6 h-6 rounded-full"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-semibold">
                        {task.assignee.name.charAt(0)}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {editingTaskId === task.id ? (
                <QuickEstimateInput
                  taskId={task.id}
                  initialEstimate={task.estimate}
                  onSave={(estimate) => handleSaveEstimate(task.id, estimate)}
                  onCancel={() => setEditingTaskId(null)}
                />
              ) : task.estimate ? (
                <div className="flex items-center justify-between bg-muted/50 p-3 rounded">
                  <div className="flex items-center gap-4 text-sm font-mono">
                    <div>
                      <span className="text-xs text-muted-foreground">O:</span> {task.estimate.optimistic}h
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">M:</span> {task.estimate.mostLikely}h
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">P:</span> {task.estimate.pessimistic}h
                    </div>
                    <div className="ml-2">
                      <span className="text-xs text-muted-foreground">Expected:</span>{' '}
                      <span className="font-bold">
                        {((task.estimate.optimistic + 4 * task.estimate.mostLikely + task.estimate.pessimistic) / 6).toFixed(1)}h
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingTaskId(task.id)}
                    className="h-7 text-xs"
                  >
                    Edit
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  className="w-full border-dashed"
                  onClick={() => setEditingTaskId(task.id)}
                >
                  + Add PERT estimate
                </Button>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

interface QuickEstimateInputProps {
  taskId: string;
  initialEstimate?: PertEstimate;
  onSave: (estimate: PertEstimate) => void;
  onCancel: () => void;
}

function QuickEstimateInput({ initialEstimate, onSave, onCancel }: QuickEstimateInputProps) {
  const [estimate, setEstimate] = useState<PertEstimate>(
    initialEstimate || { optimistic: 0, mostLikely: 0, pessimistic: 0 }
  );

  const handleQuickSet = (hours: number) => {
    setEstimate({
      optimistic: hours * 0.5,
      mostLikely: hours,
      pessimistic: hours * 2,
    });
  };

  const expectedTime = (estimate.optimistic + 4 * estimate.mostLikely + estimate.pessimistic) / 6;

  return (
    <div className="p-4 bg-muted/50 rounded space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-xs text-muted-foreground">Quick Presets</Label>
        <div className="flex gap-1">
          {[1, 2, 4, 8, 16].map((hours) => (
            <Button
              key={hours}
              variant="outline"
              size="sm"
              onClick={() => handleQuickSet(hours)}
              className="h-7 px-2 text-xs"
            >
              {hours}h
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <Label className="text-xs text-muted-foreground">Optimistic</Label>
          <Input
            type="number"
            min="0"
            step="0.5"
            value={estimate.optimistic || ''}
            onChange={(e) => setEstimate({ ...estimate, optimistic: parseFloat(e.target.value) || 0 })}
            className="mt-1 bg-background"
          />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">Most Likely</Label>
          <Input
            type="number"
            min="0"
            step="0.5"
            value={estimate.mostLikely || ''}
            onChange={(e) => setEstimate({ ...estimate, mostLikely: parseFloat(e.target.value) || 0 })}
            className="mt-1 bg-background"
          />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">Pessimistic</Label>
          <Input
            type="number"
            min="0"
            step="0.5"
            value={estimate.pessimistic || ''}
            onChange={(e) => setEstimate({ ...estimate, pessimistic: parseFloat(e.target.value) || 0 })}
            className="mt-1 bg-background"
          />
        </div>
      </div>

      {expectedTime > 0 && (
        <div className="text-center py-2 bg-background rounded text-sm font-mono">
          Expected: <span className="font-bold">{expectedTime.toFixed(1)}h</span>
        </div>
      )}

      <div className="flex gap-2 justify-end">
        <Button variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          size="sm"
          onClick={() => onSave(estimate)}
          disabled={!estimate.optimistic || !estimate.mostLikely || !estimate.pessimistic}
        >
          Save Estimate
        </Button>
      </div>
    </div>
  );
}
