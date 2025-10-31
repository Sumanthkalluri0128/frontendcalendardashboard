const BACKEND =
  process.env.REACT_APP_BACKEND_URL ||
  "https://calendarcustomdashboard.onrender.com";
export async function getAuthUrl() {
  const resp = await fetch(`${BACKEND}/api/auth/url`);
  const data = await resp.json();
  return data.url;
}
export async function getEvents(jwt) {
  const resp = await fetch(`${BACKEND}/api/events`, {
    headers: { Authorization: `Bearer ${jwt}` },
  });
  if (!resp.ok) {
    const txt = await resp.text();
    throw new Error(txt || "Failed to fetch");
  }
  return resp.json();
}
