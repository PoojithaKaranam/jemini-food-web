
import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useToast } from '../hooks/use-toast';

const Feedback = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: 5,
    feedbackType: 'comment',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, 'feedback'), {
        ...formData,
        createdAt: new Date()
      });

      toast({
        title: "Feedback Submitted!",
        description: "Thank you for your valuable feedback.",
      });

      setFormData({
        name: '',
        email: '',
        rating: 5,
        feedbackType: 'comment',
        message: ''
      });
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">
            Your <span className="text-gradient">Feedback</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Help us improve by sharing your experience
          </p>
        </div>

        <div className="glass-effect p-8 rounded-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
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
                <label className="block text-sm font-medium mb-2">Email</label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Star Rating */}
            <div>
              <label className="block text-sm font-medium mb-2">Rating *</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({...formData, rating: star})}
                    className={`text-2xl ${
                      star <= formData.rating ? 'text-yellow-400' : 'text-gray-300'
                    } hover:text-yellow-400 transition-colors`}
                  >
                    ★
                  </button>
                ))}
                <span className="ml-2 text-sm text-muted-foreground">
                  {formData.rating} star{formData.rating !== 1 ? 's' : ''}
                </span>
              </div>
            </div>

            {/* Feedback Type */}
            <div>
              <label className="block text-sm font-medium mb-2">Feedback Type *</label>
              <select
                name="feedbackType"
                value={formData.feedbackType}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
              >
                <option value="comment">General Comment</option>
                <option value="suggestion">Suggestion</option>
                <option value="complaint">Complaint</option>
                <option value="compliment">Compliment</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Your Feedback *</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={6}
                required
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                placeholder="Share your experience with us..."
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Submitting...' : 'Submit Feedback'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
