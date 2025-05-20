
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Phone, Mail, Facebook, Instagram, MapPin } from "lucide-react";

const Contact = () => {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form validation
    if (!name || !email || !message) {
      toast({
        title: "Please fill all fields",
        variant: "destructive",
      });
      return;
    }
    
    // Submit logic would go here
    toast({
      title: "Message sent successfully!",
      description: "We'll get back to you soon.",
    });
    
    // Reset form
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <section id="contact" className="section-padding">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="section-heading">Contact Us</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Have questions or feedback? Reach out to us and we'll get back to you soon.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-5xl mx-auto">
          {/* Contact Form */}
          <div className="bg-darkCard p-8 rounded-lg">
            <h3 className="font-playfair text-2xl text-white mb-6">Send a Message</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white">Name</Label>
                <Input
                  id="name"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-darkBg border-gray-700 focus:border-gold"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-darkBg border-gray-700 focus:border-gold"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message" className="text-white">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Your Message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="bg-darkBg border-gray-700 focus:border-gold min-h-[150px]"
                />
              </div>
              
              <Button
                type="submit"
                className="bg-gold hover:bg-gold/80 text-darkBg font-medium w-full"
              >
                Send Message
              </Button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="bg-darkCard p-8 rounded-lg flex flex-col justify-between">
            <div>
              <h3 className="font-playfair text-2xl text-white mb-6">Get in Touch</h3>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <Phone className="text-gold w-6 h-6 mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-medium mb-1">Phone</h4>
                    <p className="text-gray-300">+91 7708935337, +91 7200835337</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Mail className="text-gold w-6 h-6 mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-medium mb-1">Email</h4>
                    <p className="text-gray-300">karikalanrestaurant123@gmail.com</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="text-gold w-6 h-6 mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-medium mb-1">Address</h4>
                    <p className="text-gray-300">
                      No.1, G.N.T Road, Gummidipoondi, Verkadu, 
                      <br />Tiruvallur, Tamil Nadu - 601201
                    </p>
                    <p className="text-gray-300 mt-2">
                      <span className="font-medium">GST No:</span> 33AYZPR6673D2ZP
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-10">
              <h4 className="text-white font-medium mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="bg-darkBg w-12 h-12 rounded-full flex items-center justify-center text-gold hover:bg-gold hover:text-darkBg transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="bg-darkBg w-12 h-12 rounded-full flex items-center justify-center text-gold hover:bg-gold hover:text-darkBg transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
