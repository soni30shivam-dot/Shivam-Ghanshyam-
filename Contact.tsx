import { MapPin, Phone, Instagram, Navigation } from 'lucide-react';
import { motion } from 'motion/react';

export default function Contact() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold font-sans tracking-tight text-gray-900 mb-4">Contact Us</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Visit our store in Champa for the best deals, or reach out to us on WhatsApp for orders and inquiries.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100"
        >
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Store Information</h2>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-blue-50 p-3 rounded-full text-blue-600 shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Address</h3>
                <p className="text-gray-600 leading-relaxed">
                  Ghanshyam Bag<br />
                  Champa, Chhattisgarh 495671<br />
                  India
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="bg-blue-50 p-3 rounded-full text-blue-600 shrink-0">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Phone & WhatsApp</h3>
                <p className="text-gray-600">+91 81099 50542</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-blue-50 p-3 rounded-full text-blue-600 shrink-0">
                <Instagram className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Instagram</h3>
                <a href="https://www.instagram.com/ghanshyam_bag_champa" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  @ghanshyam_bag_champa
                </a>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <a href="tel:+918109950542" className="flex-1 bg-white border-2 border-gray-200 text-gray-800 text-center py-3 rounded-xl font-bold hover:bg-gray-50 transition">Call Now</a>
            <a href="https://wa.me/918109950542" target="_blank" rel="noopener noreferrer" className="flex-1 bg-[#25D366] text-white text-center py-3 rounded-xl font-bold hover:bg-[#20bd5a] transition">WhatsApp Chat</a>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col h-[400px] lg:h-auto bg-gray-50 relative group"
        >
          {/* We embed a Google Map placeholder or actual map iframe */}
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14781.082728771141!2d82.6468753!3d22.0465354!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3988aac0e43ab40d%3A0xc3f58a8a6af6256c!2sGhanshyam%20Bag!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
            width="100%" 
            height="100%" 
            style={{ border: 0, flex: 1 }} 
            allowFullScreen={true} 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Google Maps Location"
          ></iframe>
          
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
             <a href="https://maps.app.goo.gl/pCde1yc2bjKS1Bhi9?g_st=ac" target="_blank" rel="noopener noreferrer" className="bg-white/90 backdrop-blur px-6 py-3 rounded-full shadow-lg font-bold text-gray-900 flex items-center gap-2 hover:bg-white hover:scale-105 transition">
               <Navigation className="w-5 h-5 text-blue-600" />
               Open in Google Maps
             </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
