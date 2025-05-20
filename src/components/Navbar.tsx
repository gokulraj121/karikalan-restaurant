
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useEffect, useState } from "react";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-darkBg/95 backdrop-blur-sm shadow-lg py-2"
          : "bg-transparent py-3"
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <a href="#home" className="font-playfair text-xl sm:text-2xl font-bold text-white">
            Karikalan
          </a>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {["home", "menu", "about", "contact", "takeaway"].map((item) => (
            <a
              key={item}
              onClick={() => scrollToSection(item)}
              className="text-white hover:text-gold cursor-pointer transition-colors font-poppins capitalize"
            >
              {item}
            </a>
          ))}
          <Button
            onClick={() => scrollToSection("takeaway")}
            className="bg-gold hover:bg-gold/80 text-darkBg font-medium rounded-md"
          >
            Order Now
          </Button>
        </div>

        {/* Mobile Menu Toggle - Improved touch target */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:text-gold h-10 w-10"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-darkBg border-t border-gray-800 animate-fade-in">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            {["home", "menu", "about", "contact", "takeaway"].map((item) => (
              <a
                key={item}
                onClick={() => scrollToSection(item)}
                className="text-white hover:text-gold py-2 cursor-pointer transition-colors font-poppins capitalize"
              >
                {item}
              </a>
            ))}
            <Button
              onClick={() => scrollToSection("takeaway")}
              className="bg-gold hover:bg-gold/80 text-darkBg font-medium rounded-md w-full"
            >
              Order Now
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

