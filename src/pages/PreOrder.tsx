
import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useToast } from '../hooks/use-toast';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
}

interface OrderItem extends MenuItem {
  quantity: number;
}

const PreOrder = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    orderDate: '',
    orderTime: ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'menuItems'));
      const items = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as MenuItem));
      setMenuItems(items);
    } catch (error) {
      console.error('Error fetching menu items:', error);
    }
  };

  const addToOrder = (item: MenuItem) => {
    const existingItem = orderItems.find(orderItem => orderItem.id === item.id);
    if (existingItem) {
      setOrderItems(orderItems.map(orderItem =>
        orderItem.id === item.id
          ? { ...orderItem, quantity: orderItem.quantity + 1 }
          : orderItem
      ));
    } else {
      setOrderItems([...orderItems, { ...item, quantity: 1 }]);
    }
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity === 0) {
      setOrderItems(orderItems.filter(item => item.id !== id));
    } else {
      setOrderItems(orderItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      ));
    }
  };

  const getTotalAmount = () => {
    return orderItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (orderItems.length === 0) {
      toast({
        title: "Error",
        description: "Please add items to your order.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'preorders'), {
        customerInfo,
        items: orderItems,
        totalAmount: getTotalAmount(),
        status: 'pending',
        createdAt: new Date()
      });

      toast({
        title: "Pre-order Submitted!",
        description: "Your order has been submitted for approval. We'll contact you soon.",
      });

      setOrderItems([]);
      setCustomerInfo({
        name: '',
        phone: '',
        orderDate: '',
        orderTime: ''
      });
    } catch (error) {
      console.error('Error submitting pre-order:', error);
      toast({
        title: "Error",
        description: "Failed to submit pre-order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">
            Pre-<span className="text-gradient">Order</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Order in advance and skip the wait
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Menu Items */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Select Items</h2>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {menuItems.map((item) => (
                <div key={item.id} className="glass-effect p-4 rounded-lg flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">{item.category}</p>
                    <p className="text-primary font-bold">₹{item.price}</p>
                  </div>
                  <Button onClick={() => addToOrder(item)} size="sm">
                    Add
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary & Customer Info */}
          <div>
            <div className="glass-effect p-6 rounded-2xl mb-6">
              <h2 className="text-2xl font-bold mb-4">Your Order</h2>
              {orderItems.length === 0 ? (
                <p className="text-muted-foreground">No items added yet</p>
              ) : (
                <div className="space-y-3">
                  {orderItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div>
                        <span className="font-medium">{item.name}</span>
                        <span className="text-sm text-muted-foreground ml-2">₹{item.price}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          -
                        </Button>
                        <span>{item.quantity}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  ))}
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total: ₹{getTotalAmount()}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Customer Information Form */}
            <div className="glass-effect p-6 rounded-2xl">
              <h2 className="text-2xl font-bold mb-4">Customer Information</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  placeholder="Your Name"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                  required
                />
                <Input
                  placeholder="Phone Number"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                  required
                />
                <Input
                  type="date"
                  value={customerInfo.orderDate}
                  onChange={(e) => setCustomerInfo({...customerInfo, orderDate: e.target.value})}
                  required
                />
                <Input
                  type="time"
                  value={customerInfo.orderTime}
                  onChange={(e) => setCustomerInfo({...customerInfo, orderTime: e.target.value})}
                  required
                />
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? 'Submitting...' : 'Submit Pre-Order'}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreOrder;
