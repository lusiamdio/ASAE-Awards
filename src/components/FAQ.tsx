import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus, HelpCircle } from 'lucide-react';

const faqs = [
  { 
    q: "Who is eligible to vote in the ASAE Awards?", 
    a: "Voting is restricted to registered delegates, verified industry professionals, and members of our advisory council. Each registered member will receive a unique cryptographic token for the secure voting portal to ensure absolute transparency and integrity." 
  },
  { 
    q: "Where is the gala event taking place?", 
    a: "The 2026 ASAE Gala will be held at the prestigious V&A Waterfront in Cape Town, South Africa. Detailed access maps, VIP entry points, and logistical instructions are provided in the Delegate Portal upon ticket confirmation." 
  },
  { 
    q: "What is the dress code for the Gala Event?", 
    a: "The dress code is Black Tie / Haute Couture. We highly encourage our guests to incorporate elegant elements of Angolan and South African cultural heritage into their formal wear, showcasing the richness of our shared diaspora." 
  },
  { 
    q: "Are there accommodation partnerships available for international attendees?", 
    a: "Yes. We have hospitality rates and room blocks with premium partners including The Table Bay Hotel, The Silo Hotel, and Radisson Red Cape Town. Please use the exclusive booking code provided in your ticket confirmation email when reserving." 
  },
  { 
    q: "How does the professional nomination process work?", 
    a: "Nominations can be submitted via our secure online Professional Nomination Form. All submissions are initially vetted for merit and authenticity by our screening committee before being passed to the independent Jury Panel for final scoring." 
  }
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="bg-dark-soft py-24 px-6 md:px-12 border-t border-white/5" id="faq">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="font-sans font-bold text-[10px] tracking-[5px] uppercase text-gold flex items-center justify-center gap-4 mb-5">
            <span className="w-8 h-px bg-gold"></span>
            Information
            <span className="w-8 h-px bg-gold"></span>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-bold leading-[1.15] text-ivory">
            Frequently Asked <span className="text-gold">Questions</span>
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className={`bg-dark border rounded-xl overflow-hidden transition-all duration-300 ${isOpen ? 'border-gold/30 shadow-lg shadow-gold/5' : 'border-white/5 hover:border-white/10'}`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full px-6 py-6 flex items-center justify-between gap-6 text-left"
                >
                  <div className="flex items-center gap-4 text-ivory">
                    <HelpCircle size={18} className={isOpen ? 'text-gold' : 'text-dim'} />
                    <span className="font-serif font-bold text-lg">{faq.q}</span>
                  </div>
                  <div className="shrink-0 text-gold">
                    {isOpen ? <Minus size={20} /> : <Plus size={20} />}
                  </div>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-0 ml-10">
                        <div className="h-px w-full bg-white/5 mb-6"></div>
                        <p className="font-sans text-sm md:text-base text-dim leading-relaxed">
                          {faq.a}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
