import Image from 'next/image';
import Link from 'next/link';

import { cn } from '@/lib/utils';

type LogoSize = 'sm' | 'md' | 'lg';

interface LogoProps {
  href?: string;
  size?: LogoSize;
  className?: string;
}

const sizeConfig: Record<LogoSize, { width: number; height: number }> = {
  sm: { width: 100, height: 100 },
  md: { width: 120, height: 120 },
  lg: { width: 160, height: 160 },
};

export function Logo({ href = '/', size = 'md', className }: LogoProps) {
  const { width, height } = sizeConfig[size];

  const logoImage = (
    <Image
      src="/logo/Lapor.svg"
      alt="LaporLah"
      width={width}
      height={height}
      priority={size === 'lg'}
    />
  );

  const content = href ? (
    <Link href={href} aria-label="LaporLah home" className="inline-flex items-center">
      {logoImage}
    </Link>
  ) : (
    logoImage
  );

  return <div className={cn('flex items-center', className)}>{content}</div>;
}

