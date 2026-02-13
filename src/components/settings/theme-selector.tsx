'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-foreground">Tema / Theme</h3>
      <div className="flex gap-2">
        <Button
          variant={theme === 'dark' ? 'default' : 'outline'}
          className="flex-1 min-h-[44px]"
          onClick={() => setTheme('dark')}
        >
          <Moon className="h-4 w-4 mr-2" />
          Dark
        </Button>
        <Button
          variant={theme === 'light' ? 'default' : 'outline'}
          className="flex-1 min-h-[44px]"
          onClick={() => setTheme('light')}
        >
          <Sun className="h-4 w-4 mr-2" />
          Light
        </Button>
      </div>
    </div>
  );
}
