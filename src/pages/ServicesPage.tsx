import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase, type Service } from '@/lib/supabase';
import ProductImage from '@/components/ProductImage';
import { Clock, ArrowRight, Hammer } from 'lucide-react';

const categories = ['Tous', 'menuiserie', 'maconnerie'];

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('Tous');

  useEffect(() => {
    let query = supabase.from('services').select('*').eq('is_active', true);
    if (category !== 'Tous') query = query.eq('category', category);
    query.order('created_at', { ascending: false }).then(({ data }) => {
      setServices(data ?? []);
      setLoading(false);
    });
  }, [category]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-brand-800 to-brand-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Nos prestations</h1>
          <p className="text-brand-100">Menuiserie et maçonnerie — un savoir-faire d'expert</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-2 mb-8 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2.5 rounded-lg font-medium transition-all capitalize ${
                category === cat
                  ? 'bg-brand-700 text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-brand-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-3 border-brand-200 border-t-brand-700 rounded-full animate-spin" />
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Hammer className="w-12 h-12 mx-auto mb-3" />
            <p className="text-lg">Aucune prestation trouvée</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {services.map((service) => (
              <div key={service.id} className="card group flex flex-col">
                <ProductImage
                  src={service.image_url}
                  alt={service.name}
                  className="w-full h-56 object-cover"
                />
                <div className="p-6 flex flex-col flex-1">
                  <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded capitalize self-start">
                    {service.category}
                  </span>
                  <h3 className="font-bold text-xl text-gray-900 mt-3 mb-2">{service.name}</h3>
                  <p className="text-gray-600 mb-4 flex-1">{service.description}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                      <span className="text-2xl font-bold text-brand-700">
                        {service.price.toLocaleString('fr-FR')} FCFA
                      </span>
                      <span className="text-sm text-gray-400"> à partir de</span>
                    </div>
                    {service.duration && (
                      <span className="text-sm text-gray-500 flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg">
                        <Clock className="w-4 h-4" /> {service.duration}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 bg-brand-50 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Besoin d'un service sur mesure ?</h2>
          <p className="text-gray-600 mb-5">Demandez un devis personnalisé pour votre projet</p>
          <Link to="/devis" className="btn-primary inline-flex">
            Demander un devis <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
