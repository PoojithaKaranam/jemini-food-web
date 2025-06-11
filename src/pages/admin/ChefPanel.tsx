
import { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, updateDoc, query, where } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/button';
import { useToast } from '../../hooks/use-toast';

interface PreOrder {
  id: string;
  customerInfo: {
    name: string;
    phone: string;
    orderDate: string;
    orderTime: string;
  };
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  status: 'approved' | 'taken' | 'cooking' | 'ready';
  createdAt: any;
}

const ChefPanel = () => {
  const [orders, setOrders] = useState<PreOrder[]>([]);
  const { logout } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Listen only to approved orders and beyond
    const q = query(
      collection(db, 'preorders'),
      where('status', 'in', ['approved', 'taken', 'cooking', 'ready'])
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as PreOrder));
      setOrders(ordersList.sort((a, b) => a.createdAt?.toDate() - b.createdAt?.toDate()));
    });

    return unsubscribe;
  }, []);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'preorders', orderId), { 
        status: newStatus 
      });
      toast({
        title: "Order Updated",
        description: `Order status changed to ${newStatus}.`,
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        title: "Error",
        description: "Failed to update order status.",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-blue-500';
      case 'taken': return 'text-purple-500';
      case 'cooking': return 'text-orange-500';
      case 'ready': return 'text-green-500';
      default: return 'text-muted-foreground';
    }
  };

  const getNextStatus = (currentStatus: string) => {
    switch (currentStatus) {
      case 'approved': return 'taken';
      case 'taken': return 'cooking';
      case 'cooking': return 'ready';
      default: return null;
    }
  };

  const getStatusButtonText = (currentStatus: string) => {
    switch (currentStatus) {
      case 'approved': return 'Mark as Taken';
      case 'taken': return 'Start Cooking';
      case 'cooking': return 'Mark as Ready';
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gradient">Chef Panel</h1>
            <Button onClick={logout} variant="outline">
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-2">Active Orders</h2>
          <p className="text-muted-foreground">
            Manage approved orders and update their cooking status
          </p>
        </div>

        {orders.length > 0 ? (
          <div className="grid gap-6">
            {orders.map((order) => (
              <div key={order.id} className="glass-effect p-6 rounded-2xl">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">Order #{order.id.slice(-6)}</h3>
                    <p className="text-muted-foreground">
                      {order.customerInfo.name} - {order.customerInfo.phone}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Pickup: {order.customerInfo.orderDate} at {order.customerInfo.orderTime}
                    </p>
                  </div>
                  <div className={`font-semibold ${getStatusColor(order.status)} capitalize`}>
                    {order.status}
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium mb-2">Items:</h4>
                  <div className="grid md:grid-cols-2 gap-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between bg-secondary p-2 rounded">
                        <span>{item.name}</span>
                        <span>x {item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="font-bold text-lg">
                    Total: ₹{order.totalAmount}
                  </div>
                  
                  {getNextStatus(order.status) && (
                    <Button
                      onClick={() => updateOrderStatus(order.id, getNextStatus(order.status)!)}
                      className="luxury-gradient text-background"
                    >
                      {getStatusButtonText(order.status)}
                    </Button>
                  )}
                  
                  {order.status === 'ready' && (
                    <div className="text-green-500 font-semibold">
                      Ready for Pickup!
                    </div>
                  )}
                </div>

                {/* Order Progress Bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-muted-foreground mb-2">
                    <span>Approved</span>
                    <span>Taken</span>
                    <span>Cooking</span>
                    <span>Ready</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="luxury-gradient h-2 rounded-full transition-all duration-300"
                      style={{
                        width: 
                          order.status === 'approved' ? '25%' :
                          order.status === 'taken' ? '50%' :
                          order.status === 'cooking' ? '75%' :
                          order.status === 'ready' ? '100%' : '0%'
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-xl text-muted-foreground">
              No active orders at the moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChefPanel;
