import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AdminLayout from '@/components/AdminLayout';
import Home from '@/pages/Home';
import ProductsPage from '@/pages/ProductsPage';
import ServicesPage from '@/pages/ServicesPage';
import TrucksPage from '@/pages/TrucksPage';
import QuotePage from '@/pages/QuotePage';
import ContactPage from '@/pages/ContactPage';
import CartPage from '@/pages/CartPage';
import ProjectsPage from '@/pages/ProjectsPage';
import TestimonialPage from '@/pages/TestimonialPage';
import AdminLogin from '@/pages/admin/AdminLogin';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminProducts from '@/pages/admin/AdminProducts';
import AdminServices from '@/pages/admin/AdminServices';
import AdminTrucks from '@/pages/admin/AdminTrucks';
import AdminOrders from '@/pages/admin/AdminOrders';
import AdminQuotes from '@/pages/admin/AdminQuotes';
import AdminReservations from '@/pages/admin/AdminReservations';
import AdminProjects from '@/pages/admin/AdminProjects';
import AdminTestimonials from '@/pages/admin/AdminTestimonials';

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}

function AppRoutes() {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/admin');

  if (isAdmin) {
    return (
      <Routes>
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
        <Route path="/admin/produits" element={<AdminLayout><AdminProducts /></AdminLayout>} />
        <Route path="/admin/services" element={<AdminLayout><AdminServices /></AdminLayout>} />
        <Route path="/admin/camions" element={<AdminLayout><AdminTrucks /></AdminLayout>} />
        <Route path="/admin/commandes" element={<AdminLayout><AdminOrders /></AdminLayout>} />
        <Route path="/admin/devis" element={<AdminLayout><AdminQuotes /></AdminLayout>} />
        <Route path="/admin/reservations" element={<AdminLayout><AdminReservations /></AdminLayout>} />
        <Route path="/admin/realisations" element={<AdminLayout><AdminProjects /></AdminLayout>} />
        <Route path="/admin/avis" element={<AdminLayout><AdminTestimonials /></AdminLayout>} />
      </Routes>
    );
  }

  return (
    <PublicLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/produits" element={<ProductsPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/camions" element={<TrucksPage />} />
        <Route path="/devis" element={<QuotePage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/panier" element={<CartPage />} />
        <Route path="/realisations" element={<ProjectsPage />} />
        <Route path="/avis" element={<TestimonialPage />} />
      </Routes>
    </PublicLayout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}
