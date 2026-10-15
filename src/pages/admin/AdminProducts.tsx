import { useEffect, useState } from 'react';
import { supabase, type Product } from '@/lib/supabase';
import { AdminTableShell, ActionButtons, ConfirmDelete, StatusBadge } from '@/components/AdminTable';
import Modal from '@/components/Modal';
import ProductImage from '@/components/ProductImage';

const emptyForm = {
  name: '',
  description: '',
  price: '',
  category: 'quincaillerie',
  stock: '',
  unit: 'pièce',
  image_url: '',
  is_active: true,
};

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = () => {
    let query = supabase.from('products').select('*').order('created_at', { ascending: false });
    if (search) query = query.ilike('name', `%${search}%`);
    query.then(({ data }) => {
      setProducts(data ?? []);
      setLoading(false);
    });
  };

  useEffect(load, [search]);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({
      name: p.name,
      description: p.description ?? '',
      price: p.price.toString(),
      category: p.category,
      stock: p.stock.toString(),
      unit: p.unit,
      image_url: p.image_url ?? '',
      is_active: p.is_active,
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
      stock: parseInt(form.stock) || 0,
      unit: form.unit,
      image_url: form.image_url || null,
      is_active: form.is_active,
    };
    if (editing) {
      await supabase.from('products').update(payload).eq('id', editing.id);
    } else {
      await supabase.from('products').insert(payload);
    }
    setSaving(false);
    setModalOpen(false);
    load();
  };

  const confirmDelete = async () => {
    if (deleteId) {
      await supabase.from('products').delete().eq('id', deleteId);
      setDeleteId(null);
      load();
    }
  };

  return (
    <>
      <AdminTableShell
        title="Produits"
        search={search}
        onSearchChange={setSearch}
        onAdd={openAdd}
        addLabel="Ajouter un produit"
        columns={['Image', 'Nom', 'Catégorie', 'Prix', 'Stock', 'Statut']}
      >
        {products.map((p) => (
          <tr key={p.id} className="hover:bg-gray-50">
            <td className="px-4 py-3">
              <ProductImage src={p.image_url} alt={p.name} className="w-12 h-12 rounded-lg object-cover" />
            </td>
            <td className="px-4 py-3">
              <div className="font-medium text-gray-900">{p.name}</div>
              <div className="text-sm text-gray-400 max-w-xs truncate">{p.description}</div>
            </td>
            <td className="px-4 py-3">
              <span className="text-sm capitalize text-gray-600">{p.category}</span>
            </td>
            <td className="px-4 py-3 font-semibold text-gray-900">{p.price.toLocaleString('fr-FR')} FCFA</td>
            <td className="px-4 py-3 text-gray-600">{p.stock} {p.unit}</td>
            <td className="px-4 py-3">
              <StatusBadge status={p.is_active ? 'completed' : 'cancelled'} />
            </td>
            <td className="px-4 py-3">
              <ActionButtons onEdit={() => openEdit(p)} onDelete={() => setDeleteId(p.id)} />
            </td>
          </tr>
        ))}
      </AdminTableShell>

      {products.length === 0 && !loading && (
        <div className="text-center py-12 text-gray-400">Aucun produit trouvé</div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Modifier le produit' : 'Nouveau produit'} size="lg">
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
                <option value="quincaillerie">Quincaillerie</option>
                <option value="menuiserie">Menuiserie</option>
                <option value="maconnerie">Maçonnerie</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
              <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unité</label>
              <input type="text" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} className="input-field" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL de l'image</label>
            <input type="text" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="input-field" placeholder="Laisser vide — image à venir" />
            <p className="text-xs text-gray-400 mt-1">Laisser vide pour afficher « Image à venir »</p>
          </div>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="w-4 h-4 rounded" />
            <span className="text-sm text-gray-700">Produit visible sur le site</span>
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
        message="Voulez-vous vraiment supprimer ce produit ? Cette action est irréversible."
      />
    </>
  );
}
