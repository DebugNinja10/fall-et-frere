import { useEffect, useState } from 'react';
import { supabase, type Reservation, type Truck } from '@/lib/supabase';
import { StatusBadge } from '@/components/AdminTable';
import Modal from '@/components/Modal';
import { Eye, Trash2, Mail, Phone, MapPin, User, Calendar, Truck as TruckIcon, Euro } from 'lucide-react';

export default function AdminReservations() {
  const [reservations, setReservations] = useState<(Reservation & { truck?: Truck })[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewing, setViewing] = useState<(Reservation & { truck?: Truck }) | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = () => {
    let query = supabase
      .from('reservations')
      .select('*, truck:trucks(*)')
      .order('created_at', { ascending: false });
    if (filterStatus !== 'all') query = query.eq('status', filterStatus);
    if (search) query = query.or(`customer_name.ilike.%${search}%,customer_email.ilike.%${search}%`);
    query.then(({ data }) => {
      setReservations(data ?? []);
      setLoading(false);
    });
  };

  useEffect(load, [search, filterStatus]);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('reservations').update({ status, updated_at: new Date().toISOString() }).eq('id', id);
    setViewing(null);
    load();
  };

  const confirmDelete = async () => {
    if (deleteId) {
      await supabase.from('reservations').delete().eq('id', deleteId);
      setDeleteId(null);
      load();
    }
  };

  const statuses = ['pending', 'confirmed', 'completed', 'cancelled'];

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Réservations de camions</h1>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="input-field max-w-[200px]">
            <option value="all">Tous les statuts</option>
            {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="relative max-w-sm">
          <input type="text" placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field" />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Client</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Camion</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Dates</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Coût</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Statut</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600 w-24">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {reservations.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{r.customer_name}</div>
                      <div className="text-sm text-gray-400">{r.customer_email}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{r.truck?.name ?? '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {new Date(r.start_date).toLocaleDateString('fr-FR')} → {new Date(r.end_date).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-900">{r.total_cost.toLocaleString('fr-FR')} FCFA</td>
                    <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => setViewing(r)} className="p-2 rounded-lg text-brand-700 hover:bg-brand-50">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeleteId(r.id)} className="p-2 rounded-lg text-red-500 hover:bg-red-50">
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

        {reservations.length === 0 && !loading && (
          <div className="text-center py-12 text-gray-400">Aucune réservation</div>
        )}
      </div>

      <Modal open={!!viewing} onClose={() => setViewing(null)} title="Détails de la réservation" size="lg">
        {viewing && (
          <div className="space-y-5">
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-gray-700"><User className="w-4 h-4 text-gray-400" /> {viewing.customer_name}</div>
              <div className="flex items-center gap-2 text-gray-700"><Mail className="w-4 h-4 text-gray-400" /> {viewing.customer_email}</div>
              {viewing.customer_phone && <div className="flex items-center gap-2 text-gray-700"><Phone className="w-4 h-4 text-gray-400" /> {viewing.customer_phone}</div>}
              {viewing.customer_address && <div className="flex items-center gap-2 text-gray-700"><MapPin className="w-4 h-4 text-gray-400" /> {viewing.customer_address}</div>}
              {viewing.truck && <div className="flex items-center gap-2 text-gray-700"><TruckIcon className="w-4 h-4 text-gray-400" /> {viewing.truck.name}</div>}
              <div className="flex items-center gap-2 text-gray-700"><Calendar className="w-4 h-4 text-gray-400" /> {new Date(viewing.start_date).toLocaleDateString('fr-FR')} → {new Date(viewing.end_date).toLocaleDateString('fr-FR')}</div>
              <div className="flex items-center gap-2 text-gray-700"><Euro className="w-4 h-4 text-gray-400" /> {viewing.total_cost.toLocaleString('fr-FR')} FCFA</div>
            </div>

            {viewing.notes && (
              <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600">
                <span className="font-semibold">Notes: </span>{viewing.notes}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Changer le statut</label>
              <div className="flex gap-2 flex-wrap">
                {statuses.map((s) => (
                  <button
                    key={s}
                    onClick={() => updateStatus(viewing.id, s)}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                      viewing.status === s ? 'bg-brand-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
            <p className="text-gray-500 mb-6">Voulez-vous vraiment supprimer cette réservation ?</p>
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
