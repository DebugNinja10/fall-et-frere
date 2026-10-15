import { useEffect, useState } from 'react';
import { supabase, type Quote } from '@/lib/supabase';
import { StatusBadge } from '@/components/AdminTable';
import Modal from '@/components/Modal';
import { Eye, Trash2, Mail, Phone, MapPin, User, Calendar, FileText, Euro } from 'lucide-react';

export default function AdminQuotes() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewing, setViewing] = useState<Quote | null>(null);
  const [response, setResponse] = useState('');
  const [estPrice, setEstPrice] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = () => {
    let query = supabase.from('quotes').select('*').order('created_at', { ascending: false });
    if (filterStatus !== 'all') query = query.eq('status', filterStatus);
    if (search) query = query.or(`customer_name.ilike.%${search}%,customer_email.ilike.%${search}%`);
    query.then(({ data }) => {
      setQuotes(data ?? []);
      setLoading(false);
    });
  };

  useEffect(load, [search, filterStatus]);

  const openQuote = (q: Quote) => {
    setViewing(q);
    setResponse(q.admin_response ?? '');
    setEstPrice(q.estimated_price?.toString() ?? '');
  };

  const saveResponse = async (status: string) => {
    if (!viewing) return;
    setSaving(true);
    await supabase.from('quotes').update({
      admin_response: response || null,
      estimated_price: estPrice ? parseFloat(estPrice) : null,
      status,
      updated_at: new Date().toISOString(),
    }).eq('id', viewing.id);
    setSaving(false);
    setViewing(null);
    load();
  };

  const confirmDelete = async () => {
    if (deleteId) {
      await supabase.from('quotes').delete().eq('id', deleteId);
      setDeleteId(null);
      load();
    }
  };

  const statuses = ['pending', 'confirmed', 'refused'];

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Demandes de devis</h1>
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
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Type</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Budget</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Statut</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600 w-24">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {quotes.map((q) => (
                  <tr key={q.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{q.customer_name}</div>
                      <div className="text-sm text-gray-400">{q.customer_email}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{q.service_type ?? '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{new Date(q.created_at).toLocaleDateString('fr-FR')}</td>
                    <td className="px-4 py-3 text-gray-600">{q.budget ? `${q.budget.toLocaleString('fr-FR')} FCFA` : '-'}</td>
                    <td className="px-4 py-3"><StatusBadge status={q.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openQuote(q)} className="p-2 rounded-lg text-brand-700 hover:bg-brand-50">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeleteId(q.id)} className="p-2 rounded-lg text-red-500 hover:bg-red-50">
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

        {quotes.length === 0 && !loading && (
          <div className="text-center py-12 text-gray-400">Aucune demande de devis</div>
        )}
      </div>

      <Modal open={!!viewing} onClose={() => setViewing(null)} title="Détails du devis" size="lg">
        {viewing && (
          <div className="space-y-5">
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-gray-700"><User className="w-4 h-4 text-gray-400" /> {viewing.customer_name}</div>
              <div className="flex items-center gap-2 text-gray-700"><Mail className="w-4 h-4 text-gray-400" /> {viewing.customer_email}</div>
              {viewing.customer_phone && <div className="flex items-center gap-2 text-gray-700"><Phone className="w-4 h-4 text-gray-400" /> {viewing.customer_phone}</div>}
              {viewing.customer_address && <div className="flex items-center gap-2 text-gray-700"><MapPin className="w-4 h-4 text-gray-400" /> {viewing.customer_address}</div>}
              {viewing.service_type && <div className="flex items-center gap-2 text-gray-700"><FileText className="w-4 h-4 text-gray-400" /> Type: {viewing.service_type}</div>}
              <div className="flex items-center gap-2 text-gray-700"><Calendar className="w-4 h-4 text-gray-400" /> {new Date(viewing.created_at).toLocaleDateString('fr-FR')}</div>
              {viewing.budget && <div className="flex items-center gap-2 text-gray-700"><Euro className="w-4 h-4 text-gray-400" /> Budget: {viewing.budget.toLocaleString('fr-FR')} FCFA</div>}
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <span className="font-semibold text-gray-900 block mb-1">Description du projet</span>
              <p className="text-gray-600 text-sm">{viewing.project_description}</p>
            </div>

            <div className="space-y-3 border-t border-gray-100 pt-4">
              <h3 className="font-semibold text-gray-900">Réponse de l'administrateur</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prix estimé (FCFA)</label>
                <input type="number" step="0.01" value={estPrice} onChange={(e) => setEstPrice(e.target.value)} className="input-field" placeholder="ex: 1500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message au client</label>
                <textarea value={response} onChange={(e) => setResponse(e.target.value)} className="input-field min-h-[100px]" placeholder="Votre réponse..." />
              </div>
              <div className="flex gap-2 flex-wrap">
                <button onClick={() => saveResponse('confirmed')} disabled={saving} className="bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2.5 rounded-lg disabled:opacity-50">
                  Marquer comme confirmé
                </button>
                <button onClick={() => saveResponse('refused')} disabled={saving} className="bg-red-500 hover:bg-red-600 text-white font-semibold px-5 py-2.5 rounded-lg disabled:opacity-50">
                  Refuser
                </button>
                <button onClick={() => saveResponse('pending')} disabled={saving} className="btn-secondary !py-2.5">
                  Sauvegarder
                </button>
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
            <p className="text-gray-500 mb-6">Voulez-vous vraiment supprimer cette demande de devis ?</p>
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
