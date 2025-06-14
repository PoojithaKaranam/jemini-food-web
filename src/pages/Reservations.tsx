import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useToast } from '../hooks/use-toast';

const Reservations = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    time: '',
    partySize: '',
    specialRequests: ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, 'reservations'), {
        ...formData,
        partySize: parseInt(formData.partySize),
        status: 'pending',
        createdAt: new Date()
      });

      toast({
        title: "Reservation Submitted!",
        description: "We'll contact you soon to confirm your reservation.",
      });

      setFormData({
        name: '',
        phone: '',
        email: '',
        date: '',
        time: '',
        partySize: '',
        specialRequests: ''
      });
    } catch (error) {
      console.error('Error submitting reservation:', error);
      toast({
        title: "Error",
        description: "Failed to submit reservation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div 
      className="min-h-screen py-20 bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: 'url(https://cdn.pixabay.com/photo/2017/01/03/06/24/restaurant-1948732_1280.jpg)',
        backgroundBlendMode: 'overlay',
        backgroundColor: 'rgba(0, 0, 0, 0.6)'
      }}
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 text-white">
            Make a <span className="text-gradient">Reservation</span>
          </h1>
          <p className="text-xl text-white">
            Reserve your table for an unforgettable dining experience
          </p>
        </div>

        {/* Removed the background from form container */}
        <div className="p-8 rounded-2xl backdrop-blur-sm border border-white/10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-white">Name *</label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/20 backdrop-blur-sm border-white/10 text-white placeholder:text-white/70"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-white">Phone *</label>
                <Input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/20 backdrop-blur-sm border-white/10 text-white placeholder:text-white/70"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-white">Email</label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-white/20 backdrop-blur-sm border-white/10 text-white placeholder:text-white/70"
              />
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-white">Date *</label>
                <Input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/20 backdrop-blur-sm border-white/10 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-white">Time *</label>
                <Input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/20 backdrop-blur-sm border-white/10 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-white">Party Size *</label>
                <Input
                  type="number"
                  name="partySize"
                  value={formData.partySize}
                  onChange={handleChange}
                  min="1"
                  max="20"
                  required
                  className="w-full bg-white/20 backdrop-blur-sm border-white/10 text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-white">Special Requests</label>
              <textarea
                name="specialRequests"
                value={formData.specialRequests}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border rounded-md bg-white/20 backdrop-blur-sm border-white/10 text-white"
                placeholder="Any special dietary requirements or requests..."
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full luxury-gradient">
              {loading ? 'Submitting...' : 'Make Reservation'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Reservations;
