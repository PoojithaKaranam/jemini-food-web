
import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useToast } from '../hooks/use-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, 'contacts'), {
        ...formData,
        createdAt: new Date()
      });

      toast({
        title: "Message Sent!",
        description: "Thank you for contacting us. We'll get back to you soon.",
      });

      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
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
    <div className="min-h-screen py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">
            Contact <span className="text-gradient">Us</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            We'd love to hear from you. Send us a message!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="glass-effect p-8 rounded-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Name *</label>
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Phone</label>
                  <Input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email *</label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Subject *</label>
                <Input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Message *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  required
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                  placeholder="Tell us how we can help you..."
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div className="glass-effect p-6 rounded-2xl">
              <h3 className="text-xl font-semibold mb-4">Visit Us</h3>
              <p className="text-muted-foreground">
                123 Food Street<br />
                Culinary District<br />
                City, State 12345
              </p>
            </div>

            <div className="glass-effect p-6 rounded-2xl">
              <h3 className="text-xl font-semibold mb-4">Call Us</h3>
              <p className="text-muted-foreground">
                Phone: +91 98765 43210<br />
                WhatsApp: +91 98765 43210
              </p>
            </div>

            <div className="glass-effect p-6 rounded-2xl">
              <h3 className="text-xl font-semibold mb-4">Email Us</h3>
              <p className="text-muted-foreground">
                info@jeminifoods.com<br />
                orders@jeminifoods.com
              </p>
            </div>

            <div className="glass-effect p-6 rounded-2xl">
              <h3 className="text-xl font-semibold mb-4">Hours</h3>
              <div className="text-muted-foreground space-y-1">
                <p>Monday - Friday: 6:00 AM - 12:00 AM</p>
                <p>Saturday - Sunday: 6:00 AM - 1:00 AM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
