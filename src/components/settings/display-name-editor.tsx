'use client';

import { useState, useTransition } from 'react';

import { toast } from 'sonner';
import { Save } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { updateDisplayName } from '@/lib/actions/settings';

interface DisplayNameEditorProps {
  initialName: string;
}

export function DisplayNameEditor({ initialName }: DisplayNameEditorProps) {
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState(initialName);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      const result = await updateDisplayName(formData);
      
      if (result?.error) {
        toast.error('Gagal mengemas kini nama', {
          description: result.error,
        });
      } else {
        toast.success('Nama berjaya dikemas kini', {
          description: 'Display name updated successfully',
        });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Label htmlFor="name" className="text-sm font-semibold text-foreground">
        Nama Paparan / Display Name
      </Label>
      <div className="flex gap-2">
        <Input
          id="name"
          name="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 bg-input min-h-[44px]"
          maxLength={50}
          disabled={isPending}
        />
        <Button 
          type="submit" 
          disabled={isPending || name === initialName}
          className="min-h-[44px] min-w-[44px]"
        >
          <Save className="h-4 w-4 mr-2" />
          Simpan
        </Button>
      </div>
    </form>
  );
}
