
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const AdminNavbar = () => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    // Clear auth state
    localStorage.removeItem("adminAuth");
    navigate("/admin/login");
  };

  return (
    <header className="bg-darkCard border-b border-gray-800 sticky top-0 z-40">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/admin" className="font-playfair text-2xl text-gold">
          Karikalan Admin
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link 
            to="/admin" 
            className="text-white hover:text-gold transition-colors"
          >
            Dashboard
          </Link>
          <Link 
            to="/admin/orders" 
            className="text-white hover:text-gold transition-colors"
          >
            Orders
          </Link>
          <Link 
            to="/admin/offers" 
            className="text-white hover:text-gold transition-colors"
          >
            Offers
          </Link>
          <Link 
            to="/admin/discounts" 
            className="text-white hover:text-gold transition-colors"
          >
            Discounts
          </Link>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleLogout}
            className="text-white hover:text-red-500"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </nav>

        {/* Mobile Navigation */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="sm">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-64 bg-darkBg border-gray-800">
            <nav className="flex flex-col space-y-4 mt-8">
              <Link 
                to="/admin" 
                className="text-white hover:text-gold transition-colors py-2 px-4 rounded hover:bg-darkCard"
              >
                Dashboard
              </Link>
              <Link 
                to="/admin/orders" 
                className="text-white hover:text-gold transition-colors py-2 px-4 rounded hover:bg-darkCard"
              >
                Orders
              </Link>
              <Link 
                to="/admin/offers" 
                className="text-white hover:text-gold transition-colors py-2 px-4 rounded hover:bg-darkCard"
              >
                Offers
              </Link>
              <Link 
                to="/admin/discounts" 
                className="text-white hover:text-gold transition-colors py-2 px-4 rounded hover:bg-darkCard"
              >
                Discounts
              </Link>
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={handleLogout}
                className="mt-4 w-full"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default AdminNavbar;
