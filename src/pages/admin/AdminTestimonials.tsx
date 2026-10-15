import { useEffect, useState } from 'react';
import { supabase, type Testimonial } from '@/lib/supabase';
import { StatusBadge } from '@/components/AdminTable';
import Modal from '@/components/Modal';
import { Star, Eye, Trash2, Check, X } from 'lucide-react';

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [viewing, setViewing] = useState<Testimonial | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = () => {
    let query = supabase.from('testimonials').select('*').order('created_at', { ascending: false });
    if (filter === 'pending') query = query.eq('is_approved', false);
    if (filter === 'approved') query = query.eq('is_approved', true);
    query.then(({ data }) => {
      setTestimonials(data ?? []);
      setLoading(false);
    });
  };

  useEffect(load, [filter]);

  const toggleApproval = async (t: Testimonial) => {
    await supabase.from('testimonials').update({ is_approved: !t.is_approved }).eq('id', t.id);
    load();
  };

  const confirmDelete = async () => {
    if (deleteId) {
      await supabase.from('testimonials').delete().eq('id', deleteId);
      setDeleteId(null);
      load();
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Avis clients</h1>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="input-field max-w-[200px]">
            <option value="all">Tous les avis</option>
            <option value="pending">En attente</option>
            <option value="approved">Approuvés</option>
          </select>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Client</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Note</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Commentaire</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Service</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Statut</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600 w-32">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {testimonials.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{t.customer_name}</div>
                      <div className="text-sm text-gray-400">{new Date(t.created_at).toLocaleDateString('fr-FR')}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-3.5 h-3.5 ${i < t.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} />
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 max-w-xs">
                      <p className="text-sm text-gray-600 truncate">{t.comment}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{t.service_type ?? '-'}</td>
                    <td className="px-4 py-3"><StatusBadge status={t.is_approved ? 'completed' : 'pending'} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => toggleApproval(t)} className={`p-2 rounded-lg transition-colors ${t.is_approved ? 'text-amber-600 hover:bg-amber-50' : 'text-green-600 hover:bg-green-50'}`} title={t.is_approved ? 'Désapprouver' : 'Approuver'}>
                          {t.is_approved ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                        </button>
                        <button onClick={() => setViewing(t)} className="p-2 rounded-lg text-brand-700 hover:bg-brand-50">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeleteId(t.id)} className="p-2 rounded-lg text-red-500 hover:bg-red-50">
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

        {testimonials.length === 0 && !loading && (
          <div className="text-center py-12 text-gray-400">Aucun avis trouvé</div>
        )}
      </div>

      <Modal open={!!viewing} onClose={() => setViewing(null)} title="Détail de l'avis" size="md">
        {viewing && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="font-bold text-lg text-gray-900">{viewing.customer_name}</div>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-5 h-5 ${i < viewing.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} />
                ))}
              </div>
            </div>
            {viewing.service_type && <div className="text-sm text-gray-400">Service: {viewing.service_type}</div>}
            <div className="bg-gray-50 rounded-lg p-4 text-gray-700 italic">"{viewing.comment}"</div>
            <div className="text-sm text-gray-400">Publié le {new Date(viewing.created_at).toLocaleString('fr-FR')}</div>
            <div className="flex gap-2">
              <button onClick={() => { toggleApproval(viewing); setViewing(null); }} className={`flex-1 py-2.5 rounded-lg font-semibold text-white ${viewing.is_approved ? 'bg-amber-500 hover:bg-amber-600' : 'bg-green-600 hover:bg-green-700'}`}>
                {viewing.is_approved ? 'Désapprouver' : 'Approuver'}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {deleteId && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDeleteId(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-fade-in">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Supprimer cet avis ?</h3>
            <p className="text-gray-500 mb-6">Cette action est irréversible.</p>
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
