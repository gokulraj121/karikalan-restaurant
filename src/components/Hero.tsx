
import { Button } from "@/components/ui/button";

const Hero = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      className="relative h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 bg-black">
        <div 
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1500')] bg-cover bg-center"
          style={{ opacity: 0.6 }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-darkBg"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-playfair text-white mb-4 sm:mb-6">
          Authentic South Indian Cuisine
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto">
          Experience the rich flavors and traditional recipes of South India, crafted with care and served with love.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={() => scrollToSection("menu")}
            className="bg-gold hover:bg-gold/80 text-darkBg font-medium"
          >
            View Menu
          </Button>
          <Button
            onClick={() => scrollToSection("takeaway")}
            variant="outline"
            className="border-gold text-gold hover:bg-gold/10"
          >
            Order Takeaway
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;

