'use client';

import { useEffect, useState } from 'react';

interface ClientGreetingProps {
  userName: string | null;
}

export function ClientGreeting({ userName }: ClientGreetingProps) {
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const getGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) return 'Selamat Pagi';
      if (hour < 18) return 'Selamat Petang';
      return 'Selamat Malam';
    };

    const baseGreeting = getGreeting();
    setGreeting(userName ? `${baseGreeting}, ${userName}` : `Selamat Datang ke LaporLah`);
  }, [userName]);

  return <h1 className="text-xl font-bold text-foreground">{greeting}</h1>;
}
