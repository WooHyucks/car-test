export const DEMO_ACCESS_PASSWORD = "4132";
export const ACCESS_STORAGE_KEY = "chassis-ai-access-granted";

export function verifyAccessPassword(password: string): boolean {
  return password.trim() === DEMO_ACCESS_PASSWORD;
}
