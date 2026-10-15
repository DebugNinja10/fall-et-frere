import { Link, NavLink, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import type { ReactNode } from 'react';
import {
  LayoutDashboard,
  Package,
  Hammer,
  Truck,
  ShoppingCart,
  FileText,
  Calendar,
  LogOut,
  Wrench,
  Menu,
  X,
  Star,
  Images,
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { to: '/admin/dashboard', label: 'Tableau de bord', icon: LayoutDashboard, end: true },
  { to: '/admin/produits', label: 'Produits', icon: Package },
  { to: '/admin/services', label: 'Prestations', icon: Hammer },
  { to: '/admin/camions', label: 'Camions', icon: Truck },
  { to: '/admin/commandes', label: 'Commandes', icon: ShoppingCart },
  { to: '/admin/devis', label: 'Devis', icon: FileText },
  { to: '/admin/reservations', label: 'Réservations', icon: Calendar },
  { to: '/admin/realisations', label: 'Réalisations', icon: Images },
  { to: '/admin/avis', label: 'Avis clients', icon: Star },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { session, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="w-8 h-8 border-3 border-brand-200 border-t-brand-700 rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/admin" replace />;
  }

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-gray-900 text-white flex flex-col transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-5 flex items-center gap-2 border-b border-gray-800">
          <div className="w-10 h-10 bg-brand-700 rounded-lg flex items-center justify-center">
            <Wrench className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="font-bold text-white">FALL & frere</span>
            <span className="block text-xs text-gray-400 -mt-0.5">Administration</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden ml-auto p-1 rounded hover:bg-gray-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-700 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-gray-800 space-y-1">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors text-sm"
          >
            <LayoutDashboard className="w-5 h-5" /> Voir le site
          </Link>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-950/30 transition-colors text-sm w-full"
          >
            <LogOut className="w-5 h-5" /> Déconnexion
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-3 flex items-center justify-between sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
          <div className="text-sm text-gray-500 hidden lg:block">
            Connecté en tant que <span className="font-semibold text-gray-700">{session.user.email}</span>
          </div>
        </header>
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
