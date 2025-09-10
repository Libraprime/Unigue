'use client'
import React, { useState, useEffect } from 'react';

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

  useEffect(() => {
    // Set a timer to change the featured item every 60 seconds (60000 milliseconds)
    const timer = setTimeout(() => {
      // Increment the index, and loop back to the start if we reach the end of the array
      setCurrentIndex((prevIndex) => (prevIndex + 1) % featuresData.length);
    }, 5000);

    // Clear the timer when the component unmounts or the effect re-runs
    return () => clearTimeout(timer);
  }, [currentIndex]); // The effect re-runs whenever the current index changes

  const currentFeature = featuresData[currentIndex];

  return (
    <aside data-theme="luxury" className='bg-base grid-cols-1 h-screen'>
      <div className='flex items-center flex-col pt-32'>
        <img
          src='/logo.png'
          alt='Unique Logo'
          width={150}
          height={40}
        />
        
        <p className=''>Unique</p>
      </div>
      
      <div className='text-center flex flex-col items-center mt-16'>
        <img
          src={currentFeature.imageSrc}
          alt={currentFeature.alt}
          width={50}
          height={50}
        />
        <p className='mt-5'>{currentFeature.title}</p>
        <p className='px-10'>{currentFeature.description}</p>
      </div>
    </aside> 
  )
}

export default Sidebar;
