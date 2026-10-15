import { useEffect, useState } from 'react';
import { supabase, type Truck } from '@/lib/supabase';
import { AdminTableShell, ActionButtons, ConfirmDelete, StatusBadge } from '@/components/AdminTable';
import Modal from '@/components/Modal';

const emptyForm = {
  name: '',
  description: '',
  daily_rate: '',
  capacity: '',
  plate_number: '',
  image_url: '',
  is_available: true,
};

export default function AdminTrucks() {
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Truck | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = () => {
    let query = supabase.from('trucks').select('*').order('created_at', { ascending: false });
    if (search) query = query.ilike('name', `%${search}%`);
    query.then(({ data }) => {
      setTrucks(data ?? []);
      setLoading(false);
    });
  };

  useEffect(load, [search]);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (t: Truck) => {
    setEditing(t);
    setForm({
      name: t.name,
      description: t.description ?? '',
      daily_rate: t.daily_rate.toString(),
      capacity: t.capacity ?? '',
      plate_number: t.plate_number ?? '',
      image_url: t.image_url ?? '',
      is_available: t.is_available,
    });
    setModalOpen(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      name: form.name,
      description: form.description || null,
      daily_rate: parseFloat(form.daily_rate) || 0,
      capacity: form.capacity || null,
      plate_number: form.plate_number || null,
      image_url: form.image_url || null,
      is_available: form.is_available,
    };
    if (editing) {
      await supabase.from('trucks').update(payload).eq('id', editing.id);
    } else {
      await supabase.from('trucks').insert(payload);
    }
    setSaving(false);
    setModalOpen(false);
    load();
  };

  const confirmDelete = async () => {
    if (deleteId) {
      await supabase.from('trucks').delete().eq('id', deleteId);
      setDeleteId(null);
      load();
    }
  };

  return (
    <>
      <AdminTableShell
        title="Camions"
        search={search}
        onSearchChange={setSearch}
        onAdd={openAdd}
        addLabel="Ajouter un camion"
        columns={['Nom', 'Capacité', 'Immat.', 'Tarif/jour', 'Disponibilité']}
      >
        {trucks.map((t) => (
          <tr key={t.id} className="hover:bg-gray-50">
            <td className="px-4 py-3">
              <div className="font-medium text-gray-900">{t.name}</div>
              <div className="text-sm text-gray-400 max-w-xs truncate">{t.description}</div>
            </td>
            <td className="px-4 py-3 text-gray-600">{t.capacity ?? '-'}</td>
            <td className="px-4 py-3 text-gray-600">{t.plate_number ?? '-'}</td>
            <td className="px-4 py-3 font-semibold text-gray-900">{t.daily_rate.toLocaleString('fr-FR')} FCFA</td>
            <td className="px-4 py-3"><StatusBadge status={t.is_available ? 'completed' : 'cancelled'} /></td>
            <td className="px-4 py-3"><ActionButtons onEdit={() => openEdit(t)} onDelete={() => setDeleteId(t.id)} /></td>
          </tr>
        ))}
      </AdminTableShell>

      {trucks.length === 0 && !loading && (
        <div className="text-center py-12 text-gray-400">Aucun camion trouvé</div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Modifier le camion' : 'Nouveau camion'} size="lg">
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Tarif par jour (FCFA) *</label>
              <input required type="number" step="0.01" value={form.daily_rate} onChange={(e) => setForm({ ...form, daily_rate: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Capacité</label>
              <input type="text" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} className="input-field" placeholder="ex: 3.5 tonnes" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Immatriculation</label>
              <input type="text" value={form.plate_number} onChange={(e) => setForm({ ...form, plate_number: e.target.value })} className="input-field" placeholder="AB-123-CD" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL de l'image</label>
              <input type="text" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="input-field" placeholder="Laisser vide — image à venir" />
            </div>
          </div>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.is_available} onChange={(e) => setForm({ ...form, is_available: e.target.checked })} className="w-4 h-4 rounded" />
            <span className="text-sm text-gray-700">Camion disponible à la location</span>
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
        message="Voulez-vous vraiment supprimer ce camion ?"
      />
    </>
  );
}
