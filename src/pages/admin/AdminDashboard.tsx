
import { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, updateDoc, deleteDoc, addDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { useToast } from '../../hooks/use-toast';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
}

interface Reservation {
  id: string;
  name: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  partySize: number;
  status: string;
}

interface PreOrder {
  id: string;
  customerInfo: any;
  items: any[];
  totalAmount: number;
  status: string;
  createdAt: any;
}

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('menu');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [preorders, setPreorders] = useState<PreOrder[]>([]);
  const [newMenuItem, setNewMenuItem] = useState({
    name: '',
    description: '',
    price: '',
    category: 'morning',
    image: ''
  });
  const { logout } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Real-time listeners
    const unsubscribeMenu = onSnapshot(collection(db, 'menuItems'), (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as MenuItem));
      setMenuItems(items);
    });

    const unsubscribeReservations = onSnapshot(collection(db, 'reservations'), (snapshot) => {
      const reservations = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Reservation));
      setReservations(reservations);
    });

    const unsubscribePreorders = onSnapshot(collection(db, 'preorders'), (snapshot) => {
      const preorders = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as PreOrder));
      setPreorders(preorders);
    });

    return () => {
      unsubscribeMenu();
      unsubscribeReservations();
      unsubscribePreorders();
    };
  }, []);

  const addMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'menuItems'), {
        ...newMenuItem,
        price: parseFloat(newMenuItem.price)
      });
      setNewMenuItem({
        name: '',
        description: '',
        price: '',
        category: 'morning',
        image: ''
      });
      toast({
        title: "Menu Item Added",
        description: "New item has been added to the menu.",
      });
    } catch (error) {
      console.error('Error adding menu item:', error);
      toast({
        title: "Error",
        description: "Failed to add menu item.",
        variant: "destructive",
      });
    }
  };

  const deleteMenuItem = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'menuItems', id));
      toast({
        title: "Menu Item Deleted",
        description: "Item has been removed from the menu.",
      });
    } catch (error) {
      console.error('Error deleting menu item:', error);
    }
  };

  const updatePreorderStatus = async (id: string, status: string) => {
    try {
      await updateDoc(doc(db, 'preorders', id), { status });
      toast({
        title: "Order Status Updated",
        description: `Order has been ${status}.`,
      });
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gradient">Admin Dashboard</h1>
            <Button onClick={logout} variant="outline">
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-4 mb-8">
          {['menu', 'reservations', 'preorders'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-medium capitalize ${
                activeTab === tab
                  ? 'luxury-gradient text-background'
                  : 'bg-card text-foreground hover:bg-secondary'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Menu Management */}
        {activeTab === 'menu' && (
          <div className="space-y-8">
            <div className="glass-effect p-6 rounded-2xl">
              <h2 className="text-xl font-bold mb-4">Add New Menu Item</h2>
              <form onSubmit={addMenuItem} className="grid md:grid-cols-2 gap-4">
                <Input
                  placeholder="Item Name"
                  value={newMenuItem.name}
                  onChange={(e) => setNewMenuItem({...newMenuItem, name: e.target.value})}
                  required
                />
                <Input
                  placeholder="Price"
                  type="number"
                  step="0.01"
                  value={newMenuItem.price}
                  onChange={(e) => setNewMenuItem({...newMenuItem, price: e.target.value})}
                  required
                />
                <select
                  value={newMenuItem.category}
                  onChange={(e) => setNewMenuItem({...newMenuItem, category: e.target.value})}
                  className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
                >
                  <option value="morning">Morning Tiffins</option>
                  <option value="afternoon">Afternoon Meals</option>
                  <option value="evening">Evening Snacks</option>
                  <option value="night">Night Tiffins</option>
                </select>
                <Input
                  placeholder="Image URL"
                  value={newMenuItem.image}
                  onChange={(e) => setNewMenuItem({...newMenuItem, image: e.target.value})}
                />
                <div className="md:col-span-2">
                  <textarea
                    placeholder="Description"
                    value={newMenuItem.description}
                    onChange={(e) => setNewMenuItem({...newMenuItem, description: e.target.value})}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                    rows={3}
                    required
                  />
                </div>
                <Button type="submit" className="md:col-span-2">
                  Add Menu Item
                </Button>
              </form>
            </div>

            <div className="glass-effect p-6 rounded-2xl">
              <h2 className="text-xl font-bold mb-4">Current Menu Items</h2>
              <div className="grid gap-4">
                {menuItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center p-4 border border-border rounded-lg">
                    <div>
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                      <p className="text-primary font-bold">₹{item.price}</p>
                    </div>
                    <Button 
                      onClick={() => deleteMenuItem(item.id)}
                      variant="destructive"
                      size="sm"
                    >
                      Delete
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Reservations */}
        {activeTab === 'reservations' && (
          <div className="glass-effect p-6 rounded-2xl">
            <h2 className="text-xl font-bold mb-4">Reservations</h2>
            <div className="space-y-4">
              {reservations.map((reservation) => (
                <div key={reservation.id} className="p-4 border border-border rounded-lg">
                  <div className="grid md:grid-cols-2 gap-2">
                    <p><strong>Name:</strong> {reservation.name}</p>
                    <p><strong>Phone:</strong> {reservation.phone}</p>
                    <p><strong>Date:</strong> {reservation.date}</p>
                    <p><strong>Time:</strong> {reservation.time}</p>
                    <p><strong>Party Size:</strong> {reservation.partySize}</p>
                    <p><strong>Status:</strong> {reservation.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pre-orders */}
        {activeTab === 'preorders' && (
          <div className="glass-effect p-6 rounded-2xl">
            <h2 className="text-xl font-bold mb-4">Pre-orders</h2>
            <div className="space-y-4">
              {preorders.map((order) => (
                <div key={order.id} className="p-4 border border-border rounded-lg">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p><strong>Customer:</strong> {order.customerInfo.name}</p>
                      <p><strong>Phone:</strong> {order.customerInfo.phone}</p>
                      <p><strong>Date:</strong> {order.customerInfo.orderDate}</p>
                      <p><strong>Time:</strong> {order.customerInfo.orderTime}</p>
                      <p><strong>Total:</strong> ₹{order.totalAmount}</p>
                      <p><strong>Status:</strong> {order.status}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Items:</h4>
                      {order.items.map((item, index) => (
                        <p key={index} className="text-sm">
                          {item.name} x {item.quantity}
                        </p>
                      ))}
                      <div className="flex gap-2 mt-4">
                        {order.status === 'pending' && (
                          <>
                            <Button 
                              size="sm"
                              onClick={() => updatePreorderStatus(order.id, 'approved')}
                            >
                              Approve
                            </Button>
                            <Button 
                              size="sm"
                              variant="destructive"
                              onClick={() => updatePreorderStatus(order.id, 'rejected')}
                            >
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
