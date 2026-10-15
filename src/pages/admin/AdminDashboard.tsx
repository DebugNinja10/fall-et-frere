import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import {
  Package, Hammer, Truck, ShoppingCart, FileText, Calendar,
  TrendingUp, Clock, CheckCircle, AlertCircle, Images, Star,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    products: 0,
    services: 0,
    trucks: 0,
    orders: 0,
    pendingOrders: 0,
    quotes: 0,
    pendingQuotes: 0,
    reservations: 0,
    pendingReservations: 0,
    projects: 0,
    pendingTestimonials: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    Promise.all([
      supabase.from('products').select('id', { count: 'exact', head: true }),
      supabase.from('services').select('id', { count: 'exact', head: true }),
      supabase.from('trucks').select('id', { count: 'exact', head: true }),
      supabase.from('orders').select('id, status, total'),
      supabase.from('quotes').select('id, status'),
      supabase.from('reservations').select('id, status, total_cost'),
      supabase.from('projects').select('id', { count: 'exact', head: true }),
      supabase.from('testimonials').select('id, is_approved'),
    ]).then(([p, s, t, o, q, r, proj, test]) => {
      const orders = o.data ?? [];
      const quotes = q.data ?? [];
      const reservations = r.data ?? [];
      const testimonials = test.data ?? [];
      setStats({
        products: p.count ?? 0,
        services: s.count ?? 0,
        trucks: t.count ?? 0,
        orders: orders.length,
        pendingOrders: orders.filter((o) => o.status === 'pending').length,
        quotes: quotes.length,
        pendingQuotes: quotes.filter((q) => q.status === 'pending').length,
        reservations: reservations.length,
        pendingReservations: reservations.filter((r) => r.status === 'pending').length,
        projects: proj.count ?? 0,
        pendingTestimonials: testimonials.filter((t) => !t.is_approved).length,
        totalRevenue: orders
          .filter((o) => o.status === 'completed')
          .reduce((sum, o) => sum + Number(o.total), 0),
      });
    });
  }, []);

  const cards = [
    { label: 'Produits', value: stats.products, icon: Package, link: '/admin/produits', color: 'brand' },
    { label: 'Prestations', value: stats.services, icon: Hammer, link: '/admin/services', color: 'amber' },
    { label: 'Camions', value: stats.trucks, icon: Truck, link: '/admin/camions', color: 'brand' },
    { label: 'Commandes', value: stats.orders, icon: ShoppingCart, link: '/admin/commandes', color: 'amber' },
    { label: 'Devis', value: stats.quotes, icon: FileText, link: '/admin/devis', color: 'brand' },
    { label: 'Réservations', value: stats.reservations, icon: Calendar, link: '/admin/reservations', color: 'amber' },
    { label: 'Réalisations', value: stats.projects, icon: Images, link: '/admin/realisations', color: 'brand' },
    { label: 'Avis clients', value: stats.pendingTestimonials, icon: Star, link: '/admin/avis', color: 'amber' },
  ];

  const colorMap: Record<string, string> = {
    brand: 'bg-brand-50 text-brand-700',
    amber: 'bg-amber-50 text-amber-600',
  };

  const pendingItems = [
    { label: 'Commandes en attente', value: stats.pendingOrders, link: '/admin/commandes', icon: ShoppingCart },
    { label: 'Devis en attente', value: stats.pendingQuotes, link: '/admin/devis', icon: FileText },
    { label: 'Réservations en attente', value: stats.pendingReservations, link: '/admin/reservations', icon: Calendar },
    { label: 'Avis à modérer', value: stats.pendingTestimonials, link: '/admin/avis', icon: Star },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-gray-500 mt-1">Vue d'ensemble de votre activité</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            to={card.link}
            className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${colorMap[card.color]}`}>
              <card.icon className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{card.value}</div>
            <div className="text-sm text-gray-500">{card.label}</div>
          </Link>
        ))}
      </div>

      {/* Pending items + revenue */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-500" /> Éléments en attente
          </h2>
          <div className="space-y-3">
            {pendingItems.map((item) => (
              <Link
                key={item.label}
                to={item.link}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span className="flex items-center gap-3 text-gray-700">
                  <item.icon className="w-5 h-5 text-gray-400" />
                  {item.label}
                </span>
                <span className={`font-bold ${item.value > 0 ? 'text-amber-600' : 'text-gray-400'}`}>
                  {item.value}
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-brand-700 to-brand-900 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-amber-400" />
            <h2 className="font-bold">Revenus (commandes terminées)</h2>
          </div>
          <div className="text-4xl font-bold mb-2">{stats.totalRevenue.toLocaleString('fr-FR')} FCFA</div>
          <div className="flex items-center gap-4 mt-6">
            <div className="flex items-center gap-2 text-sm text-brand-200">
              <CheckCircle className="w-4 h-4 text-green-400" />
              {stats.orders - stats.pendingOrders} traitées
            </div>
            <div className="flex items-center gap-2 text-sm text-brand-200">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              {stats.pendingOrders} en attente
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
