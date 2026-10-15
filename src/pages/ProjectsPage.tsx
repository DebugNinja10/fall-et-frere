import { useEffect, useState } from 'react';
import { supabase, type Project } from '@/lib/supabase';
import ProductImage from '@/components/ProductImage';
import { MapPin, User, Calendar, Hammer, Star } from 'lucide-react';

const categories = ['Tous', 'menuiserie', 'maconnerie', 'quincaillerie'];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('Tous');
  const [selected, setSelected] = useState<Project | null>(null);

  useEffect(() => {
    let query = supabase.from('projects').select('*').eq('is_active', true).order('created_at', { ascending: false });
    if (category !== 'Tous') query = query.eq('category', category);
    query.then(({ data }) => {
      setProjects(data ?? []);
      setLoading(false);
    });
  }, [category]);

  const featured = projects.filter((p) => p.is_featured);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-brand-800 to-brand-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Nos réalisations</h1>
          <p className="text-brand-100">Découvrez les projets que nous avons menés à bien</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {featured.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Star className="w-6 h-6 text-amber-500" /> Projets en vedette
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((p) => (
                <div key={p.id} className="card group cursor-pointer" onClick={() => setSelected(p)}>
                  <ProductImage src={p.image_url} alt={p.title} className="w-full h-56 object-cover" />
                  <div className="p-5">
                    <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded capitalize">{p.category}</span>
                    <h3 className="font-bold text-lg text-gray-900 mt-2 mb-1 group-hover:text-brand-700 transition-colors">{p.title}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2">{p.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2 mb-6 flex-wrap">
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
        ) : projects.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Hammer className="w-12 h-12 mx-auto mb-3" />
            <p className="text-lg">Aucun projet dans cette catégorie</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((p) => (
              <div key={p.id} className="card group cursor-pointer" onClick={() => setSelected(p)}>
                <ProductImage src={p.image_url} alt={p.title} className="w-full h-48 object-cover" />
                <div className="p-5">
                  <span className="text-xs font-medium text-brand-600 bg-brand-50 px-2 py-1 rounded capitalize">{p.category}</span>
                  <h3 className="font-bold text-gray-900 mt-2 mb-1 group-hover:text-brand-700 transition-colors">{p.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-3">{p.description}</p>
                  {p.location && (
                    <span className="text-sm text-gray-400 flex items-center gap-1">
                      <MapPin className="w-4 h-4" /> {p.location}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <ProductImage src={selected.image_url} alt={selected.title} className="w-full h-64 object-cover rounded-t-2xl" />
            <div className="p-6">
              <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded capitalize">{selected.category}</span>
              <h2 className="text-2xl font-bold text-gray-900 mt-3 mb-3">{selected.title}</h2>
              <p className="text-gray-600 mb-5">{selected.description}</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {selected.client_name && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <User className="w-4 h-4 text-gray-400" /> {selected.client_name}
                  </div>
                )}
                {selected.location && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <MapPin className="w-4 h-4 text-gray-400" /> {selected.location}
                  </div>
                )}
                {selected.completed_date && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <Calendar className="w-4 h-4 text-gray-400" /> {new Date(selected.completed_date).toLocaleDateString('fr-FR')}
                  </div>
                )}
              </div>
              <button onClick={() => setSelected(null)} className="btn-secondary mt-6 w-full">Fermer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
