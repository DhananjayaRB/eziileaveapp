export type UserRole = "admin" | "employee" | "manager";

interface RoutePermission {
  roles: UserRole[];
  redirect: string;
}

interface RoutePermissions {
  [key: string]: RoutePermission;
}

export const routePermissions: RoutePermissions = {
  "/setup": {
    roles: ["admin"],
    redirect: "/",
  },

  // '/some-other-protected-route': {
  //   roles: ['admin', 'manager'],
  //   redirect: '/dashboard'
  // }
};
