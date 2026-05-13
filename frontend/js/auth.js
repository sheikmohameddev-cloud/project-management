// Auth helpers + page wiring
async function login(email, password) {
  const data = await API.api("/auth/login/", { method: "POST", body: { email, password } });
  const a = data.access || data.access_token;
  const r = data.refresh || data.refresh_token;
  API.setTokens(a, r);
  location.href = "/pages/dashboard.html";
}

async function register(payload) {
  await API.api("/auth/register/", { method: "POST", body: payload });
  await login(payload.email, payload.password);
}
async function handleGoogleLogin(response) {
    try {
        const data = await API.api("/auth/google/login/", {
            method: "POST",
            body: { access_token: response.credential }
        });
        API.setTokens(
            data.access || data.access_token, 
            data.refresh || data.refresh_token
        );
        U.toast("Welcome to Synapse!", "success");
        setTimeout(() => location.href = "/pages/dashboard.html", 1000);
    } catch (err) {
        U.toast("Google sign-in failed", "error");
    }
}

async function logout() {
  try { await API.api("/auth/logout/", { method: "POST", body: { refresh: API.getRefresh() } }); } catch {}
  API.clearTokens();
  location.href = "/pages/login.html";
}

async function requireAuth() {
  if (API.getAccess()) return;
  if (API.getRefresh()) {
    const ok = await API.refreshAccess();
    if (ok) return;
  }
  location.href = "/pages/login.html";
}

window.Auth = { login, register, logout, requireAuth };
