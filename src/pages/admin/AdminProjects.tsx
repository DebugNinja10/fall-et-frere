import { useEffect, useState } from 'react';
import { supabase, type Project } from '@/lib/supabase';
import { AdminTableShell, ActionButtons, ConfirmDelete, StatusBadge } from '@/components/AdminTable';
import Modal from '@/components/Modal';
import ProductImage from '@/components/ProductImage';

const emptyForm = {
  title: '',
  description: '',
  category: 'menuiserie',
  client_name: '',
  location: '',
  image_url: '',
  completed_date: '',
  is_featured: false,
  is_active: true,
};

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = () => {
    let query = supabase.from('projects').select('*').order('created_at', { ascending: false });
    if (search) query = query.ilike('title', `%${search}%`);
    query.then(({ data }) => {
      setProjects(data ?? []);
      setLoading(false);
    });
  };

  useEffect(load, [search]);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (p: Project) => {
    setEditing(p);
    setForm({
      title: p.title,
      description: p.description ?? '',
      category: p.category,
      client_name: p.client_name ?? '',
      location: p.location ?? '',
      image_url: p.image_url ?? '',
      completed_date: p.completed_date ?? '',
      is_featured: p.is_featured,
      is_active: p.is_active,
    });
    setModalOpen(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      title: form.title,
      description: form.description || null,
      category: form.category,
      client_name: form.client_name || null,
      location: form.location || null,
      image_url: form.image_url || null,
      completed_date: form.completed_date || null,
      is_featured: form.is_featured,
      is_active: form.is_active,
    };
    if (editing) {
      await supabase.from('projects').update(payload).eq('id', editing.id);
    } else {
      await supabase.from('projects').insert(payload);
    }
    setSaving(false);
    setModalOpen(false);
    load();
  };

  const confirmDelete = async () => {
    if (deleteId) {
      await supabase.from('projects').delete().eq('id', deleteId);
      setDeleteId(null);
      load();
    }
  };

  return (
    <>
      <AdminTableShell
        title="Réalisations"
        search={search}
        onSearchChange={setSearch}
        onAdd={openAdd}
        addLabel="Ajouter un projet"
        columns={['Image', 'Titre', 'Catégorie', 'Lieu', 'Date', 'Vedette', 'Statut']}
      >
        {projects.map((p) => (
          <tr key={p.id} className="hover:bg-gray-50">
            <td className="px-4 py-3">
              <ProductImage src={p.image_url} alt={p.title} className="w-12 h-12 rounded-lg object-cover" />
            </td>
            <td className="px-4 py-3">
              <div className="font-medium text-gray-900">{p.title}</div>
              <div className="text-sm text-gray-400 max-w-xs truncate">{p.description}</div>
            </td>
            <td className="px-4 py-3"><span className="text-sm capitalize text-gray-600">{p.category}</span></td>
            <td className="px-4 py-3 text-sm text-gray-600">{p.location ?? '-'}</td>
            <td className="px-4 py-3 text-sm text-gray-600">{p.completed_date ? new Date(p.completed_date).toLocaleDateString('fr-FR') : '-'}</td>
            <td className="px-4 py-3">
              {p.is_featured ? <span className="text-amber-500 font-semibold text-sm">Oui</span> : <span className="text-gray-300 text-sm">-</span>}
            </td>
            <td className="px-4 py-3"><StatusBadge status={p.is_active ? 'completed' : 'cancelled'} /></td>
            <td className="px-4 py-3"><ActionButtons onEdit={() => openEdit(p)} onDelete={() => setDeleteId(p.id)} /></td>
          </tr>
        ))}
      </AdminTableShell>

      {projects.length === 0 && !loading && (
        <div className="text-center py-12 text-gray-400">Aucun projet trouvé</div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Modifier le projet' : 'Nouveau projet'} size="lg">
        <form onSubmit={save} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Titre *</label>
            <input required type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field min-h-[80px]" />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie *</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field">
                <option value="menuiserie">Menuiserie</option>
                <option value="maconnerie">Maçonnerie</option>
                <option value="quincaillerie">Quincaillerie</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
              <input type="text" value={form.client_name} onChange={(e) => setForm({ ...form, client_name: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lieu</label>
              <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="input-field" placeholder="Dakar, Plateau" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de réalisation</label>
              <input type="date" value={form.completed_date} onChange={(e) => setForm({ ...form, completed_date: e.target.value })} className="input-field" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL de l'image</label>
            <input type="text" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="input-field" placeholder="Laisser vide — image à venir" />
          </div>
          <div className="flex gap-6">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} className="w-4 h-4 rounded" />
              <span className="text-sm text-gray-700">Projet en vedette</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="w-4 h-4 rounded" />
              <span className="text-sm text-gray-700">Visible sur le site</span>
            </label>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary flex-1">Annuler</button>
            <button type="submit" disabled={saving} className="btn-primary flex-1 disabled:opacity-50">
              {saving ? 'Sauvegarde...' : 'Sauvegarder'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDelete
        open={!!deleteId}
        onCancel={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        message="Voulez-vous vraiment supprimer ce projet ?"
      />
    </>
  );
}
