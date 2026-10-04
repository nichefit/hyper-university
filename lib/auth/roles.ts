export const ROLES = [
  "student",
  "client",
  "ads_manager",
  "admin",
] as const;

export type AppRole = (typeof ROLES)[number];

export const ROLE_LABELS: Record<AppRole, string> = {
  student: "Student",
  client: "Client",
  ads_manager: "Ads Manager",
  admin: "Admin",
};

export function isAppRole(value: string): value is AppRole {
  return (ROLES as readonly string[]).includes(value);
}

export function roleHasAccess(
  userRoles: AppRole[],
  allowed: AppRole[],
): boolean {
  return userRoles.some((r) => allowed.includes(r));
}
