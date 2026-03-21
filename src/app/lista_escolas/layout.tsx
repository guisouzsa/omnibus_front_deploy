'use client';

import ProtectedRoute from '@/components/ProtectedRoute';

export default function ListaEscolasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
