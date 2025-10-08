const API_BASE = "https://8080-dddabaffaddabaaeaedaacebfbabbcbebecf.premiumproject.examly.io";

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

export async function getAllCookies() {
  const res = await fetch(`${API_BASE}/api/cookies/allCookies`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error("Failed to fetch cookies");
  const data = await res.json();
  return { data };
}

export async function getCookiesByFlavor(flavor) {
  const res = await fetch(`${API_BASE}/api/cookies/byFlavor?flavor=${encodeURIComponent(flavor)}`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error("Failed to fetch cookies by flavor");
  const data = await res.json();
  return { data };
}

export async function addCookie(cookie) {
  const res = await fetch(`${API_BASE}/api/cookies/addCookie`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(cookie),
  });
  if (!res.ok) throw new Error("Failed to add cookie");
  return res.json();
}

export async function deleteCookie(id) {
  const res = await fetch(`${API_BASE}/api/cookies/${id}`, { 
    method: "DELETE",
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error("Failed to delete cookie");
  return;
}

// Legacy compatibility
export const backendUrl = `${API_BASE}/api/cookies`;
export const fetchAllCookies = getAllCookies;
export const fetchCookiesByFlavor = getCookiesByFlavor;
export const addCookieApi = addCookie;
export const deleteCookieApi = deleteCookie;