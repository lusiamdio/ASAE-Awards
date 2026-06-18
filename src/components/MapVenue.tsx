import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Hotel, Navigation2, Plane } from 'lucide-react';

const accommodations = [
  { name: 'The Michelangelo Hotel', dist: '0.2 km from venue', desc: '5-star Renaissance-style luxury.' },
  { name: 'Sandton Sun', dist: '0.3 km from venue', desc: 'Direct access to Sandton City.' },
  { name: 'DaVinci Hotel & Suites', dist: '0.5 km from venue', desc: 'Contemporary elegance on Nelson Mandela Square.' }
];

export function MapVenue() {
  return (
    <section className="bg-dark py-24 px-6 md:px-12 border-t border-white/5" id="venue">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="font-sans font-bold text-[10px] tracking-[5px] uppercase text-sa-green flex items-center justify-center gap-4 mb-5">
            <span className="w-8 h-px bg-sa-green"></span>
            Location & Logistics
            <span className="w-8 h-px bg-sa-green"></span>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-bold leading-[1.15] text-ivory">
            Gala <span className="text-gold">Venue</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Information Side */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-12"
          >
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-dark-card border border-white/10 flex items-center justify-center text-gold">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="font-serif text-2xl font-bold text-ivory">Sandton Convention Centre</h3>
                  <p className="font-sans text-sm text-dim uppercase tracking-widest mt-1">Johannesburg, South Africa</p>
                </div>
              </div>
              <p className="font-sans text-dim leading-relaxed ml-16">
                Situated in the heart of Johannesburg's business district, the Sandton Convention Centre offers world-class facilities fitting for the celebration of continuous Pan-African excellence.
              </p>
            </div>

            <div className="ml-16">
              <h4 className="font-sans font-bold text-xs uppercase tracking-widest text-gold mb-6 flex items-center gap-2">
                <Hotel size={16} /> Partner Accommodation
              </h4>
              <div className="space-y-6">
                {accommodations.map((hotel, idx) => (
                  <div key={idx} className="bg-dark-card border border-white/5 p-4 rounded-xl hover:border-gold/30 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="font-serif font-bold text-ivory text-lg">{hotel.name}</h5>
                      <span className="font-sans text-[10px] tracking-wider text-sa-green bg-sa-green/10 px-2 py-1 rounded-md border border-sa-green/20">
                        {hotel.dist}
                      </span>
                    </div>
                    <p className="font-sans text-xs text-dim">{hotel.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="ml-16 flex gap-4">
              <button className="flex items-center gap-2 px-6 py-3 bg-gold hover:bg-gold-light text-dark font-sans text-xs font-bold tracking-widest uppercase rounded-lg transition-colors">
                <Navigation2 size={16} /> Get Directions
              </button>
              <button className="flex items-center gap-2 px-6 py-3 border border-white/10 hover:border-ivory/30 text-ivory font-sans text-xs font-bold tracking-widest uppercase rounded-lg transition-colors">
                <Plane size={16} /> Travel Guide
              </button>
            </div>
          </motion.div>

          {/* Map Side */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="w-full aspect-square lg:aspect-[4/3] bg-dark-card border border-white/10 rounded-2xl overflow-hidden relative shadow-2xl p-2"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-angola-red/5 to-sa-green/5 pointer-events-none z-10 rounded-2xl border border-white/5 mix-blend-overlay"></div>
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3583.4735232707255!2d28.05193!3d-26.1042595!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1e950c950ee0b66b%3A0xc3c5dc32832851ee!2sSandton%20Convention%20Centre!5e0!3m2!1sen!2sza!4v1690000000000!5m2!1sen!2sza" 
              width="100%" 
              height="100%" 
              style={{ border: 0, filter: 'grayscale(80%) invert(90%) hue-rotate(180deg) contrast(1.1)' }} 
              allowFullScreen={false} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded-xl w-full h-full"
            ></iframe>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
