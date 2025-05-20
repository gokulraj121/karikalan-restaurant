
import { Clock, MapPin, Phone } from "lucide-react";

const Address = () => {
  return (
    <section id="about" className="bg-darkCard section-padding">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="section-heading">Find Us</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Join us for an unforgettable dining experience or order a delicious takeaway meal.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Map - Updated with correct location */}
          <div className="h-[400px] rounded-lg overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3885.0724838019213!2d80.1022533!3d13.1539722!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5289d5a2c6d0c3%3A0x8f3a5d8f3a5d8f3a!2sGummidipoondi%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1716260186203!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Restaurant Location"
            ></iframe>
          </div>

          {/* Address Details - Updated with correct information */}
          <div className="bg-darkBg p-8 rounded-lg flex flex-col justify-center">
            <h3 className="font-playfair text-2xl text-white mb-6">Restaurant Details</h3>
            
            <div className="flex items-start mb-6">
              <MapPin className="text-gold w-6 h-6 mr-4 mt-1 flex-shrink-0" />
              <div>
                <h4 className="text-white font-medium mb-1">Address</h4>
                <p className="text-gray-300">
                  No.1, G.N.T Road, Gummidipoondi, Verkadu,<br />
                  Tiruvallur, Tamil Nadu - 601201
                </p>
              </div>
            </div>
            
            <div className="flex items-start mb-6">
              <Clock className="text-gold w-6 h-6 mr-4 mt-1 flex-shrink-0" />
              <div>
                <h4 className="text-white font-medium mb-1">Opening Hours</h4>
                <ul className="text-gray-300">
                  <li className="flex justify-between">
                    <span>Monday - Friday:</span>
                    <span>12:00 PM - 10:30 PM</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Saturday - Sunday:</span>
                    <span>11:00 AM - 11:00 PM</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="flex items-start">
              <Phone className="text-gold w-6 h-6 mr-4 mt-1 flex-shrink-0" />
              <div>
                <h4 className="text-white font-medium mb-1">Reservations</h4>
                <p className="text-gray-300">+91 7708935337, +91 7200835337</p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-700">
              <p className="text-gray-300">
                <span className="font-medium text-white">GST No:</span> 33AYZPR6673D2ZP
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Address;

