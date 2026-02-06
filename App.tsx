import React, { useEffect, useState, useCallback } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Terminal } from './components/Terminal';
import { BentoGrid } from './components/BentoGrid';
import { Footer } from './components/Footer';
import { MenuOverlay } from './components/MenuOverlay';
import { useKonamiCode } from './hooks/useKonamiCode';
import gsap from 'gsap';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [showKonamiEffect, setShowKonamiEffect] = useState(false);

  // Konami code easter egg
  const handleKonamiCode = useCallback(() => {
    setShowKonamiEffect(true);
    triggerKonamiEffect();
  }, []);

  useKonamiCode(handleKonamiCode);

  const triggerKonamiEffect = () => {
    // Screen glitch effect
    const overlay = document.createElement('div');
    overlay.id = 'konami-overlay';
    overlay.style.cssText = `
      position: fixed;
      inset: 0;
      z-index: 9999;
      pointer-events: none;
      background: transparent;
    `;
    document.body.appendChild(overlay);

    // Glitch animation
    const glitchTl = gsap.timeline();
    glitchTl
      .to(overlay, {
        backgroundColor: 'rgba(255, 0, 100, 0.3)',
        duration: 0.05,
      })
      .to(overlay, {
        backgroundColor: 'rgba(0, 255, 200, 0.3)',
        duration: 0.05,
      })
      .to(overlay, {
        backgroundColor: 'rgba(100, 0, 255, 0.3)',
        duration: 0.05,
      })
      .to(overlay, {
        backgroundColor: 'transparent',
        duration: 0.05,
      })
      .repeat(3);

    // Confetti explosion
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96e6a1', '#dda0dd', '#f7dc6f', '#ff9ff3', '#54a0ff'];
    const confettiContainer = document.createElement('div');
    confettiContainer.style.cssText = `
      position: fixed;
      inset: 0;
      z-index: 9998;
      pointer-events: none;
      overflow: hidden;
    `;
    document.body.appendChild(confettiContainer);

    for (let i = 0; i < 100; i++) {
      const confetti = document.createElement('div');
      const size = Math.random() * 10 + 5;
      const isCircle = Math.random() > 0.5;

      confetti.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        border-radius: ${isCircle ? '50%' : '2px'};
        left: 50%;
        top: 50%;
        transform: rotate(${Math.random() * 360}deg);
      `;

      confettiContainer.appendChild(confetti);

      const angle = (Math.random() * Math.PI * 2);
      const velocity = Math.random() * 500 + 200;
      const destX = Math.cos(angle) * velocity;
      const destY = Math.sin(angle) * velocity - 200;

      gsap.to(confetti, {
        x: destX,
        y: destY,
        rotation: Math.random() * 720 - 360,
        opacity: 0,
        duration: Math.random() * 2 + 1,
        ease: 'power2.out',
        onComplete: () => confetti.remove(),
      });
    }

    // Toast notification
    const toast = document.createElement('div');
    toast.innerHTML = `
      <div style="display: flex; align-items: center; gap: 12px;">
        <span style="font-size: 24px;">🎮</span>
        <div>
          <div style="font-weight: bold;">You found a secret!</div>
          <div style="font-size: 12px; opacity: 0.8;">Konami Code activated</div>
        </div>
      </div>
    `;
    toast.style.cssText = `
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%) translateY(100px);
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 16px 24px;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
      z-index: 10000;
      font-family: system-ui, -apple-system, sans-serif;
    `;
    document.body.appendChild(toast);

    gsap.to(toast, {
      y: 0,
      duration: 0.5,
      ease: 'back.out(1.7)',
    });

    // Cleanup
    setTimeout(() => {
      gsap.to(toast, {
        y: 100,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          toast.remove();
          overlay.remove();
          confettiContainer.remove();
          setShowKonamiEffect(false);
        },
      });
    }, 3000);
  };

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
        <Terminal />
        <BentoGrid />
      </main>
      <Footer />
    </div>
  );
}

export default App;
