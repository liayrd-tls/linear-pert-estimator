/**
 * Core types for PERT estimation
 */

export interface Task {
  id: string;
  title: string;
  linearId?: string;
  estimate: {
    optimistic: number;
    mostLikely: number;
    pessimistic: number;
  };
  assignee?: string;
  status?: string;
  priority?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  name: string;
  linearTeamId?: string;
  tasks: Task[];
  createdAt: Date;
  updatedAt: Date;
}

export type TimeUnit = 'hours' | 'days' | 'weeks';

export interface EstimateWithUnit {
  optimistic: number;
  mostLikely: number;
  pessimistic: number;
  unit: TimeUnit;
}
