import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  variant?: 'light' | 'dark' | 'auto';
  href?: string;
  className?: string;
  priority?: boolean;
}

const sizeMap = {
  small: { width: 160, height: 42, className: 'h-10' },
  medium: { width: 200, height: 52, className: 'h-12' },
  large: { width: 240, height: 62, className: 'h-14' },
};

export function Logo({
  size = 'medium',
  variant = 'auto',
  href,
  className,
  priority = false,
}: LogoProps) {
  const { width, height, className: sizeClassName } = sizeMap[size];
  
  // Determine logo variant based on theme
  const logoSrc = variant === 'auto' 
    ? '/logos/neolish-logo-optimized.svg' // Use optimized version for better content visibility
    : variant === 'light'
    ? '/logos/neolish-logo-optimized.svg'
    : '/logos/neolish-logo-optimized-dark.svg';

  const logoElement = (
    <Image
      src={logoSrc}
      alt="Neolish Logo"
      width={width}
      height={height}
      className={cn(sizeClassName, 'w-auto', className)}
      priority={priority}
    />
  );

  if (href) {
    return (
      <Link 
        href={href} 
        className="hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white rounded"
      >
        {logoElement}
      </Link>
    );
  }

  return logoElement;
}

export default Logo; 