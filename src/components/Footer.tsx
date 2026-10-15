import { Link } from 'react-router-dom';
import { Wrench, Phone, Mail, MapPin, Clock, Facebook, Linkedin, Send, Check } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [subscribing, setSubscribing] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribing(true);
    const { error } = await supabase.from('newsletter').insert({ email });
    setSubscribing(false);
    if (!error) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-brand-700 rounded-lg flex items-center justify-center">
              <Wrench className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">FALL & frere</span>
          </div>
          <p className="text-sm leading-relaxed text-gray-400">
            Votre spécialiste en quincaillerie, menuiserie, maçonnerie et location de camions.
            Des solutions complètes pour tous vos projets de construction et rénovation.
          </p>
          <div className="flex gap-3 mt-4">
            <a href="#" className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-brand-700 transition-colors">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-brand-700 transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4">Navigation</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-brand-400 transition-colors">Accueil</Link></li>
            <li><Link to="/produits" className="hover:text-brand-400 transition-colors">Produits</Link></li>
            <li><Link to="/services" className="hover:text-brand-400 transition-colors">Prestations</Link></li>
            <li><Link to="/camions" className="hover:text-brand-400 transition-colors">Location Camions</Link></li>
            <li><Link to="/realisations" className="hover:text-brand-400 transition-colors">Réalisations</Link></li>
            <li><Link to="/devis" className="hover:text-brand-400 transition-colors">Demander un devis</Link></li>
            <li><Link to="/avis" className="hover:text-brand-400 transition-colors">Laisser un avis</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4">Contact</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-brand-400 flex-shrink-0 mt-0.5" />
              <span>Thiès, Sénégal</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-brand-400 flex-shrink-0" />
              <span>77 000 00 00</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-brand-400 flex-shrink-0" />
              <span>contact@fall-frere.fr</span>
            </li>
            <li className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-brand-400 flex-shrink-0" />
              <span>Lun-Sam: 8h00 - 18h00</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4">Newsletter</h3>
          <p className="text-sm text-gray-400 mb-3">Recevez nos offres et nouveautés</p>
          {subscribed ? (
            <div className="flex items-center gap-2 text-green-400 text-sm bg-green-900/20 px-3 py-2.5 rounded-lg">
              <Check className="w-4 h-4" /> Inscription confirmée !
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="space-y-2">
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Votre email"
                className="w-full px-3 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm placeholder:text-gray-500 focus:border-brand-500 focus:ring-2 focus:ring-brand-800 outline-none transition-all"
              />
              <button
                type="submit"
                disabled={subscribing}
                className="w-full bg-brand-700 hover:bg-brand-600 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {subscribing ? '...' : <>S'inscrire <Send className="w-4 h-4" /></>}
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="border-t border-gray-800 py-4">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} FALL & frere. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
