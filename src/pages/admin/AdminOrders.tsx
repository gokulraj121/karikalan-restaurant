
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import { onValue, ref, update } from "firebase/database";
import { useEffect, useMemo, useState } from "react";

interface Order {
  id: string;
  customer: string;
  phone: string;
  total: number;
  date: string;
  status: string;
  items: any[];
  gst: number;
  paymentMethod: string;
  orderType: string;
  address: string;
  location?: { lat: string; lng: string };
}

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [filterOrderType, setFilterOrderType] = useState("all");

  useEffect(() => {
    const ordersRef = ref(db, 'orders');
    const unsubscribe = onValue(ordersRef, (snapshot) => {
      if (snapshot.exists()) {
        const ordersData = snapshot.val();
        const ordersArray = Object.keys(ordersData).map(key => ({
          id: key,
          ...ordersData[key]
        }));
        
        // Sort orders by date (newest first)
        ordersArray.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
        setOrders(ordersArray);
        console.log("Orders loaded:", ordersArray.length);
      } else {
        setOrders([]);
        console.log("No orders found in database");
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching orders:", error);
      toast({
        title: "Error loading orders",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Filter orders based on status, order type, and search query
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      // Filter by status
      if (filterStatus !== "all" && order.status !== filterStatus) {
        return false;
      }
      
      // Filter by order type
      if (filterOrderType !== "all" && order.orderType !== filterOrderType) {
        return false;
      }
      
      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          order.id.toLowerCase().includes(query) ||
          order.customer.toLowerCase().includes(query) ||
          (order.phone && order.phone.includes(query))
        );
      }
      
      return true;
    });
  }, [orders, filterStatus, filterOrderType, searchQuery]);

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    const orderRef = ref(db, `orders/${orderId}`);
    update(orderRef, { status: newStatus })
      .then(() => {
        toast({
          title: "Order updated",
          description: `Order status changed to ${newStatus}`,
        });
      })
      .catch((error) => {
        toast({
          title: "Error updating order",
          description: error.message,
          variant: "destructive",
        });
      });
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowDetails(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  // Status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-900/30 text-green-400";
      case "ready":
        return "bg-blue-900/30 text-blue-400";
      case "preparing":
        return "bg-yellow-900/30 text-yellow-400";
      case "cancelled":
        return "bg-red-900/30 text-red-400";
      case "pending":
        return "bg-orange-900/30 text-orange-400";
      default:
        return "bg-gray-900/30 text-gray-400";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-playfair text-white">Orders</h1>
        <Button className="bg-gold hover:bg-gold/80 text-darkBg">
          Export Data
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Label htmlFor="search" className="text-gray-400 mb-1.5 block">Search Orders</Label>
          <Input
            id="search"
            placeholder="Search by order ID, customer name or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-darkBg border-gray-700"
          />
        </div>
        <div>
          <Label htmlFor="status" className="text-gray-400 mb-1.5 block">Status</Label>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger id="status" className="bg-darkBg border-gray-700 w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="bg-darkBg border-gray-700">
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="preparing">Preparing</SelectItem>
              <SelectItem value="ready">Ready</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="orderType" className="text-gray-400 mb-1.5 block">Order Type</Label>
          <Select value={filterOrderType} onValueChange={setFilterOrderType}>
            <SelectTrigger id="orderType" className="bg-darkBg border-gray-700 w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent className="bg-darkBg border-gray-700">
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="takeaway">Takeaway</SelectItem>
              <SelectItem value="delivery">Delivery</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-darkCard border border-gray-800 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-800 hover:bg-transparent">
              <TableHead className="text-gray-400">Order ID</TableHead>
              <TableHead className="text-gray-400">Customer</TableHead>
              <TableHead className="text-gray-400">Total</TableHead>
              <TableHead className="text-gray-400">Date</TableHead>
              <TableHead className="text-gray-400">Type</TableHead>
              <TableHead className="text-gray-400">Status</TableHead>
              <TableHead className="text-gray-400 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-400">
                  Loading orders...
                </TableCell>
              </TableRow>
            ) : filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-400">
                  No orders found
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <TableRow key={order.id} className="hover:bg-darkCard/50 border-gray-800">
                  <TableCell className="font-medium text-white">{order.id}</TableCell>
                  <TableCell>
                    <div>
                      <div className="text-white">{order.customer}</div>
                      <div className="text-gray-400 text-sm">{order.phone}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-white">₹{order.total}</TableCell>
                  <TableCell className="text-white">{formatDate(order.date)}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs ${
                      order.orderType === "delivery" 
                        ? "bg-blue-900/30 text-blue-400" 
                        : "bg-purple-900/30 text-purple-400"
                    }`}>
                      {order.orderType ? order.orderType.charAt(0).toUpperCase() + order.orderType.slice(1) : "Takeaway"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20"
                      onClick={() => handleViewDetails(order)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {showDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-darkCard border border-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-playfair text-white mb-1">
                    Order Details: {selectedOrder.id}
                  </h3>
                  <p className="text-gray-400">{formatDate(selectedOrder.date)}</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowDetails(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </Button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-gray-400 text-sm mb-1">Customer</h4>
                    <p className="text-white">{selectedOrder.customer}</p>
                    <p className="text-gray-400">{selectedOrder.phone}</p>
                  </div>
                  <div>
                    <h4 className="text-gray-400 text-sm mb-1">Status</h4>
                    <Select 
                      value={selectedOrder.status} 
                      onValueChange={(value) => {
                        updateOrderStatus(selectedOrder.id, value);
                        setSelectedOrder({...selectedOrder, status: value});
                      }}
                    >
                      <SelectTrigger className="bg-darkBg border-gray-700">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent className="bg-darkBg border-gray-700">
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="ready">Ready</SelectItem>
                        <SelectItem value="preparing">Preparing</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <h4 className="text-gray-400 text-sm mb-1">Payment Method</h4>
                    <p className="text-white">{selectedOrder.paymentMethod}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-gray-400 text-sm mb-2">Order Items</h4>
                  <div className="border border-gray-800 rounded-md overflow-hidden">
                    <Table>
                      <TableHeader className="bg-darkBg">
                        <TableRow className="border-gray-800">
                          <TableHead className="text-white">Item</TableHead>
                          <TableHead className="text-white text-right">Qty</TableHead>
                          <TableHead className="text-white text-right">Price</TableHead>
                          <TableHead className="text-white text-right">Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedOrder.items.map((item: any, index: number) => (
                          <TableRow key={index} className="border-gray-800">
                            <TableCell className="text-white">{item.name}</TableCell>
                            <TableCell className="text-white text-right">{item.quantity}</TableCell>
                            <TableCell className="text-white text-right">₹{item.price}</TableCell>
                            <TableCell className="text-white text-right">
                              ₹{item.price * item.quantity}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                <div className="border-t border-gray-800 pt-4">
                  <div className="flex justify-between text-white">
                    <span>Subtotal</span>
                    <span>₹{selectedOrder.total - selectedOrder.gst}</span>
                  </div>
                  <div className="flex justify-between text-white mt-1">
                    <span>GST</span>
                    <span>₹{selectedOrder.gst}</span>
                  </div>
                  <div className="flex justify-between font-bold text-gold text-lg mt-2">
                    <span>Total</span>
                    <span>₹{selectedOrder.total}</span>
                  </div>
                  <div className="text-xs text-gray-400 mt-2">
                    <p>GST No: 33AYZPR6673D2ZP</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;









