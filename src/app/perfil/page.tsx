"use client";

import React, { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";

export default function PerfilPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [form, setForm] = useState({ name: '', phone: '', bio: '' });

  useEffect(() => {
    async function load() {
      try {
        const resp = await apiClient.get('/api/user');
        setUser(resp);
        setForm({ name: resp.name || '', phone: resp.phone || '', bio: resp.bio || '' });
      } catch (err) {
        console.error(err);
      } finally { setLoading(false); }
    }
    load();
  }, []);

  const handleSave = async () => {
    const fd = new FormData();
    fd.append('name', form.name);
    fd.append('phone', form.phone);
    fd.append('bio', form.bio);
    if (file) fd.append('profile_photo', file);
    try {
      const resp = await apiClient.patch('/api/user/profile', fd, { isFormData: true });
      alert('Perfil atualizado');
      setUser(resp.data);
    } catch (err: any) {
      alert(err?.message || 'Erro');
    }
  };

  if (loading) return <div style={{ padding: 24 }}>Carregando...</div>;

  return (
    <div style={{ padding: 28 }}>
      <h2>Perfil</h2>
      <div style={{ display: 'flex', gap: 20, marginTop: 12 }}>
        <div style={{ width: 220 }}>
          <div style={{ width: 200, height: 200, borderRadius: 8, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            {user?.profile_photo ? (
              <img src={user.profile_photo} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ color: '#999' }}>Sem foto</div>
            )}
          </div>
          <div style={{ marginTop: 8 }}>
            <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          </div>
        </div>
        <div style={{ flex: 1, background: '#fff', padding: 12, borderRadius: 8 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <input placeholder="Nome" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input placeholder="Telefone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <textarea placeholder="Bio" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} style={{ gridColumn: '1 / -1' }} />
          </div>
          <div style={{ marginTop: 12 }}>
            <button onClick={handleSave} style={{ padding: '8px 14px' }}>Salvar</button>
          </div>
        </div>
      </div>
    </div>
  );
}
