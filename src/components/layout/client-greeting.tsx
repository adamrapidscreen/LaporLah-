'use client';

import { useEffect, useState } from 'react';

interface ClientGreetingProps {
  userName: string | null;
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Selamat Pagi';
  if (hour < 18) return 'Selamat Petang';
  return 'Selamat Malam';
}

export function ClientGreeting({ userName }: ClientGreetingProps) {
  const [timeGreeting, setTimeGreeting] = useState('');
  useEffect(() => {
    setTimeGreeting(getGreeting());
  }, []);

  const baseGreeting = timeGreeting || 'Selamat Datang';
  const greeting = userName ? `${baseGreeting},` : 'Selamat Datang ke';

  return (
    <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
      {userName ? (
        <span className="inline-flex flex-col leading-tight">
          <span>{greeting}</span>
          <span className="text-primary">{userName}</span>
        </span>
      ) : (
        <span className="inline-flex flex-wrap gap-1">
          <span>{greeting}</span>
          <span className="font-bold text-primary">LaporLah</span>
        </span>
      )}
    </h1>
  );
}
