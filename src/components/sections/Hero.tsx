import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Hero = () => {
  const scrollToCategories = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const categoriesSection = document.getElementById('categories');
    if (categoriesSection) {
      categoriesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-[80vh] flex items-center">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2940")',
        }}
      >
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-32">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Black & White Entertainment Awards
          </h1>
          
          <p className="text-lg md:text-xl text-gray-200 mb-8 md:mb-12">
            Celebrate excellence in entertainment. Vote for your favorite artists, actors, 
            and content creators across multiple categories.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/nominees"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Vote Now
              <ArrowRight className="w-5 h-5" />
            </Link>
            
            <a
              href="#categories"
              onClick={scrollToCategories}
              className="inline-flex items-center justify-center px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
            >
              View Categories
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-12 md:mt-20">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">100+</div>
              <div className="text-sm text-gray-300">Nominees</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">1M+</div>
              <div className="text-sm text-gray-300">Votes Cast</div>
            </div>
            <div className="hidden md:block text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">5</div>
              <div className="text-sm text-gray-300">Categories</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};