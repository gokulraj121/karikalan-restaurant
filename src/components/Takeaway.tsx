
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import { push, ref, set } from "firebase/database";
import React, { useEffect, useState } from "react";

// Add geolocation functionality

// Define the TakeawayItem interface
interface TakeawayItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

// Create a global variable to store the current order
let currentOrder: TakeawayItem[] = [];

// Function to add items to the takeaway order
export const addToTakeawayOrder = (
  id: string,
  quantity: number,
  name: string,
  price: number
) => {
  // Check if the item already exists in the order
  const existingItemIndex = currentOrder.findIndex(item => item.id === id);
  
  if (existingItemIndex >= 0) {
    // Update quantity if item exists
    currentOrder[existingItemIndex].quantity += quantity;
  } else {
    // Add new item if it doesn't exist
    currentOrder.push({ id, name, price, quantity });
  }
  
  // Dispatch an event to notify listeners that the order has changed
  window.dispatchEvent(new CustomEvent('addToTakeaway'));
  
  // Return the updated order
  return [...currentOrder];
};

// Function to get the current order
export const getCurrentOrder = (): TakeawayItem[] => {
  return [...currentOrder];
};

// Function to clear the current order
export const clearTakeawayOrder = () => {
  currentOrder = [];
  window.dispatchEvent(new CustomEvent('addToTakeaway'));
  return [];
};

// Sample menu items - replace with your actual menu data
const menuItems = [
  { id: 1, name: "Chicken Biryani", price: 250, category: "Main Course" },
  { id: 2, name: "Mutton Biryani", price: 350, category: "Main Course" },
  { id: 3, name: "Veg Biryani", price: 200, category: "Main Course" },
  // Add more menu items as needed
];

const Takeaway = () => {
  const [cart, setCart] = useState<{id: number, name: string, price: number, quantity: number}[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [orderType, setOrderType] = useState("takeaway"); // "takeaway" or "delivery"
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState("");

  // Add state for location
  const [userLocation, setUserLocation] = useState({ lat: "", lng: "" });

  // Add function to get user location
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude.toString(),
            lng: position.coords.longitude.toString()
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          toast({
            title: "Location error",
            description: "Could not get your location. Please enter your address manually.",
            variant: "destructive",
          });
        }
      );
    } else {
      toast({
        title: "Location not supported",
        description: "Your browser doesn't support geolocation. Please enter your address manually.",
        variant: "destructive",
      });
    }
  };

  // Add useEffect to get location when delivery is selected
  useEffect(() => {
    if (orderType === "delivery") {
      getUserLocation();
    }
  }, [orderType]);

  // Use the current takeaway order if available
  React.useEffect(() => {
    // Convert the currentOrder to the format expected by the cart state
    const takeawayItems = getCurrentOrder().map(item => ({
      id: parseInt(item.id) || Math.random(), // Convert string ID to number or use random
      name: item.name,
      price: item.price,
      quantity: item.quantity
    }));
    
    if (takeawayItems.length > 0) {
      setCart(takeawayItems);
    }
    
    // Listen for changes to the order
    const handleOrderChange = () => {
      const takeawayItems = getCurrentOrder().map(item => ({
        id: parseInt(item.id) || Math.random(),
        name: item.name,
        price: item.price,
        quantity: item.quantity
      }));
      
      setCart(takeawayItems);
    };
    
    window.addEventListener('addToTakeaway', handleOrderChange);
    
    return () => {
      window.removeEventListener('addToTakeaway', handleOrderChange);
    };
  }, []);

  const addToCart = (item: {id: number, name: string, price: number}) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    
    if (existingItem) {
      setCart(cart.map(cartItem => 
        cartItem.id === item.id 
          ? {...cartItem, quantity: cartItem.quantity + 1} 
          : cartItem
      ));
    } else {
      setCart([...cart, {...item, quantity: 1}]);
    }
    
    // Also add to the global takeaway order
    addToTakeawayOrder(item.id.toString(), 1, item.name, item.price);
    
    toast({
      title: "Added to cart",
      description: `${item.name} added to your order`,
    });
  };

  const removeFromCart = (itemId: number) => {
    setCart(cart.filter(item => item.id !== itemId));
    
    // Update the global order by setting quantity to 0
    const itemToRemove = cart.find(item => item.id === itemId);
    if (itemToRemove) {
      addToTakeawayOrder(itemId.toString(), -itemToRemove.quantity, itemToRemove.name, itemToRemove.price);
    }
  };

  const updateQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    const itemToUpdate = cart.find(item => item.id === itemId);
    if (itemToUpdate) {
      const quantityDiff = newQuantity - itemToUpdate.quantity;
      
      setCart(cart.map(item => 
        item.id === itemId ? {...item, quantity: newQuantity} : item
      ));
      
      // Update the global order
      addToTakeawayOrder(itemId.toString(), quantityDiff, itemToUpdate.name, itemToUpdate.price);
    }
  };

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateGST = () => {
    return calculateSubtotal() * 0.05; // 5% GST
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateGST();
  };

  // Add state to store order details for confirmation
  const [orderDetails, setOrderDetails] = useState<{
    items: {id: number, name: string, price: number, quantity: number}[];
    subtotal: number;
    gst: number;
    total: number;
  } | null>(null);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (cart.length === 0) {
      toast({
        title: "Empty cart",
        description: "Please add items to your order",
        variant: "destructive",
      });
      return;
    }
    
    if (!customerName || !phone) {
      toast({
        title: "Missing information",
        description: "Please provide your name and phone number",
        variant: "destructive",
      });
      return;
    }
    
    // Validate address for delivery orders
    if (orderType === "delivery" && !address) {
      toast({
        title: "Missing address",
        description: "Please provide your delivery address",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Calculate totals before submitting
      const subtotalAmount = calculateSubtotal();
      const gstAmount = calculateGST();
      const totalAmount = calculateTotal();
      
      // Save current cart for confirmation screen
      const orderItems = [...cart];
      
      // Prepare order data with proper formatting
      const orderData = {
        customer: customerName,
        phone: phone,
        address: orderType === "takeaway" ? "Pickup" : address,
        orderType: orderType,
        location: orderType === "delivery" ? userLocation : null,
        items: orderItems.map(item => ({
          name: item.name,
          price: Number(item.price),
          quantity: Number(item.quantity)
        })),
        subtotal: Number(subtotalAmount),
        gst: Number(gstAmount),
        total: Number(totalAmount),
        paymentMethod: paymentMethod,
        status: "pending",
        date: new Date().toISOString()
      };
      
      console.log("Submitting order data:", orderData);
      
      // Save to Firebase
      const ordersRef = ref(db, 'orders');
      const newOrderRef = push(ordersRef);
      await set(newOrderRef, orderData);
      
      // Get the order ID (key)
      const newOrderId = newOrderRef.key;
      setOrderId(newOrderId || "");
      
      // Set order as complete to show confirmation
      setOrderComplete(true);
      
      // Set order details for confirmation screen
      setOrderDetails({
        items: orderItems,
        subtotal: subtotalAmount,
        gst: gstAmount,
        total: totalAmount
      });
      
      // Clear the global takeaway order AFTER setting orderComplete
      // This ensures the cart data is still available for the confirmation screen
      clearTakeawayOrder();
      
      toast({
        title: "Order placed successfully",
        description: `Your order #${newOrderId?.substring(0, 6)} has been placed.`,
      });
    } catch (error: any) {
      console.error("Error placing order:", error);
      
      // Check if it's a permission error
      if (error.code === "PERMISSION_DENIED" || 
          error.message?.includes("permission_denied") || 
          error.message?.includes("Permission denied")) {
        toast({
          title: "Permission denied",
          description: "You don't have permission to place orders. Please contact the administrator.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error placing order",
          description: error.message || "Please try again later",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNewOrder = () => {
    // Reset all states to start a new order
    setCart([]);
    setCustomerName("");
    setPhone("");
    setAddress("");
    setOrderType("takeaway");
    setPaymentMethod("cash");
    setOrderComplete(false);
    setOrderId("");
    setOrderDetails(null);
  };

  // QR code data - includes order ID and basic info
  const qrCodeData = orderId ? 
    JSON.stringify({
      orderId: orderId,
      customer: customerName,
      total: calculateTotal().toFixed(2),
      type: orderType
    }) : "";

  return (
    <div className="bg-darkBg section-padding">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="section-heading">Order Online</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Enjoy our delicious food in the comfort of your home or pick it up at our restaurant.
          </p>
        </div>

        {orderComplete ? (
          // Order Confirmation Screen - Mobile Friendly
          <div className="max-w-md mx-auto bg-darkCard p-4 sm:p-8 rounded-lg border border-gray-800">
            <div className="text-center">
              <div className="w-14 h-14 bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-medium text-white mb-2">Order Confirmed!</h3>
              <p className="text-sm text-gray-400 mb-4">Thank you for your order. We'll prepare it right away.</p>
              
              <div className="bg-darkBg p-3 sm:p-4 rounded-lg mb-4">
                <div className="flex justify-between items-center mb-3">
                  <p className="text-white font-medium text-sm">Order ID:</p>
                  <p className="text-gold text-lg font-bold">#{orderId.substring(0, 6)}</p>
                </div>
                
                <div className="border-t border-gray-700 pt-3 mt-2">
                  <h4 className="text-white font-medium text-left text-sm mb-2">Order Details</h4>
                  
                  {/* Ordered Items */}
                  <div className="space-y-1.5 mb-3 max-h-40 overflow-y-auto">
                    {orderDetails?.items.map(item => (
                      <div key={item.id} className="flex justify-between text-left text-sm">
                        <span className="text-gray-300">{item.quantity}x {item.name}</span>
                        <span className="text-white">₹{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Bill Summary */}
                  <div className="border-t border-gray-700 pt-2 mt-2">
                    <div className="flex justify-between text-left text-xs sm:text-sm text-gray-300">
                      <span>Subtotal</span>
                      <span>₹{orderDetails?.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-left text-xs sm:text-sm text-gray-300 mt-1">
                      <span>GST (5%)</span>
                      <span>₹{orderDetails?.gst.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-left font-bold text-gold mt-2">
                      <span>Total</span>
                      <span>₹{orderDetails?.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-xs text-gray-400 mt-3 text-center">
                  {orderType === "takeaway" 
                    ? "Please show your Order ID when you arrive to pick up your order." 
                    : "Our delivery person will confirm your order with this Order ID."}
                </p>
              </div>
              
              <div className="text-left mb-4 text-sm bg-darkBg p-3 rounded-lg">
                <h4 className="text-white font-medium mb-2">Customer Details</h4>
                <div className="grid grid-cols-2 gap-x-2 gap-y-1.5">
                  <span className="text-gray-400">Name:</span>
                  <span className="text-white text-right">{customerName}</span>
                  
                  <span className="text-gray-400">Phone:</span>
                  <span className="text-white text-right">{phone}</span>
                  
                  {orderType === "delivery" && (
                    <>
                      <span className="text-gray-400">Address:</span>
                      <span className="text-white text-right break-words">{address}</span>
                    </>
                  )}
                  
                  <span className="text-gray-400">Order Type:</span>
                  <span className="text-white text-right capitalize">{orderType}</span>
                  
                  <span className="text-gray-400">Payment:</span>
                  <span className="text-white text-right">Cash on {orderType === "delivery" ? "Delivery" : "Pickup"}</span>
                </div>
              </div>
              
              <Button 
                onClick={handleNewOrder}
                className="w-full bg-gold hover:bg-gold/80 text-darkBg text-sm py-2"
              >
                Place Another Order
              </Button>
            </div>
          </div>
        ) : (
          // Order Form - Mobile Friendly
          <div className="grid grid-cols-1 gap-6">
            {/* Menu Items */}
            <div className="bg-darkCard p-4 sm:p-6 rounded-lg">
              <h3 className="text-lg font-medium text-white mb-3">Menu</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {menuItems.map(item => (
                  <div key={item.id} className="flex justify-between items-center p-3 border border-gray-800 rounded-lg">
                    <div>
                      <h4 className="text-white font-medium text-sm">{item.name}</h4>
                      <p className="text-gold text-sm">₹{item.price}</p>
                    </div>
                    <Button 
                      onClick={() => addToCart(item)}
                      className="bg-gold hover:bg-gold/80 text-darkBg text-xs h-8 px-3"
                    >
                      Add
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-darkCard p-4 sm:p-6 rounded-lg">
              <h3 className="text-lg font-medium text-white mb-3">Your Order</h3>
              
              {cart.length === 0 ? (
                <p className="text-gray-400 mb-4 text-sm">Your cart is empty</p>
              ) : (
                <div className="space-y-3 mb-4">
                  <div className="max-h-48 overflow-y-auto space-y-2">
                    {cart.map(item => (
                      <div key={item.id} className="flex justify-between items-center pb-2 border-b border-gray-800">
                        <div className="mr-2 flex-1 min-w-0">
                          <p className="text-white text-sm truncate">{item.name}</p>
                          <p className="text-xs text-gray-400">₹{item.price} x {item.quantity}</p>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="h-6 w-6 p-0 border-gray-700 text-xs"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            -
                          </Button>
                          <span className="text-white text-sm w-4 text-center">{item.quantity}</span>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="h-6 w-6 p-0 border-gray-700 text-xs"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            +
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-red-500 hover:text-red-400 hover:bg-red-900/20 h-6 w-6 p-0"
                            onClick={() => removeFromCart(item.id)}
                          >
                            ✕
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="pt-2">
                    <div className="flex justify-between text-gray-300 text-sm">
                      <span>Subtotal</span>
                      <span>₹{calculateSubtotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-300 text-sm mt-1">
                      <span>GST (5%)</span>
                      <span>₹{calculateGST().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-gold text-base mt-2">
                      <span>Total</span>
                      <span>₹{calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}
              
              <form onSubmit={handleSubmitOrder} className="space-y-3">
                {/* Order Type Selection */}
                <div className="mb-3">
                  <Label className="text-white text-sm mb-1.5 block">Order Type</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      type="button"
                      className={`${
                        orderType === "takeaway" 
                          ? "bg-gold text-darkBg" 
                          : "bg-darkBg text-white border border-gray-700"
                      } text-sm py-1.5 h-auto`}
                      onClick={() => setOrderType("takeaway")}
                    >
                      Takeaway
                    </Button>
                    <Button
                      type="button"
                      className={`${
                        orderType === "delivery" 
                          ? "bg-gold text-darkBg" 
                          : "bg-darkBg text-white border border-gray-700"
                      } text-sm py-1.5 h-auto`}
                      onClick={() => setOrderType("delivery")}
                    >
                      Delivery
                    </Button>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="name" className="text-white text-sm">Name</Label>
                  <Input 
                    id="name" 
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="bg-darkBg border-gray-700 mt-1 text-sm h-9"
                    placeholder="Your name"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone" className="text-white text-sm">Phone</Label>
                  <Input 
                    id="phone" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="bg-darkBg border-gray-700 mt-1 text-sm h-9"
                    placeholder="Your phone number"
                    required
                  />
                </div>
                
                {orderType === "delivery" && (
                  <div>
                    <Label htmlFor="address" className="text-white text-sm">Delivery Address</Label>
                    <Textarea 
                      id="address" 
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="bg-darkBg border-gray-700 mt-1 text-sm min-h-[60px]"
                      placeholder="Your delivery address"
                      required
                    />
                  </div>
                )}
                
                <Button
                  type="submit"
                  className="w-full bg-gold hover:bg-gold/80 text-darkBg mt-4 text-sm py-2"
                  disabled={isSubmitting || cart.length === 0}
                >
                  {isSubmitting ? "Processing..." : "Place Order"}
                </Button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Takeaway;






















