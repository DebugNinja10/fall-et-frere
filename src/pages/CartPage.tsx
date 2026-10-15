import { Link } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { supabase } from '@/lib/supabase';
import { Trash2, Minus, Plus, ShoppingBag, ArrowLeft, Check, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import ProductImage from '@/components/ProductImage';

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, total } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    customer_address: '',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { data: order } = await supabase
      .from('orders')
      .insert({
        customer_name: form.customer_name,
        customer_email: form.customer_email,
        customer_phone: form.customer_phone,
        customer_address: form.customer_address,
        notes: form.notes,
        total: total,
        status: 'pending',
      })
      .select()
      .single();

    if (order) {
      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.product.id,
        product_name: item.product.name,
        quantity: item.quantity,
        unit_price: item.product.price,
      }));
      await supabase.from('order_items').insert(orderItems);
      clearCart();
      setSuccess(true);
    }
    setSubmitting(false);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="card p-10 text-center max-w-md animate-fade-in">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Commande envoyée !</h1>
          <p className="text-gray-500 mb-6">
            Merci pour votre commande. Nous vous contacterons bientôt pour confirmer la livraison.
          </p>
          <Link to="/produits" className="btn-primary inline-flex">
            Continuer mes achats
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Votre panier est vide</h1>
          <p className="text-gray-500 mb-6">Parcourez notre catalogue pour trouver ce dont vous avez besoin</p>
          <Link to="/produits" className="btn-primary inline-flex">
            Voir les produits
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <ShoppingCart className="w-8 h-8 text-brand-700" />
            Mon panier
          </h1>
          <Link to="/produits" className="text-brand-700 flex items-center gap-1 hover:gap-2 transition-all font-medium">
            <ArrowLeft className="w-5 h-5" /> Continuer mes achats
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.product.id} className="card p-4 flex gap-4 items-center">
                <ProductImage
                  src={item.product.image_url}
                  alt={item.product.name}
                  className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 truncate">{item.product.name}</h3>
                  <p className="text-sm text-gray-400">{item.product.price.toLocaleString('fr-FR')} FCFA / {item.product.unit}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center border border-gray-200 rounded-lg">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="p-1.5 hover:bg-gray-50 rounded-l-lg"
                      >
                        <Minus className="w-4 h-4 text-gray-600" />
                      </button>
                      <span className="px-4 font-semibold text-gray-900">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="p-1.5 hover:bg-gray-50 rounded-r-lg"
                      >
                        <Plus className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-brand-700">
                    {(item.product.price * item.quantity).toLocaleString('fr-FR')} FCFA
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h2 className="font-bold text-lg text-gray-900 mb-4">Récapitulatif</h2>
              <div className="space-y-2 text-sm mb-4">
                {items.map((item) => (
                  <div key={item.product.id} className="flex justify-between text-gray-600">
                    <span className="truncate mr-2">{item.product.name} × {item.quantity}</span>
                    <span className="font-medium">{(item.product.price * item.quantity).toLocaleString('fr-FR')} FCFA</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 pt-4 flex justify-between items-center mb-6">
                <span className="font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-brand-700">{total.toLocaleString('fr-FR')} FCFA</span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <h3 className="font-semibold text-gray-900 text-sm">Vos informations</h3>
                <input
                  required
                  type="text"
                  placeholder="Nom complet *"
                  value={form.customer_name}
                  onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
                  className="input-field text-sm"
                />
                <input
                  required
                  type="email"
                  placeholder="Email *"
                  value={form.customer_email}
                  onChange={(e) => setForm({ ...form, customer_email: e.target.value })}
                  className="input-field text-sm"
                />
                <input
                  type="tel"
                  placeholder="Téléphone"
                  value={form.customer_phone}
                  onChange={(e) => setForm({ ...form, customer_phone: e.target.value })}
                  className="input-field text-sm"
                />
                <input
                  type="text"
                  placeholder="Adresse de livraison"
                  value={form.customer_address}
                  onChange={(e) => setForm({ ...form, customer_address: e.target.value })}
                  className="input-field text-sm"
                />
                <textarea
                  placeholder="Notes (optionnel)"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="input-field text-sm min-h-[60px]"
                />
                <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-50">
                  {submitting ? 'Envoi...' : 'Commander'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
