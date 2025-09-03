
export function decodeToken(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}
export function isTokenExpired(token) {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;
  return Date.now() >= decoded.exp * 1000;
}
