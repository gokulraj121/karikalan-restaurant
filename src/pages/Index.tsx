
import Address from "@/components/Address";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Menu from "@/components/Menu";
import Navbar from "@/components/Navbar";
import Takeaway from "@/components/Takeaway";

const Index = () => {
  return (
    <div className="min-h-screen bg-darkBg text-white">
      <Navbar />
      <Hero />
      <Menu />
      <Address />
      <section id="takeaway">
        <Takeaway />
      </section>
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;


