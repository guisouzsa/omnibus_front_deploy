'use client';

import ProtectedRoute from '@/components/ProtectedRoute';

export default function EditRotaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
