import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import { Stats, About } from './components/AboutStats';
import { AboutDetails } from './components/AboutDetails';
import { ConferenceAndAwards } from './components/Conference';
import { Speakers } from './components/Speakers';
import { LiveStream } from './components/LiveStream';
import { NewsPortal } from './components/NewsPortal';
import { VotingPortal } from './components/VotingPortal';
import { NominationForm } from './components/NominationForm';
import { MapVenue } from './components/MapVenue';
import { FAQ } from './components/FAQ';
import { Gallery } from './components/Gallery';
import { Tickets } from './components/Tickets';
import { Footer } from './components/Footer';
import { RegistrationWizard } from './components/RegistrationWizard';
import { CompanyPage, PageTab } from './components/CompanyPage';
import { ToastProvider } from './components/Toast';

export default function App() {
  const [activeRegCategory, setActiveRegCategory] = useState<string | null>(null);
  const [currentHash, setCurrentHash] = useState<string>('');

  useEffect(() => {
    // Read initial hash
    setCurrentHash(window.location.hash);

    const handleHashChange = () => {
      setCurrentHash(window.location.hash);
      // Automatically scroll to top on hash navigational views to make them feel like native pages
      if (['#media', '#sponsorship', '#privacy', '#terms'].includes(window.location.hash)) {
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Determine if we should display a standalone document page
  const isDocPage = ['#media', '#sponsorship', '#privacy', '#terms'].includes(currentHash);
  const matchedTab = currentHash.replace('#', '') as PageTab;

  if (isDocPage) {
    return (
      <ToastProvider>
        <CompanyPage 
          initialTab={matchedTab} 
          onNavigateHome={() => {
            window.location.hash = '';
            setCurrentHash('');
          }} 
        />
      </ToastProvider>
    );
  }

  return (
    <ToastProvider>
      <div className="bg-dark text-ivory">
        <Navigation />
        <main>
          <Hero />
          <Stats />
          <About />
          <AboutDetails />
          <LiveStream />
          <NewsPortal />
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
    </ToastProvider>
  );
}
