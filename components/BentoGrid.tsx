import React from 'react';
import { Desktop } from './os/Desktop';

export const BentoGrid: React.FC = () => {
  return (
    <section id="work" className="min-h-screen bg-neutral-50 dark:bg-neutral-950 transition-colors duration-500">
      <Desktop className="w-full h-screen" />
    </section>
  );
};