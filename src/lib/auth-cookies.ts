import Cookies from "js-cookie";

const cookieOptions = { path: "/" as const };

export function setAuthCookies(
  token: string,
  role: string,
  userId: string
) {
  Cookies.set("token", token, cookieOptions);
  Cookies.set("role", role, cookieOptions);
  Cookies.set("userId", userId, cookieOptions);
}

export function clearAuthCookies() {
  Cookies.remove("token", cookieOptions);
  Cookies.remove("role", cookieOptions);
  Cookies.remove("userId", cookieOptions);
}

export function getAuthToken(): string | undefined {
  return Cookies.get("token");
}

export function getDashboardPathForRole(role: string) {
  return role === "admin" ? "/admin/dashboard" : "/dashboard";
}
