
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import { onValue, push, ref, remove, set } from "firebase/database";
import { Pencil, Plus, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";

interface Discount {
  id: string;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  minOrderValue: number;
  maxDiscount: number;
  startDate: string;
  endDate: string;
  description: string;
  active: boolean;
}

const AdminDiscounts = () => {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentDiscount, setCurrentDiscount] = useState<{
    id: string | number;
    code: string;
    type: "percentage" | "fixed";
    value: number;
    minOrderValue: number;
    maxDiscount: number;
    startDate: string;
    endDate: string;
    description: string;
    active: boolean;
  }>({
    id: 0,
    code: "",
    type: "percentage",
    value: 10,
    minOrderValue: 500,
    maxDiscount: 100,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    description: "",
    active: true,
  });
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const discountsRef = ref(db, 'discounts');
    const unsubscribe = onValue(discountsRef, (snapshot) => {
      if (snapshot.exists()) {
        const discountsData = snapshot.val();
        const discountsArray = Object.keys(discountsData).map(key => ({
          id: key,
          ...discountsData[key]
        }));
        setDiscounts(discountsArray);
      } else {
        setDiscounts([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAddNewClick = () => {
    setCurrentDiscount({
      id: 0,
      code: "",
      type: "percentage",
      value: 10,
      minOrderValue: 500,
      maxDiscount: 100,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      description: "",
      active: true,
    });
    setIsEditing(true);
  };

  const handleEditClick = (discount: Discount) => {
    setCurrentDiscount({ ...discount });
    setIsEditing(true);
  };

  const handleDeleteClick = (id: string) => {
    if (confirm("Are you sure you want to delete this discount?")) {
      const discountRef = ref(db, `discounts/${id}`);
      remove(discountRef)
        .then(() => {
          toast({
            title: "Discount deleted",
            description: "The discount has been successfully deleted.",
          });
        })
        .catch((error) => {
          toast({
            title: "Error deleting discount",
            description: error.message,
            variant: "destructive",
          });
        });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentDiscount.code) {
      toast({
        title: "Missing information",
        description: "Please provide a discount code.",
        variant: "destructive",
      });
      return;
    }

    if (currentDiscount.id === 0) {
      // Add new discount
      const isDuplicate = discounts.some(d => d.code === currentDiscount.code);
      if (isDuplicate) {
        toast({
          title: "Duplicate code",
          description: "This discount code already exists.",
          variant: "destructive",
        });
        return;
      }
      
      // Add to Firebase
      const discountsRef = ref(db, 'discounts');
      const newDiscountRef = push(discountsRef);
      const newDiscount = { ...currentDiscount };
      delete newDiscount.id; // Remove the temporary ID
      
      set(newDiscountRef, newDiscount)
        .then(() => {
          toast({
            title: "Success",
            description: "Discount created successfully.",
          });
          setIsEditing(false);
        })
        .catch((error) => {
          toast({
            title: "Error creating discount",
            description: error.message,
            variant: "destructive",
          });
        });
    } else {
      // Update existing discount
      const discountRef = ref(db, `discounts/${currentDiscount.id}`);
      const updatedDiscount = { ...currentDiscount };
      delete updatedDiscount.id; // Remove the ID from the data
      
      set(discountRef, updatedDiscount)
        .then(() => {
          toast({
            title: "Success",
            description: "Discount updated successfully.",
          });
          setIsEditing(false);
        })
        .catch((error) => {
          toast({
            title: "Error updating discount",
            description: error.message,
            variant: "destructive",
          });
        });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const toggleActive = (id: string) => {
    const discount = discounts.find(d => d.id === id);
    if (discount) {
      const discountRef = ref(db, `discounts/${id}`);
      set(discountRef, { ...discount, active: !discount.active })
        .then(() => {
          toast({
            title: "Status updated",
            description: `Discount ${discount.code} is now ${!discount.active ? 'active' : 'inactive'}.`,
          });
        })
        .catch((error) => {
          toast({
            title: "Error updating status",
            description: error.message,
            variant: "destructive",
          });
        });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-playfair text-white">Discounts</h1>
        <Button 
          className="bg-gold hover:bg-gold/80 text-darkBg"
          onClick={handleAddNewClick}
        >
          <Plus className="h-4 w-4 mr-2" /> Add New Discount
        </Button>
      </div>

      {isEditing ? (
        <Card className="bg-darkCard border-gray-800">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="code" className="text-white">Discount Code</Label>
                  <Input
                    id="code"
                    value={currentDiscount.code}
                    onChange={(e) => setCurrentDiscount({...currentDiscount, code: e.target.value.toUpperCase()})}
                    className="bg-darkBg border-gray-700 mt-1"
                    placeholder="e.g., SUMMER20"
                  />
                </div>
                
                <div>
                  <Label htmlFor="type" className="text-white">Discount Type</Label>
                  <Select
                    value={currentDiscount.type}
                    onValueChange={(value) => setCurrentDiscount({
                      ...currentDiscount, 
                      type: value as "percentage" | "fixed"
                    })}
                  >
                    <SelectTrigger className="bg-darkBg border-gray-700 mt-1">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="bg-darkBg border-gray-700">
                      <SelectItem value="percentage">Percentage (%)</SelectItem>
                      <SelectItem value="fixed">Fixed Amount (₹)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="value" className="text-white">
                    {currentDiscount.type === "percentage" ? "Percentage" : "Fixed Amount"}
                  </Label>
                  <Input
                    id="value"
                    type="number"
                    value={currentDiscount.value}
                    onChange={(e) => setCurrentDiscount({...currentDiscount, value: Number(e.target.value)})}
                    className="bg-darkBg border-gray-700 mt-1"
                    placeholder={currentDiscount.type === "percentage" ? "e.g., 10" : "e.g., 100"}
                  />
                </div>
                
                <div>
                  <Label htmlFor="minOrderValue" className="text-white">Min Order Value</Label>
                  <Input
                    id="minOrderValue"
                    type="number"
                    value={currentDiscount.minOrderValue}
                    onChange={(e) => setCurrentDiscount({...currentDiscount, minOrderValue: Number(e.target.value)})}
                    className="bg-darkBg border-gray-700 mt-1"
                    placeholder="e.g., 500"
                  />
                </div>
                
                <div>
                  <Label htmlFor="maxDiscount" className="text-white">Max Discount</Label>
                  <Input
                    id="maxDiscount"
                    type="number"
                    value={currentDiscount.maxDiscount}
                    onChange={(e) => setCurrentDiscount({...currentDiscount, maxDiscount: Number(e.target.value)})}
                    className="bg-darkBg border-gray-700 mt-1"
                    placeholder="e.g., 100"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="description" className="text-white">Description</Label>
                <Input
                  id="description"
                  value={currentDiscount.description}
                  onChange={(e) => setCurrentDiscount({...currentDiscount, description: e.target.value})}
                  className="bg-darkBg border-gray-700 mt-1"
                  placeholder="e.g., 20% off on orders above ₹500"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate" className="text-white">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={currentDiscount.startDate}
                    onChange={(e) => setCurrentDiscount({...currentDiscount, startDate: e.target.value})}
                    className="bg-darkBg border-gray-700 mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="endDate" className="text-white">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={currentDiscount.endDate}
                    onChange={(e) => setCurrentDiscount({...currentDiscount, endDate: e.target.value})}
                    className="bg-darkBg border-gray-700 mt-1"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  id="active"
                  type="checkbox"
                  checked={currentDiscount.active}
                  onChange={(e) => setCurrentDiscount({...currentDiscount, active: e.target.checked})}
                  className="h-4 w-4"
                />
                <Label htmlFor="active" className="text-white">Active</Label>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={handleCancel}
                  className="border-gray-600"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  className="bg-gold hover:bg-gold/80 text-darkBg"
                >
                  {currentDiscount.id === 0 ? "Create Discount" : "Update Discount"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {discounts.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              No discounts found. Create your first discount by clicking the "Add New Discount" button.
            </div>
          ) : (
            discounts.map((discount) => (
              <Card key={discount.id} className={`bg-darkCard border-gray-800 ${!discount.active && 'opacity-70'}`}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row justify-between">
                    <div>
                      <div className="flex items-center mb-2">
                        <h3 className="text-xl font-medium text-white mr-3">{discount.code}</h3>
                        <Button
                          variant={discount.active ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleActive(discount.id)}
                          className={discount.active 
                            ? "bg-green-900/30 text-green-400 hover:bg-green-900/40 border border-green-800" 
                            : "border-gray-600 text-gray-400"
                          }
                        >
                          {discount.active ? "Active" : "Inactive"}
                        </Button>
                      </div>
                      <p className="text-gray-400">{discount.description}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-2 mt-4 text-sm">
                        <div>
                          <p className="text-gray-400">Type</p>
                          <p className="text-white capitalize">{discount.type}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Value</p>
                          <p className="text-white">
                            {discount.type === "percentage" ? `${discount.value}%` : `₹${discount.value}`}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400">Min Order</p>
                          <p className="text-white">₹{discount.minOrderValue}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Max Discount</p>
                          <p className="text-white">₹{discount.maxDiscount}</p>
                        </div>
                      </div>
                      
                      <p className="text-gray-400 text-sm mt-4">
                        Valid: {new Date(discount.startDate).toLocaleDateString()} - {new Date(discount.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div className="flex mt-4 md:mt-0 md:ml-4">
                      <Button 
                        variant="ghost" 
                        onClick={() => handleEditClick(discount)}
                        className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 h-8 w-8 p-0 mr-1"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        onClick={() => handleDeleteClick(discount.id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-900/20 h-8 w-8 p-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDiscounts;

