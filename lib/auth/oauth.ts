/**
 * Linear OAuth configuration and helpers
 */

const LINEAR_OAUTH_URL = 'https://linear.app/oauth/authorize';
const LINEAR_TOKEN_URL = 'https://api.linear.app/oauth/token';

export interface LinearOAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

export function getOAuthConfig(): LinearOAuthConfig {
  const clientId = process.env.LINEAR_CLIENT_ID;
  const clientSecret = process.env.LINEAR_CLIENT_SECRET;
  const redirectUri = process.env.LINEAR_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error(
      'Missing Linear OAuth configuration. Set LINEAR_CLIENT_ID, LINEAR_CLIENT_SECRET, and LINEAR_REDIRECT_URI in .env.local'
    );
  }

  return { clientId, clientSecret, redirectUri };
}

/**
 * Generate OAuth authorization URL
 */
export function getAuthorizationUrl(state?: string): string {
  const config = getOAuthConfig();

  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    response_type: 'code',
    scope: 'read,write',
    ...(state && { state }),
  });

  return `${LINEAR_OAUTH_URL}?${params.toString()}`;
}

/**
 * Exchange authorization code for access token
 */
export async function exchangeCodeForToken(code: string): Promise<{
  access_token: string;
  expires_in: number;
  token_type: string;
}> {
  const config = getOAuthConfig();

  const response = await fetch(LINEAR_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: config.clientId,
      client_secret: config.clientSecret,
      redirect_uri: config.redirectUri,
      code,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to exchange code for token: ${error}`);
  }

  return response.json();
}

/**
 * Get user info from Linear API using access token
 */
export async function getLinearUser(accessToken: string): Promise<{
  id: string;
  name: string;
  email: string;
}> {
  const response = await fetch('https://api.linear.app/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      query: `
        query Me {
          viewer {
            id
            name
            email
          }
        }
      `,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user info from Linear');
  }

  const data = await response.json();
  return data.data.viewer;
}
