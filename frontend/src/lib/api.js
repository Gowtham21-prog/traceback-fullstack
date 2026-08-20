// ─────────────────────────────────────────────────────────
// API CONTRACT LAYER
//
// This is the single place the frontend talks to the backend.
// Right now USE_MOCK = true, so every function resolves with
// data from src/data/mockCases.js and nothing leaves the browser.
//
// To wire up the real Spring Boot + MySQL backend (see /backend):
//   1. Set USE_MOCK = false
//   2. Set VITE_API_BASE in a .env file, e.g.:
//        VITE_API_BASE=http://localhost:8080/api
//   3. Every function below already targets the routes the backend
//      implements 1:1 — see backend/README.md for the full route table.
// ─────────────────────────────────────────────────────────

import { MOCK_CASES } from '../data/mockCases';

const USE_MOCK = true;

// In production, prefer an env var over a hardcoded host so the
// same build works on any device/network:
export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080/api';

function getToken() {
  return localStorage.getItem('tb_token') || '';
}

async function request(path, opts = {}) {
  const token = getToken();
  const res = await fetch(API_BASE + path, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...opts.headers,
    },
    ...opts,
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data?.message || `Request failed: ${res.status}`);
  }
  return data;
}

// simulate network latency for the mock layer so loading states are visible
const wait = (ms = 250) => new Promise((r) => setTimeout(r, ms));

let mockCasesStore = [...MOCK_CASES];

// ── CASES ──────────────────────────────────────────────────

export async function fetchCases(filters = {}) {
  if (USE_MOCK) {
    await wait();
    let results = [...mockCasesStore];
    if (filters.status) results = results.filter((c) => c.status === filters.status);
    if (filters.case_type) results = results.filter((c) => c.case_type === filters.case_type);
    if (filters.q) {
      const q = filters.q.toLowerCase();
      results = results.filter(
        (c) =>
          c.full_name.toLowerCase().includes(q) ||
          (c.last_seen_location || '').toLowerCase().includes(q) ||
          c.report_number.toLowerCase().includes(q)
      );
    }
    return { success: true, data: results };
  }
  const qs = new URLSearchParams(filters).toString();
  return request(`/cases${qs ? `?${qs}` : ''}`);
}

export async function fetchCaseStats() {
  if (USE_MOCK) {
    await wait();
    const total = mockCasesStore.length;
    const missing = mockCasesStore.filter((c) => c.status === 'missing').length;
    const found = mockCasesStore.filter((c) => c.status === 'found').length;
    const investigating = mockCasesStore.filter((c) => c.status === 'investigating').length;
    const today = 0;
    return {
      success: true,
      data: { total, missing, found, investigating, today, districts: [], ageGroups: [], monthly: [] },
    };
  }
  return request('/cases/stats');
}

export async function fetchCaseById(id) {
  if (USE_MOCK) {
    await wait();
    const found = mockCasesStore.find((c) => c.id === id);
    return found ? { success: true, data: found } : { success: false, message: 'Case not found' };
  }
  return request(`/cases/${id}`);
}

/**
 * Uploads a case photo to POST /api/uploads/photo and returns a servable
 * URL. In mock mode, just returns the local data URL so preview/submission
 * behavior is identical without a backend running.
 */
export async function uploadPhoto(file) {
  if (USE_MOCK) {
    await wait(400);
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (ev) => resolve({ success: true, url: ev.target.result });
      reader.readAsDataURL(file);
    });
  }
  const formData = new FormData();
  formData.append('file', file);
  const token = getToken();
  const res = await fetch(API_BASE + '/uploads/photo', {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data?.message || 'Photo upload failed.');
  }
  return { success: true, url: data?.data?.url };
}

export async function createCase(payload) {
  if (USE_MOCK) {
    await wait();
    const now = new Date();
    const report_number = `TB-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}-${Math.floor(
      1000 + Math.random() * 9000
    )}`;
    const saved = { id: String(mockCasesStore.length + 1), created_at: now.toISOString(), status: 'missing', ...payload, report_number };
    mockCasesStore = [saved, ...mockCasesStore];
    return { success: true, data: saved, report_number };
  }
  return request('/cases', { method: 'POST', body: JSON.stringify(payload) });
}

export async function updateCaseStatus(id, status) {
  if (USE_MOCK) {
    await wait();
    mockCasesStore = mockCasesStore.map((c) => (c.id === id ? { ...c, status } : c));
    return { success: true, data: mockCasesStore.find((c) => c.id === id) };
  }
  return request(`/cases/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
}

export async function deleteCase(id) {
  if (USE_MOCK) {
    await wait();
    mockCasesStore = mockCasesStore.filter((c) => c.id !== id);
    return { success: true };
  }
  return request(`/cases/${id}`, { method: 'DELETE' });
}

// ── AUTH ───────────────────────────────────────────────────

export async function login(email, password) {
  if (USE_MOCK) {
    await wait();
    if (!email || !password) return { success: false, message: 'Email and password required' };
    return {
      success: true,
      token: 'mock-token',
      user: { id: 'u1', name: 'Demo Officer', email, role: email.includes('police') ? 'police' : 'reporter' },
    };
  }
  return request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
}

export async function register({ name, email, password, role }) {
  if (USE_MOCK) {
    await wait();
    if (!name || !email || !password) return { success: false, message: 'Name, email, password required' };
    return { success: true, token: 'mock-token', user: { id: 'u2', name, email, role: role || 'reporter' } };
  }
  return request('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password, role }) });
}

export async function fetchMe() {
  if (USE_MOCK) {
    await wait();
    return { success: true, user: null };
  }
  return request('/auth/me');
}
