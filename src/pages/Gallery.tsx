import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';

interface GalleryItem {
  id: string;
  imageUrl: string;
  title: string;
  category: string;
}

const Gallery = () => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const categories = ['all', 'food', 'restaurant', 'events'];

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  const fetchGalleryItems = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'gallery'));
      const items = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as GalleryItem));
      setGalleryItems(items);
    } catch (error) {
      console.error('Error fetching gallery items:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = activeFilter === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeFilter);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen py-20 bg-cover bg-fixed bg-center relative"
      style={{ backgroundImage: 'url("https://wallpapercave.com/wp/wp10322965.jpg")' }}
    >
      {/* Overlay to ensure text readability */}
      <div className="absolute inset-0 bg-black/50"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 text-white">
            Our <span className="text-gradient">Gallery</span>
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Explore the visual journey of our culinary excellence
          </p>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveFilter(category)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 capitalize ${
                activeFilter === category
                  ? 'luxury-gradient text-background'
                  : 'bg-card/80 text-white hover:bg-secondary hover-lift backdrop-blur-sm'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Gallery grid */}
        {filteredItems.length > 0 ? (
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="glass-effect backdrop-blur-sm rounded-2xl overflow-hidden hover-lift group cursor-pointer"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 glass-effect backdrop-blur-sm rounded-xl">
            <p className="text-xl text-white">
              No {activeFilter !== 'all' ? activeFilter : ''} items found in the gallery
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
