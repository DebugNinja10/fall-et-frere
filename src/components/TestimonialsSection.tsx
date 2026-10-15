import { useEffect, useState } from 'react';
import { supabase, type Testimonial } from '@/lib/supabase';
import { Star, Quote } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    supabase
      .from('testimonials')
      .select('*')
      .eq('is_approved', true)
      .order('created_at', { ascending: false })
      .limit(6)
      .then(({ data }) => setTestimonials(data ?? []));
  }, []);

  if (testimonials.length === 0) return null;

  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="section-title">Ce que disent nos clients</h2>
          <p className="section-subtitle">La satisfaction de nos clients est notre meilleure publicité</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col">
              <Quote className="w-8 h-8 text-brand-200 mb-3" />
              <p className="text-gray-600 mb-5 flex-1 italic">"{t.comment}"</p>
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div>
                  <div className="font-bold text-gray-900">{t.customer_name}</div>
                  {t.service_type && <div className="text-sm text-gray-400">{t.service_type}</div>}
                </div>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < t.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link to="/avis" className="btn-secondary inline-flex">
            Partager votre expérience
          </Link>
        </div>
      </div>
    </section>
  );
}
