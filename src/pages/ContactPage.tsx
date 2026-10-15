import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, Check } from 'lucide-react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: '', email: '', message: '' });
    setTimeout(() => setSent(false), 5000);
  };

  const contactInfo = [
    { icon: MapPin, label: 'Adresse', value: 'Thiès, Sénégal' },
    { icon: Phone, label: 'Téléphone', value: '77 000 00 00' },
    { icon: Mail, label: 'Email', value: 'contact@fall-frere.fr' },
    { icon: Clock, label: 'Horaires', value: 'Lundi - Samedi : 8h00 - 18h00' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-brand-800 to-brand-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Contactez-nous</h1>
          <p className="text-brand-100">Une question ? Notre équipe est à votre écoute</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Nos coordonnées</h2>
            {contactInfo.map((info) => (
              <div key={info.label} className="card p-5 flex items-center gap-4">
                <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <info.icon className="w-6 h-6 text-brand-700" />
                </div>
                <div>
                  <div className="text-sm text-gray-400">{info.label}</div>
                  <div className="font-semibold text-gray-900">{info.value}</div>
                </div>
              </div>
            ))}
            <div className="card p-5 bg-brand-50 border-brand-100">
              <h3 className="font-bold text-brand-900 mb-2">Zone d'intervention</h3>
              <p className="text-brand-800 text-sm">
                Thiès et ses environs.
              </p>
            </div>
          </div>

          <div className="card p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Envoyez-nous un message</h2>
            {sent ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-lg font-semibold text-gray-900">Message envoyé !</p>
                <p className="text-gray-500 mt-1">Nous vous répondrons bientôt.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Nom *</label>
                  <input
                    required
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="input-field"
                    placeholder="Votre nom"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="input-field"
                    placeholder="votre@email.fr"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Message *</label>
                  <textarea
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="input-field min-h-[140px]"
                    placeholder="Votre message..."
                  />
                </div>
                <button type="submit" className="btn-primary w-full">
                  Envoyer <Send className="w-5 h-5" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
