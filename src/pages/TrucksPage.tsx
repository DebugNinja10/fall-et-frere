import { useEffect, useState } from 'react';
import { supabase, type Truck } from '@/lib/supabase';
import ProductImage from '@/components/ProductImage';
import Modal from '@/components/Modal';
import { Truck as TruckIcon, Calendar, User, Mail, Phone, MapPin, Check } from 'lucide-react';

export default function TrucksPage() {
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Truck | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    customer_address: '',
    start_date: '',
    end_date: '',
    notes: '',
  });

  useEffect(() => {
    supabase
      .from('trucks')
      .select('*')
      .eq('is_available', true)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setTrucks(data ?? []);
        setLoading(false);
      });
  }, []);

  const daysBetween = (start: string, end: string) => {
    const s = new Date(start);
    const e = new Date(end);
    return Math.max(1, Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1);
  };

  const totalCost = selected && form.start_date && form.end_date
    ? selected.daily_rate * daysBetween(form.start_date, form.end_date)
    : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    setSubmitting(true);
    const { error } = await supabase.from('reservations').insert({
      truck_id: selected.id,
      customer_name: form.customer_name,
      customer_email: form.customer_email,
      customer_phone: form.customer_phone,
      customer_address: form.customer_address,
      start_date: form.start_date,
      end_date: form.end_date,
      notes: form.notes,
      total_cost: totalCost,
      status: 'pending',
    });
    setSubmitting(false);
    if (!error) {
      setSuccess(true);
      setForm({
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        customer_address: '',
        start_date: '',
        end_date: '',
        notes: '',
      });
      setTimeout(() => {
        setSuccess(false);
        setSelected(null);
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-brand-800 to-brand-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Location de camions</h1>
          <p className="text-brand-100">Des véhicules pour tous vos besoins de transport</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-3 border-brand-200 border-t-brand-700 rounded-full animate-spin" />
          </div>
        ) : trucks.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <TruckIcon className="w-12 h-12 mx-auto mb-3" />
            <p className="text-lg">Aucun camion disponible</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trucks.map((truck) => (
              <div key={truck.id} className="card group flex flex-col">
                <ProductImage
                  src={truck.image_url}
                  alt={truck.name}
                  className="w-full h-52 object-cover"
                />
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-bold text-xl text-gray-900 mb-1">{truck.name}</h3>
                  <p className="text-gray-600 text-sm mb-4 flex-1">{truck.description}</p>
                  <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                    {truck.capacity && (
                      <div className="bg-gray-50 rounded-lg px-3 py-2">
                        <span className="block text-xs text-gray-400">Capacité</span>
                        <span className="font-semibold text-gray-700">{truck.capacity}</span>
                      </div>
                    )}
                    {truck.plate_number && (
                      <div className="bg-gray-50 rounded-lg px-3 py-2">
                        <span className="block text-xs text-gray-400">Immat.</span>
                        <span className="font-semibold text-gray-700">{truck.plate_number}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                      <span className="text-2xl font-bold text-brand-700">
                        {truck.daily_rate.toLocaleString('fr-FR')} FCFA
                      </span>
                      <span className="text-sm text-gray-400"> / jour</span>
                    </div>
                    <button
                      onClick={() => setSelected(truck)}
                      className="btn-primary !px-4 !py-2.5 !text-sm"
                    >
                      Réserver
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected ? `Réserver — ${selected.name}` : ''}
        size="lg"
      >
        {success ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Demande envoyée !</h3>
            <p className="text-gray-500">Nous vous contacterons bientôt pour confirmer votre réservation.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    required
                    type="text"
                    value={form.customer_name}
                    onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
                    className="input-field pl-10"
                    placeholder="Jean Dupont"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    required
                    type="email"
                    value={form.customer_email}
                    onChange={(e) => setForm({ ...form, customer_email: e.target.value })}
                    className="input-field pl-10"
                    placeholder="jean@email.fr"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={form.customer_phone}
                    onChange={(e) => setForm({ ...form, customer_phone: e.target.value })}
                    className="input-field pl-10"
                    placeholder="06 12 34 56 78"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={form.customer_address}
                    onChange={(e) => setForm({ ...form, customer_address: e.target.value })}
                    className="input-field pl-10"
                    placeholder="123 Rue..."
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date de début *</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    required
                    type="date"
                    value={form.start_date}
                    onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                    className="input-field pl-10"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date de fin *</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    required
                    type="date"
                    value={form.end_date}
                    min={form.start_date}
                    onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                    className="input-field pl-10"
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes / Précisions</label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="input-field min-h-[80px]"
                placeholder="Précisez votre besoin..."
              />
            </div>
            {totalCost > 0 && (
              <div className="bg-brand-50 rounded-xl p-4 flex items-center justify-between">
                <span className="text-gray-600">
                  Coût estimé ({daysBetween(form.start_date, form.end_date)} jour(s))
                </span>
                <span className="text-2xl font-bold text-brand-700">
                  {totalCost.toLocaleString('fr-FR')} FCFA
                </span>
              </div>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full disabled:opacity-50"
            >
              {submitting ? 'Envoi en cours...' : 'Envoyer la demande'}
            </button>
          </form>
        )}
      </Modal>
    </div>
  );
}
