
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import { onValue, push, ref, remove, set } from "firebase/database";
import { Pencil, Plus, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";

interface Offer {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  startDate: string;
  endDate: string;
  active: boolean;
}

const AdminOffers = () => {
  const { toast } = useToast();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentOffer, setCurrentOffer] = useState<{
    id: string | number;
    title: string;
    description: string;
    imageUrl: string;
    startDate: string;
    endDate: string;
    active: boolean;
  }>({
    id: 0,
    title: "",
    description: "",
    imageUrl: "",
    startDate: "",
    endDate: "",
    active: true
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const offersRef = ref(db, 'offers');
    const unsubscribe = onValue(offersRef, (snapshot) => {
      if (snapshot.exists()) {
        const offersData = snapshot.val();
        const offersArray = Object.keys(offersData).map(key => ({
          id: key,
          ...offersData[key]
        }));
        setOffers(offersArray);
      } else {
        setOffers([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAddNewClick = () => {
    setCurrentOffer({
      id: 0,
      title: "",
      description: "",
      imageUrl: "",
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      active: true
    });
    setIsEditing(true);
  };

  const handleEditClick = (offer: Offer) => {
    setCurrentOffer({ ...offer });
    setIsEditing(true);
  };

  const handleDeleteClick = (id: string) => {
    const offerRef = ref(db, `offers/${id}`);
    remove(offerRef)
      .then(() => {
        toast({
          title: "Success",
          description: "Offer deleted successfully.",
        });
      })
      .catch((error) => {
        toast({
          title: "Error deleting offer",
          description: error.message,
          variant: "destructive",
        });
      });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentOffer.title) {
      toast({
        title: "Missing information",
        description: "Please provide a title for the offer.",
        variant: "destructive",
      });
      return;
    }

    if (currentOffer.id === 0) {
      // Add new offer
      const offersRef = ref(db, 'offers');
      const newOfferRef = push(offersRef);
      const newOffer = { ...currentOffer };
      delete newOffer.id; // Remove the temporary ID
      
      set(newOfferRef, newOffer)
        .then(() => {
          toast({
            title: "Success",
            description: "Offer created successfully.",
          });
          setIsEditing(false);
        })
        .catch((error) => {
          toast({
            title: "Error creating offer",
            description: error.message,
            variant: "destructive",
          });
        });
    } else {
      // Update existing offer
      const offerRef = ref(db, `offers/${currentOffer.id}`);
      const updatedOffer = { ...currentOffer };
      delete updatedOffer.id; // Remove the ID from the data
      
      set(offerRef, updatedOffer)
        .then(() => {
          toast({
            title: "Success",
            description: "Offer updated successfully.",
          });
          setIsEditing(false);
        })
        .catch((error) => {
          toast({
            title: "Error updating offer",
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
    const offerRef = ref(db, `offers/${id}`);
    const updatedOffer = { ...offers.find(offer => offer.id === id), active: !offers.find(offer => offer.id === id).active };
    set(offerRef, updatedOffer)
      .then(() => {
        toast({
          title: "Success",
          description: "Offer status updated successfully.",
        });
      })
      .catch((error) => {
        toast({
          title: "Error updating offer status",
          description: error.message,
          variant: "destructive",
        });
      });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-playfair text-white">Offers</h1>
        <Button 
          className="bg-gold hover:bg-gold/80 text-darkBg"
          onClick={handleAddNewClick}
        >
          <Plus className="h-4 w-4 mr-2" /> Add New Offer
        </Button>
      </div>

      {isEditing ? (
        <Card className="bg-darkCard border-gray-800">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-white">Offer Title</Label>
                <Input
                  id="title"
                  value={currentOffer.title}
                  onChange={(e) => setCurrentOffer({...currentOffer, title: e.target.value})}
                  className="bg-darkBg border-gray-700 mt-1"
                  placeholder="Enter offer title"
                />
              </div>
              
              <div>
                <Label htmlFor="description" className="text-white">Description</Label>
                <Textarea
                  id="description"
                  value={currentOffer.description}
                  onChange={(e) => setCurrentOffer({...currentOffer, description: e.target.value})}
                  className="bg-darkBg border-gray-700 mt-1 h-24"
                  placeholder="Describe the offer details"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate" className="text-white">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={currentOffer.startDate}
                    onChange={(e) => setCurrentOffer({...currentOffer, startDate: e.target.value})}
                    className="bg-darkBg border-gray-700 mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="endDate" className="text-white">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={currentOffer.endDate}
                    onChange={(e) => setCurrentOffer({...currentOffer, endDate: e.target.value})}
                    className="bg-darkBg border-gray-700 mt-1"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  id="active"
                  type="checkbox"
                  checked={currentOffer.active}
                  onChange={(e) => setCurrentOffer({...currentOffer, active: e.target.checked})}
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
                  {currentOffer.id === 0 ? "Create Offer" : "Update Offer"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {offers.length === 0 ? (
            <div className="md:col-span-2 lg:col-span-3 text-center py-12 text-gray-400">
              No offers found. Create your first offer by clicking the "Add New Offer" button.
            </div>
          ) : (
            offers.map((offer) => (
              <Card key={offer.id} className={`bg-darkCard border-gray-800 ${!offer.active && 'opacity-70'}`}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-medium text-white mb-2">{offer.title}</h3>
                    <div className="flex space-x-1">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEditClick(offer)}
                        className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 h-8 w-8 p-0"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteClick(offer.id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-900/20 h-8 w-8 p-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <p className="text-gray-400 text-sm mb-4">{offer.description}</p>
                  
                  <div className="flex justify-between text-sm">
                    <div className="text-gray-400">
                      {new Date(offer.startDate).toLocaleDateString()} - {new Date(offer.endDate).toLocaleDateString()}
                    </div>
                    <Button
                      variant={offer.active ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleActive(offer.id)}
                      className={offer.active 
                        ? "bg-green-900/30 text-green-400 hover:bg-green-900/40 border border-green-800" 
                        : "border-gray-600 text-gray-400"
                      }
                    >
                      {offer.active ? "Active" : "Inactive"}
                    </Button>
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

export default AdminOffers;


