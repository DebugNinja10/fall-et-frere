import { useEffect, useState } from 'react';
import { supabase, type Product } from '@/lib/supabase';
import { useCart } from '@/context/CartContext';
import ProductImage from '@/components/ProductImage';
import { ShoppingCart, Search, Package } from 'lucide-react';

const categories = ['Tous', 'quincaillerie', 'menuiserie', 'maconnerie'];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('Tous');
  const [search, setSearch] = useState('');
  const { addItem } = useCart();
  const [added, setAdded] = useState<string | null>(null);

  useEffect(() => {
    let query = supabase.from('products').select('*').eq('is_active', true);
    if (category !== 'Tous') query = query.eq('category', category);
    if (search) query = query.ilike('name', `%${search}%`);
    query.order('created_at', { ascending: false }).then(({ data }) => {
      setProducts(data ?? []);
      setLoading(false);
    });
  }, [category, search]);

  const handleAdd = (product: Product) => {
    addItem(product);
    setAdded(product.id);
    setTimeout(() => setAdded(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-brand-800 to-brand-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Nos produits</h1>
          <p className="text-brand-100">Tout le matériel de construction et de quincaillerie</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
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
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-3 border-brand-200 border-t-brand-700 rounded-full animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Package className="w-12 h-12 mx-auto mb-3" />
            <p className="text-lg">Aucun produit trouvé</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="card group">
                <ProductImage
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-5">
                  <span className="text-xs font-medium text-brand-600 bg-brand-50 px-2 py-1 rounded capitalize">
                    {product.category}
                  </span>
                  <h3 className="font-bold text-gray-900 mt-2 mb-1">{product.name}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-3 min-h-[2.5rem]">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="text-lg font-bold text-brand-700">
                        {product.price.toLocaleString('fr-FR')} FCFA
                      </span>
                      <span className="text-sm text-gray-400"> / {product.unit}</span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      product.stock > 0
                        ? 'text-green-600 bg-green-50'
                        : 'text-red-500 bg-red-50'
                    }`}>
                      {product.stock > 0 ? `${product.stock} en stock` : 'Rupture'}
                    </span>
                  </div>
                  <button
                    onClick={() => handleAdd(product)}
                    disabled={product.stock <= 0}
                    className={`w-full py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${
                      added === product.id
                        ? 'bg-green-500 text-white'
                        : product.stock <= 0
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-brand-700 text-white hover:bg-brand-800'
                    }`}
                  >
                    {added === product.id ? (
                      'Ajouté !'
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4" />
                        Ajouter au panier
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
