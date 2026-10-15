import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Send, Check, User, Mail, Phone, MapPin, FileText, Euro } from 'lucide-react';

export default function QuotePage() {
  const [form, setForm] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    customer_address: '',
    service_type: '',
    project_description: '',
    budget: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const serviceTypes = ['Menuiserie', 'Maçonnerie', 'Quincaillerie', 'Location de camions', 'Autre'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await supabase.from('quotes').insert({
      customer_name: form.customer_name,
      customer_email: form.customer_email,
      customer_phone: form.customer_phone,
      customer_address: form.customer_address,
      service_type: form.service_type,
      project_description: form.project_description,
      budget: form.budget ? parseFloat(form.budget) : null,
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
        service_type: '',
        project_description: '',
        budget: '',
      });
      setTimeout(() => setSuccess(false), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-brand-800 to-brand-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Demander un devis</h1>
          <p className="text-brand-100">Décrivez votre projet, nous vous répondons sous 24h</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12">
        {success ? (
          <div className="card p-10 text-center animate-fade-in">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Demande envoyée !</h2>
            <p className="text-gray-500 mb-6">
              Merci pour votre demande. Notre équipe vous contactera dans les plus brefs délais avec un devis détaillé.
            </p>
            <button onClick={() => setSuccess(false)} className="btn-secondary">
              Faire une nouvelle demande
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="card p-8 space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nom complet *</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Téléphone</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Adresse</label>
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
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Type de prestation</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Description du projet *</label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <textarea
                  required
                  value={form.project_description}
                  onChange={(e) => setForm({ ...form, project_description: e.target.value })}
                  className="input-field pl-10 min-h-[120px]"
                  placeholder="Décrivez votre projet en détail : dimensions, matériaux souhaités, délais..."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Budget estimé (optionnel)</label>
              <div className="relative">
                <Euro className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  step="0.01"
                  value={form.budget}
                  onChange={(e) => setForm({ ...form, budget: e.target.value })}
                  className="input-field pl-10"
                  placeholder="5000"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full disabled:opacity-50"
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Envoi en cours...
                </span>
              ) : (
                <>
                  Envoyer la demande <Send className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
