import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);

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

    const moveX = (clientX - centerX) / 50;
    const moveY = (clientY - centerY) / 50;

    imageRefs.current.forEach((img, i) => {
      if (img) {
        gsap.to(img, {
          x: moveX * (i + 1),
          y: moveY * (i + 1),
          duration: 1,
          ease: 'power2.out'
        });
      }
    });
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-[90vh] flex flex-col justify-center px-6 sm:px-12 pt-32 pb-12 max-w-[1600px] mx-auto overflow-hidden transition-colors duration-500"
    >
      <div className="relative z-10">
        {/* Line 1 */}
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 mb-4 md:mb-8">
          <h1 className="hero-line text-[10vw] leading-[0.9] tracking-tight font-serif text-neutral-950 dark:text-white transition-colors duration-500">
            Global
          </h1>

          <div
            ref={(el) => { imageRefs.current[0] = el; }}
            className="hero-image w-[15vw] h-[18vw] md:w-32 md:h-40 rounded-2xl overflow-hidden relative top-2 rotate-3 bg-neutral-100 shadow-xl border-4 border-white dark:border-neutral-800"
          >
            <img
              src="/ella.jpg"
              alt="Portrait"
              className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
            />
          </div>

          <h1 className="hero-line text-[10vw] leading-[0.9] tracking-tight font-serif text-neutral-950 dark:text-white transition-colors duration-500">
            talent,
          </h1>
        </div>

        {/* Line 2 */}
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 mb-4 md:mb-8">
          <h1 className="hero-line text-[10vw] leading-[0.9] tracking-tight font-serif text-neutral-950 dark:text-white transition-colors duration-500">
            Boston
          </h1>

          <div
            ref={(el) => { imageRefs.current[1] = el; }}
            className="hero-image w-[40vw] h-[30vw] md:w-72 md:h-48 rounded-full overflow-hidden relative -top-2 -rotate-2 bg-neutral-100 shadow-xl border-4 border-white dark:border-neutral-800"
          >
            <img
              src="/boston.jpg"
              alt="Mark"
              className="w-full h-full object-cover bg-transparent transition-transform duration-700"
            />
          </div>

          <h1 className="hero-line text-[7vw] leading-[0.9] tracking-tight font-serif text-neutral-950 dark:text-white transition-colors duration-500">
            based
          </h1>
        </div>

        {/* Line 3 */}
        <div className="flex flex-wrap items-baseline justify-center gap-4 md:gap-8">
          <h1 className="hero-line text-[7vw] leading-[0.9] tracking-tight font-serif italic text-neutral-400 transition-colors duration-500">
            creative
          </h1>
          <h1 className="hero-line text-[7vw] leading-[0.9] tracking-tight font-serif text-neutral-950 dark:text-white transition-colors duration-500">
            engineer
          </h1>
        </div>
      </div>

      <div className="hero-line mt-16 text-center max-w-lg mx-auto">
        <p className="text-lg text-neutral-500 dark:text-neutral-400 font-medium leading-relaxed transition-colors duration-500">
          Product-minded AI engineer turning complex ideas into simple, elegant systems. Zero to One.
        </p>
        <p className="mt-3 text-neutral-500 dark:text-neutral-400 leading-relaxed transition-colors duration-500">
          I build fast, design deliberately, and create tools that make everyday performance smoother, smarter, and more human.
        </p>
        <a href="#work" className="inline-block mt-6 text-sm font-bold border-b-2 border-black dark:border-white pb-1 text-neutral-950 dark:text-white hover:text-neutral-600 dark:hover:text-neutral-300 hover:border-neutral-400 transition-colors">
          View Selected Work
        </a>
      </div>

    </section>
  );
};