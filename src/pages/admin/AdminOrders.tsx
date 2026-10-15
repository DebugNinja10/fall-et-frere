import { useEffect, useState } from 'react';
import { supabase, type Order, type OrderItem } from '@/lib/supabase';
import { AdminTableShell, StatusBadge } from '@/components/AdminTable';
import Modal from '@/components/Modal';
import { Eye, Trash2, Euro, Mail, Phone, MapPin, User, Calendar } from 'lucide-react';

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewing, setViewing] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = () => {
    let query = supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (filterStatus !== 'all') query = query.eq('status', filterStatus);
    if (search) query = query.or(`customer_name.ilike.%${search}%,customer_email.ilike.%${search}%`);
    query.then(({ data }) => {
      setOrders(data ?? []);
      setLoading(false);
    });
  };

  useEffect(load, [search, filterStatus]);

  const viewOrder = async (order: Order) => {
    setViewing(order);
    const { data } = await supabase.from('order_items').select('*').eq('order_id', order.id);
    setItems(data ?? []);
  };

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('orders').update({ status, updated_at: new Date().toISOString() }).eq('id', id);
    setViewing(null);
    load();
  };

  const confirmDelete = async () => {
    if (deleteId) {
      await supabase.from('orders').delete().eq('id', deleteId);
      setDeleteId(null);
      load();
    }
  };

  const statuses = ['pending', 'confirmed', 'completed', 'cancelled'];

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Commandes</h1>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="input-field max-w-[200px]"
          >
            <option value="all">Tous les statuts</option>
            {statuses.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="relative max-w-sm">
          <input
            type="text"
            placeholder="Rechercher par nom ou email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field"
          />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Client</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Total</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Statut</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600 w-24">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{o.customer_name}</div>
                      <div className="text-sm text-gray-400">{o.customer_email}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {new Date(o.created_at).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-900">{o.total.toLocaleString('fr-FR')} FCFA</td>
                    <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => viewOrder(o)} className="p-2 rounded-lg text-brand-700 hover:bg-brand-50">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeleteId(o.id)} className="p-2 rounded-lg text-red-500 hover:bg-red-50">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {orders.length === 0 && !loading && (
          <div className="text-center py-12 text-gray-400">Aucune commande trouvée</div>
        )}
      </div>

      <Modal open={!!viewing} onClose={() => setViewing(null)} title="Détails de la commande" size="lg">
        {viewing && (
          <div className="space-y-5">
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-gray-700"><User className="w-4 h-4 text-gray-400" /> {viewing.customer_name}</div>
              <div className="flex items-center gap-2 text-gray-700"><Mail className="w-4 h-4 text-gray-400" /> {viewing.customer_email}</div>
              {viewing.customer_phone && <div className="flex items-center gap-2 text-gray-700"><Phone className="w-4 h-4 text-gray-400" /> {viewing.customer_phone}</div>}
              {viewing.customer_address && <div className="flex items-center gap-2 text-gray-700"><MapPin className="w-4 h-4 text-gray-400" /> {viewing.customer_address}</div>}
              <div className="flex items-center gap-2 text-gray-700"><Calendar className="w-4 h-4 text-gray-400" /> {new Date(viewing.created_at).toLocaleString('fr-FR')}</div>
              <div><StatusBadge status={viewing.status} /></div>
            </div>

            {viewing.notes && (
              <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600">
                <span className="font-semibold">Notes: </span>{viewing.notes}
              </div>
            )}

            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Produit</th>
                    <th className="px-4 py-2 text-center text-sm font-semibold text-gray-600">Qté</th>
                    <th className="px-4 py-2 text-right text-sm font-semibold text-gray-600">Prix unit.</th>
                    <th className="px-4 py-2 text-right text-sm font-semibold text-gray-600">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-2 text-gray-900">{item.product_name}</td>
                      <td className="px-4 py-2 text-center text-gray-600">{item.quantity}</td>
                      <td className="px-4 py-2 text-right text-gray-600">{item.unit_price.toLocaleString('fr-FR')} FCFA</td>
                      <td className="px-4 py-2 text-right font-semibold text-gray-900">{(item.unit_price * item.quantity).toLocaleString('fr-FR')} FCFA</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan={3} className="px-4 py-3 text-right font-bold text-gray-900">Total</td>
                    <td className="px-4 py-3 text-right font-bold text-brand-700">{viewing.total.toLocaleString('fr-FR')} FCFA</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Changer le statut</label>
              <div className="flex gap-2 flex-wrap">
                {statuses.map((s) => (
                  <button
                    key={s}
                    onClick={() => updateStatus(viewing.id, s)}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                      viewing.status === s
                        ? 'bg-brand-700 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {deleteId && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDeleteId(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-fade-in">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Confirmer la suppression</h3>
            <p className="text-gray-500 mb-6">Voulez-vous vraiment supprimer cette commande ?</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="btn-secondary flex-1 !py-2.5">Annuler</button>
              <button onClick={confirmDelete} className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2.5 rounded-lg">Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
