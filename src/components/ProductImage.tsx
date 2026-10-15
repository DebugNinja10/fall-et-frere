import { ImageIcon } from 'lucide-react';

export default function ProductImage({ src, alt, className }: { src?: string | null; alt: string; className?: string }) {
  if (src) {
    return <img src={src} alt={alt} className={className} />;
  }
  return (
    <div className={`flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 ${className}`}>
      <div className="text-center">
        <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-2" />
        <span className="text-sm text-gray-400">Image à venir</span>
      </div>
    </div>
  );
}
