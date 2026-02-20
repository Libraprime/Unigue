import Image from 'next/image'
import logo from '../../public/Logo.png';

interface LogoProps {
  width?: number;  // The '?' makes it optional
  height?: number;
  className?: string; // Helpful for adding extra styling/margins via props
}

export default function Logo({ width = 50, height = 50, className }: LogoProps) {
    return (
        <div className={className}>
            <Image
                src={logo}
                alt='Unique Logo'
                width={width}
                height={height}
                // Ensures the aspect ratio remains clean if only one prop is passed
                style={{ objectFit: 'contain' }} 
            />
        </div>
    )
}