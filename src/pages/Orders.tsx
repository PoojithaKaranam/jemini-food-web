
import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, where } from 'firebase/firestore';
import { db } from '../config/firebase';

interface Order {
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
  status: 'pending' | 'approved' | 'taken' | 'cooking' | 'ready' | 'completed';
  createdAt: any;
}

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [customerPhone, setCustomerPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const searchOrders = () => {
    if (!customerPhone.trim()) return;
    
    setLoading(true);
    const q = query(
      collection(db, 'preorders'),
      where('customerInfo.phone', '==', customerPhone.trim()),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Order));
      setOrders(ordersList);
      setLoading(false);
    });

    return unsubscribe;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-500';
      case 'approved': return 'text-blue-500';
      case 'taken': return 'text-purple-500';
      case 'cooking': return 'text-orange-500';
      case 'ready': return 'text-green-500';
      case 'completed': return 'text-gray-500';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pending Approval';
      case 'approved': return 'Approved';
      case 'taken': return 'Order Taken';
      case 'cooking': return 'Cooking';
      case 'ready': return 'Ready for Pickup';
      case 'completed': return 'Completed';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">
            Your <span className="text-gradient">Orders</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Track your order status and view order history
          </p>
        </div>

        {/* Search Orders */}
        <div className="glass-effect p-6 rounded-2xl mb-8">
          <div className="flex gap-4">
            <input
              type="tel"
              placeholder="Enter your phone number to view orders"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="flex-1 px-4 py-2 border border-border rounded-md bg-background text-foreground"
            />
            <button
              onClick={searchOrders}
              disabled={loading}
              className="px-6 py-2 luxury-gradient text-background rounded-md font-medium hover-lift"
            >
              {loading ? 'Searching...' : 'Search Orders'}
            </button>
          </div>
        </div>

        {/* Orders List */}
        {orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="glass-effect p-6 rounded-2xl">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold">Order #{order.id.slice(-6)}</h3>
                    <p className="text-muted-foreground">
                      {order.customerInfo.orderDate} at {order.customerInfo.orderTime}
                    </p>
                  </div>
                  <div className={`font-semibold ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium mb-2">Items:</h4>
                  <div className="space-y-1">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{item.name} x {item.quantity}</span>
                        <span>₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-3">
                  <div className="flex justify-between font-bold">
                    <span>Total Amount:</span>
                    <span>₹{order.totalAmount}</span>
                  </div>
                </div>

                {/* Order Progress */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-muted-foreground mb-2">
                    <span>Pending</span>
                    <span>Taken</span>
                    <span>Cooking</span>
                    <span>Ready</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="luxury-gradient h-2 rounded-full transition-all duration-300"
                      style={{
                        width: 
                          order.status === 'pending' ? '25%' :
                          order.status === 'approved' || order.status === 'taken' ? '50%' :
                          order.status === 'cooking' ? '75%' :
                          order.status === 'ready' || order.status === 'completed' ? '100%' : '0%'
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : customerPhone && !loading ? (
          <div className="text-center py-20">
            <p className="text-xl text-muted-foreground">
              No orders found for this phone number.
            </p>
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-xl text-muted-foreground">
              Enter your phone number to view your orders.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
