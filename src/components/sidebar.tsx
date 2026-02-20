'use client'
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Logo from './Logo';

const featuresData = [
  {
    imageSrc: 'https://cdn-icons-gif.flaticon.com/6455/6455041.gif',
    alt: 'Quality icon',
    title: 'Best Quality Material',
    description: 'Our product is made from at least 75% recycled polyester fibers'
  },
  {
    imageSrc: 'https://cdn-icons-gif.flaticon.com/6172/6172509.gif',
    alt: 'Payments icon',
    title: 'Secure Payments',
    description: 'Payments with a guaranteed level of security, you don\'t have to worry'
  },
  {
    imageSrc: 'https://cdn-icons-gif.flaticon.com/6172/6172512.gif',
    alt: 'Shipping icon',
    title: 'Free Shipping',
    description: 'Free shipping worldwide with appreciable conditions'
  },
];

function Sidebar() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Start the fade-out process after 4.5 seconds
    const timer = setTimeout(() => {
      setIsFading(true);
    }, 4500);

    return () => clearTimeout(timer);
  }, [currentIndex]);

  useEffect(() => {
    if (isFading) {
      // After a short delay to allow for the fade-out transition, change the item
      const transitionTimer = setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % featuresData.length);
        setIsFading(false); // Reset the fading state to allow the new item to fade in
      }, 500); // Matches the CSS transition duration

      return () => clearTimeout(transitionTimer);
    }
  }, [isFading]);

  const currentFeature = featuresData[currentIndex];

  return (
    <aside data-theme="luxury" className='bg-base font-serif grid-cols-1 h-screen'>
      <div className='flex items-center flex-col pt-32'>
        <Logo
          width={150}
          height={40}
        />
        
        <p className=''>Unique</p>
      </div>
      
      <div className={`text-center flex flex-col items-center mt-16 transition-opacity duration-500 ${isFading ? 'opacity-0' : 'opacity-100'}`}>
        <Image
          src={currentFeature.imageSrc}
          alt={currentFeature.alt}
          width={50}
          height={50}
        />
        <p className='mt-5'>{currentFeature.title}</p>
        <p className='px-10'>{currentFeature.description}</p>
      </div>

      {/* Horizontal rule indicators */}
      <div className="flex justify-center mt-4 space-x-2">
        {featuresData.map((_, index) => (
          <div
            key={index}
            className={`h-1 w-8 rounded-full transition-all duration-500 ${
              index === currentIndex ? 'bg-amber-500' : 'bg-[#553900]'
            }`}
          ></div>
        ))}
      </div>
    </aside> 
  )
}

export default Sidebar;
