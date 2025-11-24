import React, { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { BentoGrid } from './components/BentoGrid';
import { Footer } from './components/Footer';
import { MenuOverlay } from './components/MenuOverlay';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // Handle Theme Toggle
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Smooth Scroll Anchor Handler
  useEffect(() => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const href = anchor.getAttribute('href');
        if (href) {
            const target = document.querySelector(href);
            if (target) {
              target.scrollIntoView({ behavior: 'smooth' });
              setIsMenuOpen(false); // Close menu if open
            }
        }
      });
    });
  }, []);

  return (
    <div className="bg-white dark:bg-neutral-950 min-h-screen w-full text-neutral-950 dark:text-white selection:bg-neutral-900 selection:text-white dark:selection:bg-white dark:selection:text-black overflow-x-hidden transition-colors duration-500">
      <Header 
        isMenuOpen={isMenuOpen} 
        toggleMenu={() => setIsMenuOpen(!isMenuOpen)}
        isDark={isDark}
        toggleTheme={() => setIsDark(!isDark)}
      />
      
      <MenuOverlay isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <main>
        <Hero />
        <BentoGrid />
      </main>
      <Footer />
    </div>
  );
}

export default App;