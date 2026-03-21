'use client';

import ProtectedRoute from '@/components/ProtectedRoute';

export default function CadastroEscolaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
