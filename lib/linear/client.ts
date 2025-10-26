/**
 * Linear API Client
 *
 * Supports both OAuth tokens and API keys
 */

import { LinearClient } from '@linear/sdk';
import { getSession } from '@/lib/auth/session';

/**
 * Get Linear client using OAuth token from session
 */
export async function getLinearClientFromSession(): Promise<LinearClient | null> {
  const session = await getSession();

  if (!session || !session.accessToken) {
    return null;
  }

  return new LinearClient({ accessToken: session.accessToken });
}

/**
 * Get Linear client using API key (fallback method)
 */
export function getLinearClient(apiKey?: string): LinearClient {
  const key = apiKey || process.env.NEXT_PUBLIC_LINEAR_API_KEY || '';

  if (!key) {
    throw new Error(
      'Linear API key not found. Please authenticate via OAuth or set NEXT_PUBLIC_LINEAR_API_KEY in .env.local'
    );
  }

  return new LinearClient({ apiKey: key });
}

/**
 * Fetch all issues from a team
 */
export async function fetchTeamIssues(client: LinearClient, teamId: string) {
  const team = await client.team(teamId);
  const issues = await team.issues();

  return issues.nodes.map(issue => ({
    id: issue.id,
    title: issue.title,
    description: issue.description,
    state: issue.state,
    priority: issue.priority,
    estimate: issue.estimate,
    assignee: issue.assignee,
    createdAt: issue.createdAt,
    updatedAt: issue.updatedAt,
  }));
}

/**
 * Fetch all teams
 */
export async function fetchTeams(client: LinearClient) {
  const teams = await client.teams();
  return teams.nodes.map(team => ({
    id: team.id,
    name: team.name,
    key: team.key,
  }));
}

/**
 * Create custom field for PERT estimates (if needed)
 */
export async function createPertCustomField(client: LinearClient, teamId: string) {
  // Note: Linear custom fields can be used to store PERT estimates
  // This is a placeholder - actual implementation would use Linear's custom field API
  console.log('Custom field creation for team:', teamId);
  return null;
}
