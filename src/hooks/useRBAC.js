"use client"

import { useSession } from "next-auth/react";

export function useRBAC() {
  const { data: session } = useSession();
  const user = session?.user;

  const hasPermission = (module, action) => {
    if (!user || !user.roles) return false;

    // Super Admin bypasses all checks
    const isSuper = user.roles.some(role => 
      role.name === 'Super Admin' || (typeof role === 'string' && role === 'Super Admin')
    );
    if (isSuper) return true;

    // Check permissions within roles
    return user.roles.some(role => {
      if (!role.permissions) return false;
      return role.permissions.some(perm => 
        perm.module === module && perm.name === action
      );
    });
  };

  const hasRole = (roleName) => {
    if (!user || !user.roles) return false;
    return user.roles.some(role => 
      role.name === roleName || (typeof role === 'string' && role === roleName)
    );
  };

  return {
    user,
    hasPermission,
    hasRole,
    isSuperAdmin: hasRole('Super Admin'),
    isLoading: !session && !user
  };
}
