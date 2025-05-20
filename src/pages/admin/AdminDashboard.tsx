
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/firebase";
import { onValue, ref } from "firebase/database";
import { CreditCard, Percent, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    activeOffers: 0,
    activeDiscounts: 0,
    revenueMonth: "₹0",
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [popularItems, setPopularItems] = useState<{name: string, count: number}[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch total orders
    const ordersRef = ref(db, 'orders');
    const unsubscribeOrders = onValue(ordersRef, (snapshot) => {
      if (snapshot.exists()) {
        const ordersData = snapshot.val();
        const ordersArray = Object.values(ordersData) as any[];
        
        // Calculate total orders
        const totalOrders = ordersArray.length;
        
        // Calculate monthly revenue
        const currentDate = new Date();
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const monthlyOrders = ordersArray.filter((order: any) => {
          const orderDate = new Date(order.date);
          return orderDate >= firstDayOfMonth;
        });
        
        const monthlyRevenue = monthlyOrders.reduce((sum: number, order: any) => sum + (order.total || 0), 0);
        
        // Get recent orders
        const sortedOrders = [...ordersArray]
          .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 4)
          .map((order: any, index: number) => ({
            id: Object.keys(ordersData)[index],
            ...order
          }));
        
        setRecentOrders(sortedOrders);
        
        // Update stats
        setStats(prev => ({
          ...prev,
          totalOrders,
          revenueMonth: `₹${monthlyRevenue.toLocaleString('en-IN')}`,
        }));
      }
      setLoading(false);
    });
    
    // Fetch active offers
    const offersRef = ref(db, 'offers');
    const unsubscribeOffers = onValue(offersRef, (snapshot) => {
      if (snapshot.exists()) {
        const offersData = snapshot.val();
        const activeOffers = Object.values(offersData).filter((offer: any) => offer.active).length;
        setStats(prev => ({ ...prev, activeOffers }));
      }
    });
    
    // Fetch active discounts
    const discountsRef = ref(db, 'discounts');
    const unsubscribeDiscounts = onValue(discountsRef, (snapshot) => {
      if (snapshot.exists()) {
        const discountsData = snapshot.val();
        const activeDiscounts = Object.values(discountsData).filter((discount: any) => discount.active).length;
        setStats(prev => ({ ...prev, activeDiscounts }));
      }
    });
    
    // Calculate popular items
    const calculatePopularItems = () => {
      const ordersRef = ref(db, 'orders');
      onValue(ordersRef, (snapshot) => {
        if (snapshot.exists()) {
          const ordersData = snapshot.val();
          const ordersArray = Object.values(ordersData) as any[];
          
          // Count item occurrences
          const itemCounts: {[key: string]: number} = {};
          ordersArray.forEach((order: any) => {
            if (order.items && Array.isArray(order.items)) {
              order.items.forEach((item: any) => {
                if (item.name) {
                  itemCounts[item.name] = (itemCounts[item.name] || 0) + (Number(item.quantity) || 1);
                }
              });
            }
          });
          
          // Convert to array and sort
          const popularItemsArray = Object.entries(itemCounts)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 4);
          
          setPopularItems(popularItemsArray);
        }
      });
    };
    
    calculatePopularItems();
    
    return () => {
      unsubscribeOrders();
      unsubscribeOffers();
      unsubscribeDiscounts();
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-playfair text-white">Dashboard</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-darkCard border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalOrders}</div>
            <p className="text-xs text-gray-400 mt-1">All time orders</p>
          </CardContent>
        </Card>

        <Card className="bg-darkCard border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Active Offers</CardTitle>
            <Percent className="h-4 w-4 text-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.activeOffers}</div>
            <p className="text-xs text-gray-400 mt-1">Current promotions</p>
          </CardContent>
        </Card>

        <Card className="bg-darkCard border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Active Discounts</CardTitle>
            <Percent className="h-4 w-4 text-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.activeDiscounts}</div>
            <p className="text-xs text-gray-400 mt-1">Available discount codes</p>
          </CardContent>
        </Card>

        <Card className="bg-darkCard border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Monthly Revenue</CardTitle>
            <CreditCard className="h-4 w-4 text-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.revenueMonth}</div>
            <p className="text-xs text-gray-400 mt-1">Current month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-darkCard border-gray-800">
          <CardHeader>
            <CardTitle className="text-lg text-white">Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-4 text-gray-400">Loading...</div>
            ) : recentOrders.length === 0 ? (
              <div className="text-center py-4 text-gray-400">No orders found</div>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order: any) => (
                  <div key={order.id} className="flex items-center justify-between pb-4 border-b border-gray-800">
                    <div>
                      <p className="font-medium text-white">Order #{order.id.substring(0, 6)}</p>
                      <p className="text-sm text-gray-400">
                        {new Date(order.date).toLocaleDateString()}, {new Date(order.date).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-gold font-medium">₹{order.total}</p>
                      <span className={`inline-block px-2 py-1 text-xs rounded ${
                        order.status === 'completed' ? 'bg-green-900/30 text-green-400' : 
                        order.status === 'pending' ? 'bg-yellow-900/30 text-yellow-400' : 
                        'bg-blue-900/30 text-blue-400'
                      }`}>
                        {order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Processing'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-darkCard border-gray-800">
          <CardHeader>
            <CardTitle className="text-lg text-white">Popular Items</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-4 text-gray-400">Loading...</div>
            ) : popularItems.length === 0 ? (
              <div className="text-center py-4 text-gray-400">No data available</div>
            ) : (
              <div className="space-y-4">
                {popularItems.map((item, i) => (
                  <div key={i} className="flex items-center justify-between pb-4 border-b border-gray-800">
                    <p className="font-medium text-white">{item.name}</p>
                    <p className="text-gold font-medium">{item.count} orders</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;


