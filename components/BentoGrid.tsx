import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Linkedin, Cpu, LayoutTemplate, Code2, Activity } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SpotlightCard = ({
  children,
  className = "",
  href = "",
  ...props
}: {
  children?: React.ReactNode;
  className?: string;
  href?: string;
  [key: string]: any;
}) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!divRef.current) return;
    const div = divRef.current;
    const rect = div.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate rotation based on mouse position
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -5; // Max rotation 5deg
    const rotateY = ((x - centerX) / centerX) * 5;

    div.style.setProperty('--mouse-x', `${x}px`);
    div.style.setProperty('--mouse-y', `${y}px`);

    gsap.to(div, {
      rotateX: rotateX,
      rotateY: rotateY,
      scale: 1.02,
      duration: 0.5,
      ease: 'power2.out',
      transformPerspective: 1000,
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (divRef.current) {
      gsap.to(divRef.current, {
        rotateX: 0,
        rotateY: 0,
        scale: 1,
        duration: 0.5,
        ease: 'power2.out'
      });
    }
  };

  const Wrapper = href ? 'a' : 'div';
  const wrapperProps = href ? { href, target: "_blank", rel: "noopener noreferrer" } : {};

  return (
    <Wrapper
      {...wrapperProps}
      // @ts-ignore
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={`group relative overflow-hidden bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-[32px] hover:border-neutral-300 dark:hover:border-neutral-700 hover:shadow-2xl transition-all duration-500 ${className}`}
      style={{ transformStyle: 'preserve-3d' }}
      {...props}
    >
      {/* Spotlight Gradient */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100 z-30"
        style={{
          background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(0,0,0,0.04), transparent 40%)`
        }}
      />
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100 dark:block hidden z-30"
        style={{
          background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(255,255,255,0.03), transparent 40%)`
        }}
      />

      <div className="relative h-full z-10 transform-gpu" style={{ transform: 'translateZ(20px)' }}>{children}</div>
    </Wrapper>
  );
};

export const BentoGrid: React.FC = () => {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.bento-item',
        {
          y: 100,
          opacity: 0,
          scale: 0.9,
          rotateX: -15
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          rotateX: 0,
          duration: 1.2,
          stagger: 0.15,
          ease: 'back.out(1.2)',
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 75%',
          },
        }
      );
    }, gridRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="work" className="px-4 sm:px-12 py-32 max-w-[1400px] mx-auto bg-neutral-50 dark:bg-neutral-950 rounded-t-[4rem] -mt-12 relative z-20 transition-colors duration-500">
      <div className="mb-20 flex items-end justify-between px-2">
        <div>
          <h2 className="text-5xl md:text-7xl font-serif text-neutral-950 dark:text-white tracking-tight transition-colors duration-500 mb-4">Selected Work</h2>
          <p className="text-neutral-500 dark:text-neutral-400 text-lg max-w-xl">A collection of projects exploring the intersection of design, engineering, and artificial intelligence.</p>
        </div>
        <span className="text-neutral-400 font-medium hidden sm:inline-block border border-neutral-200 dark:border-neutral-800 px-4 py-2 rounded-full text-sm">2023 — Present</span>
      </div>

      <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-12 gap-8 auto-rows-[minmax(300px,auto)] perspective-1000">

        {/* CARD 1: NASDAQ */}
        <SpotlightCard className="bento-item md:col-span-8 p-10 md:p-14 flex flex-col justify-between min-h-[500px] bg-neutral-900 text-white border-neutral-800 hover:border-neutral-700">
          <div className="flex justify-between items-start">
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
              <Cpu className="text-white" size={32} />
            </div>
            <span className="px-4 py-1.5 rounded-full bg-white/10 border border-white/10 text-white/90 text-xs font-bold uppercase tracking-widest">
              Current Role
            </span>
          </div>

          <div className="mt-auto">
            <h3 className="text-4xl md:text-6xl font-serif text-white mb-6">Nasdaq</h3>
            <p className="text-2xl text-neutral-300 font-medium mb-8">Software Engineer</p>
            <p className="text-neutral-400 leading-relaxed max-w-2xl text-xl mb-8 font-light">
              Building internal reusable software components and AI sandbox workflows to standardize development across global engineering teams.
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="text-xs font-mono text-neutral-300 border border-white/20 px-4 py-2 rounded-full bg-white/5">React</span>
              <span className="text-xs font-mono text-neutral-300 border border-white/20 px-4 py-2 rounded-full bg-white/5">Python</span>
              <span className="text-xs font-mono text-neutral-300 border border-white/20 px-4 py-2 rounded-full bg-white/5">AWS</span>
            </div>
          </div>
        </SpotlightCard>

        {/* CARD 2: SUBSTACK */}
        <SpotlightCard href="https://substack.com/@ctrlcreatelabs" className="bento-item md:col-span-4 md:row-span-2 bg-[#F5F5F3] dark:bg-neutral-900">
          <div className="h-full flex flex-col p-10 md:p-12">
            <div className="flex justify-between items-start mb-16">
              <div className="w-14 h-14 bg-neutral-900 dark:bg-white dark:text-black text-white rounded-full flex items-center justify-center transition-colors shadow-lg">
                <LayoutTemplate size={24} />
              </div>
              <ArrowUpRight size={32} className="text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors" />
            </div>

            <div className="mt-auto">
              <p className="text-neutral-500 font-bold tracking-widest uppercase text-xs mb-6">Latest Thinking</p>
              <h3 className="text-5xl font-serif text-neutral-900 dark:text-white mb-6 leading-[0.9] transition-colors">
                Ctrl Create Labs
              </h3>
              <p className="text-neutral-600 dark:text-neutral-300 font-serif italic text-2xl leading-snug mb-8 transition-colors">
                "Prototype. Understand. Repeat."
              </p>
              <p className="text-neutral-500 dark:text-neutral-400 text-base leading-relaxed border-l-2 border-neutral-200 dark:border-neutral-700 pl-6 transition-colors">
                Documenting the messy process of making emerging AI tech practical for engineers.
              </p>
              <div className="mt-10">
                <span className="text-sm font-bold underline decoration-2 underline-offset-4 text-neutral-900 dark:text-white hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors">Read the Substack</span>
              </div>
            </div>
          </div>
        </SpotlightCard>

        {/* CARD 3: JUMBOCODE */}
        <SpotlightCard className="bento-item md:col-span-4 p-10 flex flex-col bg-white dark:bg-neutral-900">
          <div className="mb-8">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <Code2 className="text-emerald-600 dark:text-emerald-400" size={24} />
            </div>
          </div>
          <h3 className="text-3xl font-serif text-neutral-900 dark:text-white mb-3 transition-colors">Tufts JumboCode</h3>
          <p className="text-xs text-neutral-400 uppercase tracking-wider font-bold mb-6">Head of Operations</p>
          <p className="text-neutral-600 dark:text-neutral-400 text-base leading-relaxed transition-colors">
            Led teams to build full-stack volunteer platforms and sibling reconnection apps for non-profits.
          </p>
        </SpotlightCard>

        {/* CARD 4: INTERNSHIP */}
        <SpotlightCard className="bento-item md:col-span-4 p-10 flex flex-col bg-white dark:bg-neutral-900">
          <div className="mb-8">
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Activity className="text-blue-600 dark:text-blue-400" size={24} />
            </div>
          </div>
          <h3 className="text-3xl font-serif text-neutral-900 dark:text-white mb-3 transition-colors">GenAI Fellow</h3>
          <p className="text-xs text-neutral-400 uppercase tracking-wider font-bold mb-6">Nasdaq Internship</p>
          <p className="text-neutral-600 dark:text-neutral-400 text-base leading-relaxed transition-colors">
            Led MIT Sloan MBA consultants on spatial computing cases. Built Python pipelines cutting processing time by 40%.
          </p>
        </SpotlightCard>

        {/* NEW CARD 5: SPATIAL LAB */}
        <SpotlightCard className="bento-item md:col-span-4 p-10 flex flex-col bg-neutral-900 text-white border-neutral-800">
          <div className="mb-8">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
              <LayoutTemplate className="text-purple-400" size={24} />
            </div>
          </div>
          <h3 className="text-3xl font-serif text-white mb-3">Spatial Lab</h3>
          <p className="text-xs text-neutral-400 uppercase tracking-wider font-bold mb-6">Three.js Experiment</p>
          <p className="text-neutral-400 text-base leading-relaxed">
            Interactive 3D playground exploring web-based spatial interfaces and physics simulations.
          </p>
        </SpotlightCard>

        {/* NEW CARD 6: AI ARCHITECT */}
        <SpotlightCard className="bento-item md:col-span-8 p-10 flex flex-col bg-white dark:bg-neutral-900">
          <div className="mb-8">
            <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
              <Cpu className="text-orange-600 dark:text-orange-400" size={24} />
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <h3 className="text-3xl font-serif text-neutral-900 dark:text-white mb-3 transition-colors">The AI Architect</h3>
              <p className="text-xs text-neutral-400 uppercase tracking-wider font-bold mb-6">Agentic Interface</p>
              <p className="text-neutral-600 dark:text-neutral-400 text-base leading-relaxed max-w-lg transition-colors">
                A next-generation coding assistant interface featuring real-time context awareness, multi-file editing, and a "magic button" for instant prompt generation.
              </p>
            </div>
            <div className="flex gap-2">
              <span className="text-xs font-mono text-neutral-500 border border-neutral-200 dark:border-neutral-800 px-3 py-1 rounded-full">React 19</span>
              <span className="text-xs font-mono text-neutral-500 border border-neutral-200 dark:border-neutral-800 px-3 py-1 rounded-full">Tailwind</span>
            </div>
          </div>
        </SpotlightCard>

        {/* CARD 5: SOCIALS */}
        <SpotlightCard className="bento-item md:col-span-12 p-2 flex items-center justify-center bg-neutral-100 dark:bg-neutral-800 min-h-[60px]">
          <div className="flex flex-col md:flex-row gap-8 items-center justify-center w-full max-w-4xl">

            <a href="https://www.linkedin.com/in/ella-lesperance" target="_blank" rel="noreferrer" className="flex items-center gap-4 group/link">
              <div className="p-2.5 rounded-full bg-white dark:bg-neutral-900 shadow-sm group-hover/link:scale-110 transition-transform">
                <Linkedin size={20} className="text-[#0A66C2]" />
              </div>
              <div>
                <p className="text-base text-neutral-900 dark:text-white font-bold transition-colors">Connect on LinkedIn</p>
              </div>
            </a>

            <div className="h-6 w-[1px] bg-neutral-300 dark:bg-neutral-600 hidden md:block"></div>

            <div className="hidden md:block text-center">
              <p className="text-base text-neutral-900 dark:text-white font-bold transition-colors">Tufts University '25</p>
            </div>

            <div className="h-6 w-[1px] bg-neutral-300 dark:bg-neutral-600 hidden md:block"></div>

            <a href="/resume.pdf" className="px-6 py-2.5 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-black font-bold hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors text-sm shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
              Download Resume
            </a>
          </div>
        </SpotlightCard>

      </div>
    </section>
  );
};