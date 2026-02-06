import React, { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MagneticButton } from './MagneticButton';

gsap.registerPlugin(ScrollTrigger);

export const Footer: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Split text animation for "Let's Chat."
      if (headingRef.current) {
        const text = headingRef.current.textContent || '';
        headingRef.current.innerHTML = text
          .split('')
          .map((char) => `<span class="char inline-block">${char === ' ' ? '&nbsp;' : char}</span>`)
          .join('');

        gsap.fromTo(
          headingRef.current.querySelectorAll('.char'),
          {
            y: 100,
            opacity: 0,
            rotateX: -90,
          },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            stagger: 0.02,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // Stagger social links from bottom
      if (linksRef.current) {
        gsap.fromTo(
          linksRef.current.querySelectorAll('a'),
          {
            y: 30,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            stagger: 0.1,
            duration: 0.5,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={sectionRef}
      id="contact"
      className="px-4 sm:px-8 md:px-12 lg:px-20 pb-8 sm:pb-12 pt-12 sm:pt-16 md:pt-20 max-w-[1400px] mx-auto bg-white dark:bg-neutral-950 transition-colors duration-500"
    >
      <div className="border-t border-neutral-200 dark:border-neutral-800 pt-16">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12">
          <MagneticButton strength={0.15} className="group cursor-pointer">
            <p className="text-neutral-400 mb-6 text-xl font-serif italic">Ready to build?</p>
            <a href="mailto:ella.lesperance@outlook.com" className="block relative">
              <h2
                ref={headingRef}
                className="leading-[0.8] font-serif font-medium text-neutral-950 dark:text-white tracking-tight transition-all duration-500 group-hover:opacity-40"
                style={{ fontSize: 'clamp(3rem, 12vw, 8rem)' }}
                style={{ perspective: '1000px' }}
              >
                Let's Chat.
              </h2>
              <div className="hidden group-hover:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-neutral-900 dark:bg-white text-white dark:text-black px-8 py-4 rounded-full font-bold items-center gap-2 pointer-events-none shadow-xl">
                <span>Email Me</span>
                <ArrowRight size={20} />
              </div>
            </a>
          </MagneticButton>

          <div ref={linksRef} className="flex flex-col gap-6 w-full lg:w-auto text-right">
            <div className="flex flex-col gap-2 text-sm font-medium text-neutral-900 dark:text-neutral-300">
              <MagneticButton strength={0.4}>
                <a
                  href="https://linkedin.com/in/ella-lesperance"
                  className="hover:text-neutral-500 dark:hover:text-white transition-colors inline-block"
                >
                  LinkedIn
                </a>
              </MagneticButton>
              <MagneticButton strength={0.4}>
                <a
                  href="https://substack.com/@engineeringtaste"
                  className="hover:text-neutral-500 dark:hover:text-white transition-colors inline-block"
                >
                  Substack
                </a>
              </MagneticButton>
              <MagneticButton strength={0.4}>
                <a
                  href="https://github.com/codebyellalesperance"
                  className="hover:text-neutral-500 dark:hover:text-white transition-colors inline-block"
                >
                  GitHub
                </a>
              </MagneticButton>
            </div>
            <div className="pt-4">
              <span className="text-neutral-400 text-sm">
                © {new Date().getFullYear()} Engineering Taste
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
