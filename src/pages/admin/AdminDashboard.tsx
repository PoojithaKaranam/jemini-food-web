import { useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { useToast } from '../../hooks/use-toast';

interface MenuItem {
  id: string;
  name: string;
  price: string;
  category: 'morning' | 'afternoon' | 'evening' | 'night';
  description: string;
}

interface Reservation {
  id: string;
  name: string;
  phone: string;
  date: string;
  time: string;
  guests: string;
  message: string;
}

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
}

interface Contact {
  id: string;
  name: string;
  email: string;
  message: string;
}

interface Feedback {
  id: string;
  name: string;
  email: string;
  rating: number;
  comment: string;
}

const AdminDashboard = () => {
  console.log('AdminDashboard component rendering');
  
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [preorders, setPreorders] = useState<PreOrder[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [newMenuItem, setNewMenuItem] = useState({
    name: '',
    price: '',
    category: 'morning' as const,
    description: ''
  });
  const [activeTab, setActiveTab] = useState('menu');
  
  const { logout } = useAuth();
  const { toast } = useToast();

  console.log('AdminDashboard - Current tab:', activeTab);

  useEffect(() => {
    const fetchMenuItems = async () => {
      const menuCollection = collection(db, 'menu');
      onSnapshot(menuCollection, (snapshot) => {
        setMenuItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MenuItem)));
      });
    };

    fetchMenuItems();
  }, []);

  useEffect(() => {
    const fetchReservations = async () => {
      const reservationsCollection = collection(db, 'reservations');
      onSnapshot(reservationsCollection, (snapshot) => {
        setReservations(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Reservation)));
      });
    };

    fetchReservations();
  }, []);

  useEffect(() => {
    const fetchPreorders = async () => {
      const preordersCollection = collection(db, 'preorders');
      onSnapshot(preordersCollection, (snapshot) => {
        setPreorders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PreOrder)));
      });
    };

    fetchPreorders();
  }, []);

  useEffect(() => {
    const fetchContacts = async () => {
      const contactsCollection = collection(db, 'contacts');
      onSnapshot(contactsCollection, (snapshot) => {
        setContacts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Contact)));
      });
    };

    fetchContacts();
  }, []);

  useEffect(() => {
    const fetchFeedback = async () => {
      const feedbackCollection = collection(db, 'feedback');
      onSnapshot(feedbackCollection, (snapshot) => {
        setFeedback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Feedback)));
      });
    };

    fetchFeedback();
  }, []);

  const addMenuItem = async () => {
    try {
      await addDoc(collection(db, 'menu'), newMenuItem);
      setNewMenuItem({ name: '', price: '', category: 'morning', description: '' });
      toast({
        title: "Menu Item Added",
        description: "New menu item has been added successfully.",
      });
    } catch (error) {
      console.error("Error adding menu item:", error);
      toast({
        title: "Error",
        description: "Failed to add menu item.",
        variant: "destructive",
      });
    }
  };

  const deleteMenuItem = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'menu', id));
      toast({
        title: "Menu Item Deleted",
        description: "Menu item has been deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting menu item:", error);
      toast({
        title: "Error",
        description: "Failed to delete menu item.",
        variant: "destructive",
      });
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
        <div className="flex space-x-4 mb-8 border-b">
          {['menu', 'reservations', 'preorders', 'contacts', 'feedback'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 px-4 capitalize ${
                activeTab === tab
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content based on active tab */}
        {activeTab === 'menu' && (
          <div>
            <h2 className="text-xl font-bold mb-4">Menu Management</h2>
            
            {/* Add new menu item form */}
            <div className="glass-effect p-6 rounded-2xl mb-6">
              <h3 className="text-lg font-semibold mb-4">Add New Menu Item</h3>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <Input
                  placeholder="Item name"
                  value={newMenuItem.name}
                  onChange={(e) => setNewMenuItem({...newMenuItem, name: e.target.value})}
                />
                <Input
                  placeholder="Price (₹)"
                  value={newMenuItem.price}
                  onChange={(e) => setNewMenuItem({...newMenuItem, price: e.target.value})}
                />
                <select
                  value={newMenuItem.category}
                  onChange={(e) => setNewMenuItem({...newMenuItem, category: e.target.value as any})}
                  className="px-3 py-2 border rounded-md"
                >
                  <option value="morning">Morning Tiffins</option>
                  <option value="afternoon">Afternoon Meals</option>
                  <option value="evening">Evening Snacks</option>
                  <option value="night">Night Tiffins</option>
                </select>
                <Input
                  placeholder="Description"
                  value={newMenuItem.description}
                  onChange={(e) => setNewMenuItem({...newMenuItem, description: e.target.value})}
                />
              </div>
              <Button onClick={addMenuItem}>Add Menu Item</Button>
            </div>

            {/* Menu items list */}
            <div className="grid gap-4">
              {menuItems.map((item) => (
                <div key={item.id} className="glass-effect p-4 rounded-xl flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold">{item.name}</h4>
                    <p className="text-muted-foreground">{item.description}</p>
                    <p className="text-primary font-bold">₹{item.price}</p>
                    <span className="text-xs bg-secondary px-2 py-1 rounded">{item.category}</span>
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
        )}

        {activeTab === 'reservations' && (
          <div>
            <h2 className="text-xl font-bold mb-4">Reservations</h2>
            <div className="grid gap-4">
              {reservations.map((reservation) => (
                <div key={reservation.id} className="glass-effect p-4 rounded-xl">
                  <h4 className="font-semibold">{reservation.name}</h4>
                  <p className="text-muted-foreground">Phone: {reservation.phone}</p>
                  <p className="text-muted-foreground">Date: {reservation.date}</p>
                  <p className="text-muted-foreground">Time: {reservation.time}</p>
                  <p className="text-muted-foreground">Guests: {reservation.guests}</p>
                  <p className="text-muted-foreground">Message: {reservation.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'preorders' && (
          <div>
            <h2 className="text-xl font-bold mb-4">Pre-Orders</h2>
            <div className="grid gap-4">
              {preorders.map((preorder) => (
                <div key={preorder.id} className="glass-effect p-4 rounded-xl">
                  <h4 className="font-semibold">Order #{preorder.id.slice(-6)}</h4>
                  <p className="text-muted-foreground">Name: {preorder.customerInfo.name}</p>
                  <p className="text-muted-foreground">Phone: {preorder.customerInfo.phone}</p>
                  <p className="text-muted-foreground">Pickup: {preorder.customerInfo.orderDate} at {preorder.customerInfo.orderTime}</p>
                  <h4 className="font-medium mt-2">Items:</h4>
                  <ul>
                    {preorder.items.map((item, index) => (
                      <li key={index} className="text-muted-foreground">
                        {item.name} x {item.quantity}
                      </li>
                    ))}
                  </ul>
                  <p className="text-primary font-bold mt-2">Total: ₹{preorder.totalAmount}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'contacts' && (
          <div>
            <h2 className="text-xl font-bold mb-4">Contacts</h2>
            <div className="grid gap-4">
              {contacts.map((contact) => (
                <div key={contact.id} className="glass-effect p-4 rounded-xl">
                  <h4 className="font-semibold">{contact.name}</h4>
                  <p className="text-muted-foreground">Email: {contact.email}</p>
                  <p className="text-muted-foreground">Message: {contact.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'feedback' && (
          <div>
            <h2 className="text-xl font-bold mb-4">Feedback</h2>
            <div className="grid gap-4">
              {feedback.map((feedbackItem) => (
                <div key={feedbackItem.id} className="glass-effect p-4 rounded-xl">
                  <h4 className="font-semibold">{feedbackItem.name}</h4>
                  <p className="text-muted-foreground">Email: {feedbackItem.email}</p>
                  <p className="text-muted-foreground">Rating: {feedbackItem.rating}</p>
                  <p className="text-muted-foreground">Comment: {feedbackItem.comment}</p>
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
