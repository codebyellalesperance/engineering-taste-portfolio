import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';

export const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Easter egg state
  const [clickPattern, setClickPattern] = useState<number[]>([]);
  const [easterEggActive, setEasterEggActive] = useState(false);
  const SECRET_PATTERN = [0, 1, 0, 1, 0, 1]; // left-right-left-right-left-right

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial reveal animation
      gsap.fromTo(
        '.hero-line',
        { y: 100, opacity: 0, rotateX: -10 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          stagger: 0.15,
          duration: 1.2,
          ease: 'power4.out',
          delay: 0.2,
        }
      );

      // Image entrances
      gsap.fromTo(
        '.hero-image',
        { scale: 0, opacity: 0, rotation: -5 },
        {
          scale: 1,
          opacity: 1,
          rotation: 0,
          duration: 1,
          ease: 'back.out(1.7)',
          delay: 0.8,
          stagger: 0.1
        }
      );

    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Mouse movement effect for images
  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    const moveX = (clientX - centerX) / 80;
    const moveY = (clientY - centerY) / 80;

    imageRefs.current.forEach((img, i) => {
      if (img) {
        gsap.to(img, {
          x: moveX * (i === 0 ? 1 : -0.8),
          y: moveY * (i === 0 ? 1 : -0.8),
          duration: 0.4,
          ease: 'power1.out',
          overwrite: 'auto'
        });
      }
    });
  };

  // Easter egg: Click sequence on images
  const handleImageClick = useCallback((imageIndex: number) => {
    if (easterEggActive) return;

    const newPattern = [...clickPattern, imageIndex].slice(-SECRET_PATTERN.length);
    setClickPattern(newPattern);

    // Check if pattern matches
    if (
      newPattern.length === SECRET_PATTERN.length &&
      newPattern.every((v, i) => v === SECRET_PATTERN[i])
    ) {
      setEasterEggActive(true);
      triggerEasterEgg();
    }
  }, [clickPattern, easterEggActive]);

  const triggerEasterEgg = () => {
    // Make images dance!
    imageRefs.current.forEach((img, i) => {
      if (img) {
        const tl = gsap.timeline({
          onComplete: () => {
            if (i === imageRefs.current.length - 1) {
              setTimeout(() => {
                setEasterEggActive(false);
                setClickPattern([]);
              }, 500);
            }
          }
        });

        tl.to(img, {
          rotation: 360,
          scale: 1.2,
          duration: 0.5,
          ease: 'power2.out',
          delay: i * 0.1,
        })
        .to(img, {
          rotation: 720,
          scale: 1,
          y: -30,
          duration: 0.3,
          ease: 'power2.inOut',
        })
        .to(img, {
          rotation: 1080,
          y: 0,
          duration: 0.5,
          ease: 'bounce.out',
        })
        .to(img, {
          rotation: 0,
          duration: 0.3,
          ease: 'power2.out',
        });
      }
    });

    // Add some sparkles/confetti effect to the container
    if (containerRef.current) {
      const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96e6a1', '#dda0dd', '#f7dc6f'];

      for (let i = 0; i < 30; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.cssText = `
          position: absolute;
          width: 10px;
          height: 10px;
          background: ${colors[Math.floor(Math.random() * colors.length)]};
          border-radius: 50%;
          pointer-events: none;
          z-index: 100;
        `;

        const startX = Math.random() * containerRef.current.offsetWidth;
        const startY = Math.random() * containerRef.current.offsetHeight;

        sparkle.style.left = `${startX}px`;
        sparkle.style.top = `${startY}px`;

        containerRef.current.appendChild(sparkle);

        gsap.to(sparkle, {
          x: (Math.random() - 0.5) * 200,
          y: (Math.random() - 0.5) * 200,
          opacity: 0,
          scale: 0,
          duration: 1 + Math.random(),
          ease: 'power2.out',
          onComplete: () => sparkle.remove(),
        });
      }
    }
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-[90vh] flex flex-col justify-center px-4 sm:px-8 md:px-12 lg:px-20 pt-24 sm:pt-32 pb-8 sm:pb-12 max-w-[1600px] mx-auto overflow-hidden transition-colors duration-500"
    >
      <div className="relative z-10">
        {/* Line 1 */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-8 mb-2 sm:mb-4 md:mb-8">
          <h1 className="hero-line leading-[0.9] tracking-tight font-serif text-neutral-950 dark:text-white transition-colors duration-500" style={{ fontSize: 'clamp(2.5rem, 10vw, 10rem)' }}>
            Building
          </h1>

          <div
            ref={(el) => { imageRefs.current[0] = el; }}
            onClick={() => handleImageClick(0)}
            className="hero-image rounded-2xl overflow-hidden relative top-2 rotate-3 bg-neutral-100 shadow-xl border-4 border-white dark:border-neutral-800 cursor-pointer select-none"
            style={{ width: 'clamp(5rem, 12vw, 10rem)', height: 'clamp(6rem, 15vw, 12rem)' }}
          >
            <img
              src="/unnamed.jpg"
              alt="Ella"
              className="w-full h-full object-cover hover:scale-110 transition-transform duration-700 pointer-events-none"
              draggable={false}
            />
          </div>

          <h1 className="hero-line leading-[0.9] tracking-tight font-serif text-neutral-950 dark:text-white transition-colors duration-500" style={{ fontSize: 'clamp(2.5rem, 10vw, 10rem)' }}>
            with
          </h1>
        </div>

        {/* Line 2 */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-8 mb-2 sm:mb-4 md:mb-8">
          <h1 className="hero-line leading-[0.9] tracking-tight font-serif italic text-neutral-950 dark:text-white transition-colors duration-500" style={{ fontSize: 'clamp(2.5rem, 10vw, 10rem)' }}>
            taste,
          </h1>

          <div
            ref={(el) => { imageRefs.current[1] = el; }}
            onClick={() => handleImageClick(1)}
            className="hero-image rounded-full overflow-hidden relative -top-2 -rotate-2 bg-neutral-100 shadow-xl border-4 border-white dark:border-neutral-800 cursor-pointer select-none"
            style={{ width: 'clamp(10rem, 25vw, 20rem)', height: 'clamp(7rem, 18vw, 14rem)' }}
          >
            <img
              src="/image.png"
              alt="New York City"
              className="w-full h-full object-cover bg-transparent transition-transform duration-700 pointer-events-none"
              draggable={false}
            />
          </div>

          <h1 className="hero-line leading-[0.9] tracking-tight font-serif text-neutral-950 dark:text-white transition-colors duration-500" style={{ fontSize: 'clamp(2.5rem, 10vw, 10rem)' }}>
            not
          </h1>
        </div>

        {/* Line 3 */}
        <div className="flex flex-wrap items-baseline justify-center gap-3 sm:gap-4 md:gap-8">
          <h1 className="hero-line leading-[0.9] tracking-tight font-serif text-neutral-400 transition-colors duration-500" style={{ fontSize: 'clamp(2.5rem, 10vw, 10rem)' }}>
            trends.
          </h1>
        </div>
      </div>

      <div className="hero-line mt-10 sm:mt-16 text-center max-w-lg mx-auto px-4">
        <p className="text-base sm:text-lg md:text-xl text-neutral-500 dark:text-neutral-400 font-medium leading-relaxed transition-colors duration-500">
          Product engineer obsessed with the little details.
        </p>
        <a href="#work" className="inline-block mt-6 sm:mt-8 text-sm font-bold border-b-2 border-black dark:border-white pb-1 text-neutral-950 dark:text-white hover:text-neutral-600 dark:hover:text-neutral-300 hover:border-neutral-400 transition-colors">
          View Selected Work
        </a>
      </div>

      {/* Easter egg hint (very subtle) */}
      {clickPattern.length > 0 && clickPattern.length < SECRET_PATTERN.length && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-neutral-300 dark:text-neutral-700 transition-opacity">
          {'.'.repeat(clickPattern.length)}
        </div>
      )}
    </section>
  );
};
