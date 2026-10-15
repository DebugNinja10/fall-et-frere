import { Link, NavLink } from 'react-router-dom';
import { ShoppingCart, Menu, X, Wrench, Phone } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';

const navLinks = [
  { to: '/', label: 'Accueil' },
  { to: '/produits', label: 'Produits' },
  { to: '/services', label: 'Prestations' },
  { to: '/camions', label: 'Location Camions' },
  { to: '/realisations', label: 'Réalisations' },
  { to: '/devis', label: 'Devis' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { count } = useCart();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="bg-brand-800 text-white text-sm py-2">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">contact@fall-frere.fr</span>
            <span>·</span>
            <span>77 000 00 00</span>
          </span>
          <Link to="/admin" className="hover:text-amber-300 transition-colors">
            Espace Admin
          </Link>
        </div>
      </div>

      <nav className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-brand-700 rounded-lg flex items-center justify-center">
            <Wrench className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-xl font-bold text-gray-900">FALL & frere</span>
            <span className="block text-xs text-gray-500 -mt-1">Quincaillerie · Menuiserie · Maçonnerie</span>
          </div>
        </Link>

        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg font-medium transition-colors ${
                  isActive
                    ? 'text-brand-700 bg-brand-50'
                    : 'text-gray-600 hover:text-brand-700 hover:bg-gray-50'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/panier"
            className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Panier"
          >
            <ShoppingCart className="w-6 h-6 text-gray-700" />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>

          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="lg:hidden border-t border-gray-100 bg-white animate-fade-in">
          <div className="px-4 py-3 flex flex-col gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-3 rounded-lg font-medium transition-colors ${
                    isActive ? 'text-brand-700 bg-brand-50' : 'text-gray-600 hover:bg-gray-50'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
