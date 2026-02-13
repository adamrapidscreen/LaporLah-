'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { LogOut } from 'lucide-react';
import { toast } from 'sonner';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';

export function SignOutButton() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const handleSignOut = async () => {
    setIsPending(true);
    
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast.error('Gagal log keluar', {
          description: 'Failed to sign out',
        });
      } else {
        toast.success('Berjaya log keluar', {
          description: 'Successfully signed out',
        });
        router.push('/');
        router.refresh();
      }
    } catch (error) {
      toast.error('Sesuatu telah berlaku', {
        description: 'Something went wrong',
      });
      console.error('Sign out error:', error);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button 
          variant="destructive" 
          className="w-full min-h-[44px] bg-destructive/10 text-destructive hover:bg-destructive/20"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Log Keluar
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Log keluar dari akaun anda?</AlertDialogTitle>
          <AlertDialogDescription>
            Anda perlu log masuk semula untuk mengakses akaun anda.
            <br />
            You will need to sign in again to access your account.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="min-h-[44px]">Batal</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleSignOut} 
            disabled={isPending}
            className="min-h-[44px] bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Log Keluar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
