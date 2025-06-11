
import { Clock, Users, Image } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: Clock,
      title: 'All Day Dining',
      description: 'From morning tiffins to midnight snacks, we serve fresh, delicious meals throughout the day.',
      items: ['Morning Tiffins', 'Afternoon Meals', 'Evening Snacks', 'Night Tiffins']
    },
    {
      icon: Users,
      title: 'Easy Reservations',
      description: 'Book your table in advance or place pre-orders for pickup with our seamless booking system.',
      items: ['Quick Booking', 'Pre-Orders', 'Real-time Updates', 'Order Tracking']
    },
    {
      icon: Image,
      title: 'Visual Experience',
      description: 'Browse our gallery of mouth-watering dishes and restaurant ambiance before you visit.',
      items: ['Food Gallery', 'Restaurant Views', 'Chef Specials', 'Behind Scenes']
    }
  ];

  return (
    <section className="py-20 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Why Choose <span className="text-gradient">Jemini Foods</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover what makes us special and why customers keep coming back for more
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="glass-effect p-8 rounded-2xl hover-lift group"
            >
              <div className="luxury-gradient w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="text-background" size={24} />
              </div>
              
              <h3 className="text-2xl font-bold mb-4 text-foreground">
                {feature.title}
              </h3>
              
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {feature.description}
              </p>
              
              <ul className="space-y-2">
                {feature.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-center text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
