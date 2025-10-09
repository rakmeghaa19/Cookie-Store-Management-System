const API_BASE = "https://8080-fecafffabfdabaaeaedaacebfbabbcbebecf.premiumproject.examly.io";

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || `HTTP ${response.status}`);
  }
  return response.json();
};

// Cookie API
export async function getAllCookies() {
  const res = await fetch(`${API_BASE}/api/cookies/allCookies`, {
    headers: getAuthHeaders()
  });
  const data = await handleResponse(res);
  return { data };
}

export async function getCookieById(id) {
  const res = await fetch(`${API_BASE}/api/cookies/${id}`, {
    headers: getAuthHeaders()
  });
  return handleResponse(res);
}

export async function searchCookies(name) {
  const res = await fetch(`${API_BASE}/api/cookies/search?name=${encodeURIComponent(name)}`, {
    headers: getAuthHeaders()
  });
  return handleResponse(res);
}

export async function getCookiesByFlavor(flavor) {
  const res = await fetch(`${API_BASE}/api/cookies/byFlavor?flavor=${encodeURIComponent(flavor)}`, {
    headers: getAuthHeaders()
  });
  const data = await handleResponse(res);
  return { data };
}

export async function addCookie(cookie) {
  const res = await fetch(`${API_BASE}/api/cookies/addCookie`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(cookie),
  });
  return handleResponse(res);
}

export async function updateCookie(id, cookie) {
  const res = await fetch(`${API_BASE}/api/cookies/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(cookie),
  });
  return handleResponse(res);
}

export async function deleteCookie(id) {
  const res = await fetch(`${API_BASE}/api/cookies/${id}`, { 
    method: "DELETE",
    headers: getAuthHeaders()
  });
  return handleResponse(res);
}

// Order API
export async function getAllOrders() {
  const res = await fetch(`${API_BASE}/api/orders`, {
    headers: getAuthHeaders()
  });
  return handleResponse(res);
}

export async function getOrderById(id) {
  const res = await fetch(`${API_BASE}/api/orders/${id}`, {
    headers: getAuthHeaders()
  });
  return handleResponse(res);
}

export async function getOrdersByCustomer(customerName) {
  const res = await fetch(`${API_BASE}/api/orders/customer/${encodeURIComponent(customerName)}`, {
    headers: getAuthHeaders()
  });
  return handleResponse(res);
}

export async function getOrdersByStatus(status) {
  const res = await fetch(`${API_BASE}/api/orders/status/${encodeURIComponent(status)}`, {
    headers: getAuthHeaders()
  });
  return handleResponse(res);
}

export async function createOrder(order) {
  const res = await fetch(`${API_BASE}/api/orders`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(order),
  });
  return handleResponse(res);
}

export async function updateOrder(id, order) {
  const res = await fetch(`${API_BASE}/api/orders/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(order),
  });
  return handleResponse(res);
}

export async function updateOrderStatus(id, status) {
  const res = await fetch(`${API_BASE}/api/orders/${id}/status`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });
  return handleResponse(res);
}

export async function deleteOrder(id) {
  const res = await fetch(`${API_BASE}/api/orders/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders()
  });
  return handleResponse(res);
}

// User API
export async function getAllUsers() {
  const res = await fetch(`${API_BASE}/api/users`, {
    headers: getAuthHeaders()
  });
  return handleResponse(res);
}

export async function getUsersByRole(role) {
  const res = await fetch(`${API_BASE}/api/users/role/${encodeURIComponent(role)}`, {
    headers: getAuthHeaders()
  });
  return handleResponse(res);
}

export async function createUser(user) {
  const res = await fetch(`${API_BASE}/api/users`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(user),
  });
  return handleResponse(res);
}

// Auth API
export async function login(credentials) {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  return handleResponse(res);
}

export async function register(userData) {
  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  return handleResponse(res);
}

// Legacy compatibility
export const backendUrl = `${API_BASE}/api/cookies`;
export const fetchAllCookies = getAllCookies;
export const fetchCookiesByFlavor = getCookiesByFlavor;
export const addCookieApi = addCookie;
export const deleteCookieApi = deleteCookie;