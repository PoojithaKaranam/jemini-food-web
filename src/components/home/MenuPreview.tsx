import { useState } from 'react';
import { Button } from '../ui/button';

const MenuPreview = () => {
  const [activeCategory, setActiveCategory] = useState('morning');

  const categories = [
    { id: 'morning', name: 'Morning Tiffins', time: '6:00 AM - 11:00 AM' },
    { id: 'afternoon', name: 'Afternoon Meals', time: '12:00 PM - 4:00 PM' },
    { id: 'evening', name: 'Evening Snacks', time: '4:00 PM - 8:00 PM' },
    { id: 'night', name: 'Night Tiffins', time: '8:00 PM - 12:00 AM' }
  ];

  const menuItems = {
    morning: [
      { name: 'Classic Idli Sambar', price: '₹120', description: 'Soft steamed rice cakes with authentic sambar' },
      { name: 'Masala Dosa', price: '₹150', description: 'Crispy dosa with spiced potato filling' },
      { name: 'Upma Special', price: '₹100', description: 'Traditional semolina breakfast with vegetables' }
    ],
    afternoon: [
      { name: 'Biryani Deluxe', price: '₹280', description: 'Aromatic basmati rice with tender meat' },
      { name: 'Thali Complete', price: '₹220', description: 'Full meal with rice, dal, vegetables, and bread' },
      { name: 'Curry Rice Combo', price: '₹180', description: 'Choice of curry with steamed rice' }
    ],
    evening: [
      { name: 'Samosa Chaat', price: '₹80', description: 'Crispy samosas with tangy chutneys' },
      { name: 'Pakora Platter', price: '₹120', description: 'Mixed vegetable fritters with tea' },
      { name: 'Sandwich Special', price: '₹100', description: 'Grilled sandwich with fresh ingredients' }
    ],
    night: [
      { name: 'Fried Rice', price: '₹160', description: 'Wok-tossed rice with vegetables and sauces' },
      { name: 'Noodles Special', price: '₹140', description: 'Stir-fried noodles with choice of protein' },
      { name: 'Roti Sabzi', price: '₹120', description: 'Fresh bread with seasonal vegetables' }
    ]
  };

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Our <span className="text-gradient">Menu</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Fresh, authentic flavors served throughout the day
          </p>
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-3 rounded-full transition-all duration-300 ${
                activeCategory === category.id
                  ? 'luxury-gradient text-background'
                  : 'bg-card text-foreground hover:bg-secondary'
              }`}
            >
              <div className="text-center">
                <div className="font-medium">{category.name}</div>
                <div className="text-xs opacity-80">{category.time}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Menu items */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {menuItems[activeCategory as keyof typeof menuItems].map((item, index) => (
            <div
              key={index}
              className="glass-effect p-6 rounded-xl hover-lift"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-semibold text-foreground">{item.name}</h3>
                <span className="text-primary font-bold text-lg">{item.price}</span>
              </div>
              <p className="text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button size="lg">
            View Full Menu
          </Button>
        </div>
      </div>
    </section>
  );
};

export default MenuPreview;
