
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { useToast } from '../../hooks/use-toast';

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(credentials.email, credentials.password);
      toast({
        title: "Login Successful",
        description: "Welcome to the admin panel!",
      });
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login Failed",
        description: "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full mx-4">
        <div className="glass-effect p-8 rounded-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">
              Admin <span className="text-gradient">Panel</span>
            </h1>
            <p className="text-muted-foreground">
              Sign in to access the dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <Input
                type="email"
                value={credentials.email}
                onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                required
                placeholder="admin@jeminifoods.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <Input
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                required
                placeholder="••••••••"
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>Demo Credentials:</p>
            <p>Admin: admin@jeminifoods.com / admin123</p>
            <p>Chef: chef@jeminifoods.com / chef123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
