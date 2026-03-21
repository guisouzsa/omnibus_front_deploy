'use client';

import ProtectedRoute from '@/components/ProtectedRoute';

export default function VisualizarRotaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
