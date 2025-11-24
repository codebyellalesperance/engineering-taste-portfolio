import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { X, ArrowUpRight } from 'lucide-react';

interface MenuOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const mainLinks = [
  { title: "Home", href: "#" },
  { title: "Selected Work", href: "#work" },
  { title: "Latest Thinking", href: "https://substack.com/@ctrlcreatelabs" },
  { title: "Contact", href: "mailto:ella.lesperance@outlook.com" },
];

const socialLinks = [
  { title: "LinkedIn", href: "https://www.linkedin.com/in/ella-lesperance" },
  { title: "GitHub", href: "https://github.com/ctrl-create-labs" },
  { title: "Substack", href: "https://substack.com/@ctrlcreatelabs" },
];

export const MenuOverlay: React.FC<MenuOverlayProps> = ({ isOpen, onClose }) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (isOpen) {
        // Initial states
        gsap.set(menuRef.current, { display: 'block' });
        gsap.set(containerRef.current, { y: '-100%' });

        // Animate in
        const tl = gsap.timeline();

        // 1. Slide down curtain
        tl.to(containerRef.current, {
          y: '0%',
          duration: 0.8,
          ease: 'power4.inOut',
        })
          // 2. Reveal links
          .fromTo('.menu-link-item',
            { y: 100, opacity: 0, rotateX: -20 },
            { y: 0, opacity: 1, rotateX: 0, stagger: 0.1, duration: 0.8, ease: 'power3.out' },
            "-=0.4"
          )
          // 3. Reveal secondary content
          .fromTo('.menu-secondary',
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 },
            "-=0.6"
          );

      } else {
        // Animate out
        const tl = gsap.timeline({
          onComplete: () => {
            if (menuRef.current) gsap.set(menuRef.current, { display: 'none' });
          }
        });

        tl.to(containerRef.current, {
          y: '-100%',
          duration: 0.6,
          ease: 'power4.inOut'
        });
      }
    }, menuRef);

    return () => ctx.revert();
  }, [isOpen]);

  return (
    <div
      ref={menuRef}
      className="fixed inset-0 z-[100] hidden"
    >
      <div
        ref={containerRef}
        className="absolute inset-0 bg-neutral-950 text-white w-full h-full flex flex-col"
      >
        {/* Header Area */}
        <div className="px-6 py-6 flex justify-between items-center border-b border-neutral-800">
          <div className="font-bold tracking-tight text-xl">Ctrl Create Labs</div>
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-neutral-800 hover:bg-neutral-800 transition-colors"
          >
            <span className="text-sm font-medium">Close</span>
            <X size={18} />
          </button>
        </div>

        {/* Main Content Grid */}
        <div className="flex-1 container mx-auto px-6 py-12 flex flex-col md:flex-row gap-12 md:gap-24">

          {/* Left: Main Navigation */}
          <div className="flex-1 flex flex-col justify-center gap-2">
            {mainLinks.map((link, index) => (
              <div key={index} className="overflow-hidden">
                <a
                  href={link.href}
                  onClick={onClose}
                  className="menu-link-item block text-[12vw] md:text-[7vw] leading-[0.9] font-serif hover:text-neutral-400 transition-colors duration-300"
                >
                  {link.title}
                </a>
              </div>
            ))}
          </div>

          {/* Right: Secondary Info */}
          <div className="md:w-1/3 flex flex-col justify-center gap-12 menu-secondary">

            {/* Socials */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-6">Socials</h4>
              <div className="flex flex-col gap-4">
                {socialLinks.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center gap-2 text-xl text-neutral-300 hover:text-white transition-colors"
                  >
                    {link.title}
                    <ArrowUpRight size={18} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                ))}
              </div>
            </div>

            {/* Location / Info */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-6">Location</h4>
              <p className="text-xl text-neutral-300">Boston, MA</p>
              <p className="text-neutral-500 mt-2">Local Time: {new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</p>
            </div>

            {/* Email */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-6">Get in touch</h4>
              <a href="mailto:ella.lesperance@outlook.com" className="text-xl text-neutral-300 hover:text-white underline decoration-neutral-700 underline-offset-4 transition-colors">
                ella.lesperance@outlook.com
              </a>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};