import { Link } from 'react-router-dom';
import { Wrench, Hammer, Truck, ArrowRight, Shield, Clock, Award, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase, type Product, type Service } from '@/lib/supabase';
import ProductImage from '@/components/ProductImage';
import TestimonialsSection from '@/components/TestimonialsSection';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [featuredServices, setFeaturedServices] = useState<Service[]>([]);

  useEffect(() => {
    supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(4)
      .then(({ data }) => setFeaturedProducts(data ?? []));
    supabase
      .from('services')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(3)
      .then(({ data }) => setFeaturedServices(data ?? []));
  }, []);

  const services = [
    {
      icon: Wrench,
      title: 'Quincaillerie',
      description: 'Outillage, serrures, chevilles, quincaillerie de porte et tout le matériel de construction.',
      link: '/produits',
    },
    {
      icon: Hammer,
      title: 'Menuiserie & Maçonnerie',
      description: 'Fabrication sur mesure, pose de fenêtres, gros œuvre, dallage et rénovation de façade.',
      link: '/services',
    },
    {
      icon: Truck,
      title: 'Location de Camions',
      description: 'Camions plateaux, bennes, fourgons et camions-grues de 3.5T à 19T pour tous vos besoins.',
      link: '/camions',
    },
  ];

  const stats = [
    { icon: Users, label: 'Clients satisfaits', value: '500+' },
    { icon: Award, label: "Années d'expérience", value: '15' },
    { icon: Truck, label: 'Camions disponibles', value: '8' },
    { icon: Shield, label: 'Garantie qualité', value: '100%' },
  ];

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-amber-400 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-brand-400 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-28">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <span className="inline-block bg-amber-500/20 text-amber-300 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
                Votre partenaire BTP depuis 2010
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Construire ensemble, <br />
                <span className="text-amber-400">avec les meilleurs matériaux</span>
              </h1>
              <p className="text-lg text-brand-100 mb-8 max-w-lg">
                Quincaillerie, menuiserie, maçonnerie et location de camions.
                Tout pour vos projets de construction et de rénovation en un seul endroit.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/produits" className="btn-accent">
                  Voir nos produits
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/devis" className="btn-secondary !bg-white/10 !border-white/30 !text-white hover:!bg-white/20">
                  Demander un devis
                </Link>
              </div>
            </div>
            <div className="hidden md:grid grid-cols-2 gap-4">
              {stats.map((stat, i) => (
                <div
                  key={stat.label}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <stat.icon className="w-8 h-8 text-amber-400 mb-3" />
                  <div className="text-3xl font-bold">{stat.value}</div>
                  <div className="text-sm text-brand-200">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services overview */}
      <section className="py-20 max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="section-title">Nos domaines d'expertise</h2>
          <p className="section-subtitle">Une gamme complète de services pour tous vos projets</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {services.map((service) => (
            <Link
              key={service.title}
              to={service.link}
              className="card p-8 group hover:-translate-y-1"
            >
              <div className="w-14 h-14 bg-brand-50 rounded-xl flex items-center justify-center mb-5 group-hover:bg-brand-700 transition-colors duration-300">
                <service.icon className="w-7 h-7 text-brand-700 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <span className="text-brand-700 font-semibold inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                En savoir plus <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
            <div>
              <h2 className="section-title">Produits en vedette</h2>
              <p className="section-subtitle">Une sélection de nos meilleurs produits</p>
            </div>
            <Link to="/produits" className="text-brand-700 font-semibold inline-flex items-center gap-1 hover:gap-2 transition-all">
              Voir tous les produits <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Link key={product.id} to="/produits" className="card group">
                <ProductImage
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-5">
                  <span className="text-xs font-medium text-brand-600 bg-brand-50 px-2 py-1 rounded">
                    {product.category}
                  </span>
                  <h3 className="font-bold text-gray-900 mt-2 mb-1 group-hover:text-brand-700 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-3">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-brand-700">
                      {product.price.toLocaleString('fr-FR')} FCFA
                    </span>
                    <span className="text-sm text-gray-400">/ {product.unit}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured services */}
      <section className="py-20 max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="section-title">Nos prestations</h2>
          <p className="section-subtitle">Un savoir-faire d'expert au service de vos projets</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {featuredServices.map((service) => (
            <div key={service.id} className="card p-6 group hover:-translate-y-1">
              <ProductImage
                src={service.image_url}
                alt={service.name}
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
              <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded">
                {service.category}
              </span>
              <h3 className="font-bold text-lg text-gray-900 mt-2 mb-2">{service.name}</h3>
              <p className="text-sm text-gray-600 line-clamp-3 mb-3">{service.description}</p>
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <span className="text-lg font-bold text-brand-700">
                  {service.price.toLocaleString('fr-FR')} FCFA
                </span>
                {service.duration && (
                  <span className="text-sm text-gray-400 flex items-center gap-1">
                    <Clock className="w-4 h-4" /> {service.duration}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialsSection />

      {/* CTA */}
      <section className="bg-gradient-to-r from-brand-800 to-brand-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Prêt à démarrer votre projet ?</h2>
          <p className="text-brand-100 text-lg mb-8">
            Demandez un devis gratuit ou réservez votre camion en quelques clics.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/devis" className="btn-accent">Demander un devis</Link>
            <Link to="/camions" className="btn-secondary !bg-white/10 !border-white/30 !text-white hover:!bg-white/20">
              Réserver un camion
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
