import { auth } from './firebase';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

async function getAuthHeader(): Promise<Record<string, string>> {
  const user = auth.currentUser;
  if (!user) return {};
  const token = await user.getIdToken();
  return { Authorization: `Bearer ${token}` };
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${res.status}`);
  }

  return res.json();
}

async function authRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const authHeaders = await getAuthHeader();
  return request<T>(endpoint, {
    ...options,
    headers: {
      ...authHeaders,
      ...(options.headers as Record<string, string>),
    },
  });
}

// Auth API
export const api = {
  verify: () => authRequest('/api/auth/verify', { method: 'POST' }),

  // Users
  createProfile: (data: { username: string; displayName?: string; photoURL?: string }) =>
    authRequest('/api/users/create', { method: 'POST', body: JSON.stringify(data) }),

  getMe: () => authRequest<{ user: User }>('/api/users/me'),

  checkUsername: (username: string) =>
    request<{ available: boolean }>(`/api/users/check-username/${username}`),

  getPublicProfile: (username: string) =>
    request<PublicUser>(`/api/users/profile/${username}`),

  updateSettings: (data: { isAcceptingMessages: boolean }) =>
    authRequest('/api/users/settings', { method: 'PATCH', body: JSON.stringify(data) }),

  // Messages
  sendMessage: (data: { username: string; type: string; message: string }) =>
    request('/api/messages/send', { method: 'POST', body: JSON.stringify(data) }),

  getMessages: (params?: { type?: string; page?: number; unreadOnly?: boolean }) => {
    const query = new URLSearchParams();
    if (params?.type) query.set('type', params.type);
    if (params?.page) query.set('page', String(params.page));
    if (params?.unreadOnly) query.set('unreadOnly', 'true');
    return authRequest<MessagesResponse>(`/api/messages?${query}`);
  },

  markRead: (id: string) =>
    authRequest(`/api/messages/${id}/read`, { method: 'PATCH' }),

  deleteMessage: (id: string) =>
    authRequest(`/api/messages/${id}`, { method: 'DELETE' }),
};

// Types
export interface User {
  _id: string;
  firebaseUid: string;
  email: string;
  username: string;
  displayName: string;
  profileLink: string;
  photoURL?: string;
  isAcceptingMessages: boolean;
  createdAt: string;
}

export interface PublicUser {
  username: string;
  displayName: string;
  profileLink: string;
  isAcceptingMessages: boolean;
}

export interface Message {
  _id: string;
  receiverId: string;
  type: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface MessagesResponse {
  messages: Message[];
  stats: Record<string, number>;
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export const MESSAGE_TYPES = ['compliment', 'confession', 'crush', 'secret', 'feedback'] as const;
export type MessageType = typeof MESSAGE_TYPES[number];
