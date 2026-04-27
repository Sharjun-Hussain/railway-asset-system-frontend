"use client"

import { useRBAC } from "@/hooks/useRBAC";

/**
 * PermissionGate component
 * renders its children only if the user has the specified permission.
 * 
 * @param {string} module - The module name (eg. 'stock', 'product')
 * @param {string} action - The action name (eg. 'view', 'manage', 'receive')
 * @param {React.ReactNode} children - Components to show if permitted
 * @param {React.ReactNode} fallback - (Optional) Components to show if denied
 */
export function PermissionGate({ module, action, children, fallback = null }) {
  const { hasPermission, isLoading } = useRBAC();

  if (isLoading) return null;

  if (hasPermission(module, action)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
}
