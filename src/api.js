// Talks to the namy-backend server. Set VITE_API_BASE in your .env file
// if the backend isn't running on the default http://localhost:4000.
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(body.error || 'Request failed');
  }

  if (res.status === 204) return null;
  return res.json();
}

function resource(name) {
  return {
    list: () => request(`/${name}`),
    create: (token, data) =>
      request(`/${name}`, { method: 'POST', body: JSON.stringify(data), headers: { Authorization: `Bearer ${token}` } }),
    update: (token, id, data) =>
      request(`/${name}/${id}`, { method: 'PUT', body: JSON.stringify(data), headers: { Authorization: `Bearer ${token}` } }),
    remove: (token, id) =>
      request(`/${name}/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } }),
  };
}

export const api = {
  login: (username, password) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) }),
  workshops: resource('workshops'),
  news: resource('news'),
  stats: resource('stats'),
  seminars: resource('seminars'),
  leadership: resource('leadership'),
};