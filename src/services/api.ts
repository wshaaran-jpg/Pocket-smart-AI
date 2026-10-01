import {
  HomeBudgetInput,
  HomePlanResult,
  PartyBudgetInput,
  PartyPlanResult,
  JewelryBudgetInput,
  JewelryPlanResult,
  HistoryItem,
  User,
  SessionInfo,
} from '../types';

const API_BASE = '/api';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('pocketsmart_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function loginUser(username: string, password?: string): Promise<{ token: string; user: User }> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to login');
  }
  return res.json();
}

export async function registerUser(username: string, email: string, password?: string, fullName?: string): Promise<{ token: string; user: User }> {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password, full_name: fullName }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to register');
  }
  return res.json();
}

export async function logoutUser(username: string): Promise<void> {
  await fetch(`${API_BASE}/auth/logout`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ username }),
  }).catch(() => {});
}

export async function fetchSessionInfo(): Promise<SessionInfo> {
  const res = await fetch(`${API_BASE}/session-info`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to load session');
  return res.json();
}

export async function generateHomeBudget(input: HomeBudgetInput): Promise<HomePlanResult> {
  const res = await fetch(`${API_BASE}/generate-home`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to generate home budget');
  }
  return res.json();
}

export async function generatePartyBudget(input: PartyBudgetInput): Promise<PartyPlanResult> {
  const res = await fetch(`${API_BASE}/generate-party`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to generate party budget');
  }
  return res.json();
}

export async function generateJewelryBudget(input: JewelryBudgetInput): Promise<JewelryPlanResult> {
  const res = await fetch(`${API_BASE}/generate-jewelry`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to generate jewelry budget');
  }
  return res.json();
}

export async function fetchHistory(): Promise<HistoryItem[]> {
  const res = await fetch(`${API_BASE}/history`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to load history');
  const data = await res.json();
  return data.history || [];
}

export async function fetchHistoryItem(id: string): Promise<HistoryItem> {
  const res = await fetch(`${API_BASE}/history/${id}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to load history item');
  return res.json();
}

export async function deleteHistoryItem(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/history/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete history item');
}
