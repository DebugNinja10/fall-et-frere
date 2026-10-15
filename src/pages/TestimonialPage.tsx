import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Star, Send, Check } from 'lucide-react';

export default function TestimonialPage() {
  const [form, setForm] = useState({
    customer_name: '',
    rating: 5,
    comment: '',
    service_type: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [hover, setHover] = useState(0);

  const serviceTypes = ['Quincaillerie', 'Menuiserie', 'Maçonnerie', 'Location de camions', 'Autre'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await supabase.from('testimonials').insert({
      customer_name: form.customer_name,
      rating: form.rating,
      comment: form.comment,
      service_type: form.service_type || null,
      is_approved: false,
    });
    setSubmitting(false);
    if (!error) {
      setSuccess(true);
      setForm({ customer_name: '', rating: 5, comment: '', service_type: '' });
      setTimeout(() => setSuccess(false), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-brand-800 to-brand-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Partagez votre avis</h1>
          <p className="text-brand-100">Votre retour d'expérience nous aide à nous améliorer</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-12">
        {success ? (
          <div className="card p-10 text-center animate-fade-in">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Merci pour votre avis !</h2>
            <p className="text-gray-500 mb-6">
              Votre témoignage a été envoyé. Il sera visible sur notre site après validation par notre équipe.
            </p>
            <button onClick={() => setSuccess(false)} className="btn-secondary">
              Laisser un autre avis
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="card p-8 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Votre nom *</label>
              <input
                required
                type="text"
                value={form.customer_name}
                onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
                className="input-field"
                placeholder="Jean Dupont"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Votre note *</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onMouseEnter={() => setHover(n)}
                    onMouseLeave={() => setHover(0)}
                    onClick={() => setForm({ ...form, rating: n })}
                    className="p-1"
                  >
                    <Star
                      className={`w-8 h-8 transition-colors ${
                        n <= (hover || form.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Type de service</label>
              <select
                value={form.service_type}
                onChange={(e) => setForm({ ...form, service_type: e.target.value })}
                className="input-field"
              >
                <option value="">Sélectionner...</option>
                {serviceTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Votre commentaire *</label>
              <textarea
                required
                value={form.comment}
                onChange={(e) => setForm({ ...form, comment: e.target.value })}
                className="input-field min-h-[120px]"
                placeholder="Décrivez votre expérience avec FALL & frere..."
              />
            </div>

            <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-50">
              {submitting ? 'Envoi...' : <>Envoyer mon avis <Send className="w-5 h-5" /></>}
            </button>
            <p className="text-xs text-gray-400 text-center">
              Votre avis sera visible après validation par notre équipe.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
