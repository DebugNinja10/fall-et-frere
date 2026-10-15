import { useEffect, useState } from 'react';
import { supabase, type Service } from '@/lib/supabase';
import { AdminTableShell, ActionButtons, ConfirmDelete, StatusBadge } from '@/components/AdminTable';
import Modal from '@/components/Modal';

const emptyForm = {
  name: '',
  description: '',
  price: '',
  category: 'menuiserie',
  duration: '',
  image_url: '',
  is_active: true,
};

export default function AdminServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = () => {
    let query = supabase.from('services').select('*').order('created_at', { ascending: false });
    if (search) query = query.ilike('name', `%${search}%`);
    query.then(({ data }) => {
      setServices(data ?? []);
      setLoading(false);
    });
  };

  useEffect(load, [search]);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (s: Service) => {
    setEditing(s);
    setForm({
      name: s.name,
      description: s.description ?? '',
      price: s.price.toString(),
      category: s.category,
      duration: s.duration ?? '',
      image_url: s.image_url ?? '',
      is_active: s.is_active,
    });
    setModalOpen(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      name: form.name,
      description: form.description || null,
      price: parseFloat(form.price) || 0,
      category: form.category,
      duration: form.duration || null,
      image_url: form.image_url || null,
      is_active: form.is_active,
    };
    if (editing) {
      await supabase.from('services').update(payload).eq('id', editing.id);
    } else {
      await supabase.from('services').insert(payload);
    }
    setSaving(false);
    setModalOpen(false);
    load();
  };

  const confirmDelete = async () => {
    if (deleteId) {
      await supabase.from('services').delete().eq('id', deleteId);
      setDeleteId(null);
      load();
    }
  };

  return (
    <>
      <AdminTableShell
        title="Prestations"
        search={search}
        onSearchChange={setSearch}
        onAdd={openAdd}
        addLabel="Ajouter une prestation"
        columns={['Nom', 'Catégorie', 'Prix', 'Durée', 'Statut']}
      >
        {services.map((s) => (
          <tr key={s.id} className="hover:bg-gray-50">
            <td className="px-4 py-3">
              <div className="font-medium text-gray-900">{s.name}</div>
              <div className="text-sm text-gray-400 max-w-xs truncate">{s.description}</div>
            </td>
            <td className="px-4 py-3"><span className="text-sm capitalize text-gray-600">{s.category}</span></td>
            <td className="px-4 py-3 font-semibold text-gray-900">{s.price.toLocaleString('fr-FR')} FCFA</td>
            <td className="px-4 py-3 text-gray-600">{s.duration ?? '-'}</td>
            <td className="px-4 py-3"><StatusBadge status={s.is_active ? 'completed' : 'cancelled'} /></td>
            <td className="px-4 py-3"><ActionButtons onEdit={() => openEdit(s)} onDelete={() => setDeleteId(s.id)} /></td>
          </tr>
        ))}
      </AdminTableShell>

      {services.length === 0 && !loading && (
        <div className="text-center py-12 text-gray-400">Aucune prestation trouvée</div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Modifier la prestation' : 'Nouvelle prestation'} size="lg">
        <form onSubmit={save} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
            <input required type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field min-h-[80px]" />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prix (FCFA) *</label>
              <input required type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie *</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field">
                <option value="menuiserie">Menuiserie</option>
                <option value="maconnerie">Maçonnerie</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Durée estimée</label>
              <input type="text" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} className="input-field" placeholder="ex: 5-10 jours" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL de l'image</label>
              <input type="text" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="input-field" placeholder="Laisser vide — image à venir" />
            </div>
          </div>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="w-4 h-4 rounded" />
            <span className="text-sm text-gray-700">Prestation visible sur le site</span>
          </label>
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
        message="Voulez-vous vraiment supprimer cette prestation ?"
      />
    </>
  );
}
