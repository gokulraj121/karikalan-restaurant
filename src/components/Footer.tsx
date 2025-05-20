
import React from "react";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-darkCard py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Restaurant Logo & Info */}
          <div className="text-center md:text-left">
            <h3 className="font-playfair text-2xl text-gold mb-4">Karikalan</h3>
            <p className="text-gray-400">
              Experience the authentic taste of traditional cuisine in a modern setting.
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center">
            <h4 className="text-white font-medium mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {["home", "menu", "about", "contact", "takeaway"].map((item) => (
                <li key={item}>
                  <a
                    href={`#${item}`}
                    className="text-gray-400 hover:text-gold transition-colors capitalize"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Opening Hours */}
          <div className="text-center md:text-right">
            <h4 className="text-white font-medium mb-4">Opening Hours</h4>
            <ul className="text-gray-400 space-y-2">
              <li>Monday - Friday: 12:00 PM - 10:30 PM</li>
              <li>Saturday - Sunday: 11:00 AM - 11:00 PM</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 text-center">
          <p className="text-gray-500">
            &copy; {year} Karikalan Restaurant. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
