import React, { useState } from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import { Stats, About } from './components/AboutStats';
import { AboutDetails } from './components/AboutDetails';
import { ConferenceAndAwards } from './components/Conference';
import { Speakers } from './components/Speakers';
import { LiveStream } from './components/LiveStream';
import { VotingPortal } from './components/VotingPortal';
import { NominationForm } from './components/NominationForm';
import { MapVenue } from './components/MapVenue';
import { FAQ } from './components/FAQ';
import { Gallery } from './components/Gallery';
import { Tickets } from './components/Tickets';
import { Footer } from './components/Footer';
import { RegistrationWizard } from './components/RegistrationWizard';

export default function App() {
  const [activeRegCategory, setActiveRegCategory] = useState<string | null>(null);

  return (
    <div className="bg-dark text-ivory">
      <Navigation />
      <main>
        <Hero />
        <Stats />
        <About />
        <AboutDetails />
        <LiveStream />
        <ConferenceAndAwards />
        <Speakers />
        <NominationForm />
        <VotingPortal />
        <MapVenue />
        <FAQ />
        <Gallery />
        <Tickets onBook={(category) => setActiveRegCategory(category)} />
      </main>
      <Footer />

      {activeRegCategory !== null && (
        <RegistrationWizard 
          initialCategory={activeRegCategory} 
          onClose={() => setActiveRegCategory(null)} 
        />
      )}
    </div>
  );
}
