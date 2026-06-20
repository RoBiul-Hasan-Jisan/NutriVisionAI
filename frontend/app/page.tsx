'use client';

import { HeroSection } from './HeroSection';

export default function Home() {
  const handleCreateClick = () => {
    console.log('Create link clicked');
  };

  return (
    <main>
      <HeroSection onCreateClick={handleCreateClick} />
    </main>
  );
}