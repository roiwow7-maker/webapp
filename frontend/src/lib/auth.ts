// frontend/lib/auth.ts

const TOKEN_KEY = "rgamer_token";
const USER_KEY = "auth_user";

/* -------------------------------------------
   Token
-------------------------------------------- */

export function saveToken(token: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function removeToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
}

/* -------------------------------------------
   Usuario
-------------------------------------------- */

export function saveUser(user: any) {
  if (typeof window === "undefined") return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getAuthUser(): any | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function removeUser() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(USER_KEY);
}

/* -------------------------------------------
   Estados
-------------------------------------------- */

export function isLoggedIn(): boolean {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem(TOKEN_KEY);
}

export function isAdmin(): boolean {
  if (typeof window === "undefined") return false;

  const user = getAuthUser();
  return !!user?.is_staff; // Django: is_staff = administrador
}

/* -------------------------------------------
   Logout
-------------------------------------------- */

export function logout() {
  if (typeof window === "undefined") return;
  removeToken();
  removeUser();
  window.location.href = "/"; // volver al home
}
