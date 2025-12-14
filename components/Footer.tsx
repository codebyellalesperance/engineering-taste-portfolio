import React from 'react';
import { ArrowRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer id="contact" className="px-6 sm:px-12 pb-12 pt-20 max-w-[1400px] mx-auto bg-white dark:bg-neutral-950 transition-colors duration-500">
      <div className="border-t border-neutral-200 dark:border-neutral-800 pt-16">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12">

          <div className="group cursor-pointer">
            <p className="text-neutral-400 mb-6 text-xl font-serif italic">Ready to build?</p>
            <a
              href="mailto:ella.lesperance@outlook.com"
              className="block relative"
            >
              <h2 className="text-[12vw] lg:text-[8vw] leading-[0.8] font-serif font-medium text-neutral-950 dark:text-white tracking-tight transition-all duration-500 group-hover:opacity-40">
                Let's Chat.
              </h2>
              <div className="hidden group-hover:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-neutral-900 dark:bg-white text-white dark:text-black px-8 py-4 rounded-full font-bold items-center gap-2 pointer-events-none shadow-xl">
                <span>Email Me</span>
                <ArrowRight size={20} />
              </div>
            </a>
          </div>

          <div className="flex flex-col gap-6 w-full lg:w-auto text-right">
            <div className="flex flex-col gap-2 text-sm font-medium text-neutral-900 dark:text-neutral-300">
              <a href="https://linkedin.com/in/ella-lesperance" className="hover:text-neutral-500 dark:hover:text-white transition-colors">LinkedIn</a>
              <a href="https://substack.com/@ctrlcreatelabs" className="hover:text-neutral-500 dark:hover:text-white transition-colors">Substack</a>
              <a href="https://github.com" className="hover:text-neutral-500 dark:hover:text-white transition-colors">GitHub</a>
            </div>
            <div className="pt-4">
              <span className="text-neutral-400 text-sm">© {new Date().getFullYear()} Ctrl Create Labs</span>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};