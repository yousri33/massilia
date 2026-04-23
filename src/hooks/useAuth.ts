'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { MassiliaUser, SignupPayload } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import { insertNotification } from '@/lib/db';

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<MassiliaUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load session on mount and listen for auth changes
  useEffect(() => {
    const initSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        const profile = await fetchProfile(session.user.id);
        if (profile) {
          setUser({
            id: session.user.id,
            name: profile.name,
            email: session.user.email || '',
            company: profile.company,
            businessType: profile.business_type as any,
            city: profile.city,
            createdAt: profile.created_at,
            onboardingAnswers: undefined,
          });
        }
      }
      setIsLoading(false);
    };

    initSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const profile = await fetchProfile(session.user.id);
        if (profile) {
          setUser({
            id: session.user.id,
            name: profile.name,
            email: session.user.email || '',
            company: profile.company,
            businessType: profile.business_type as any,
            city: profile.city,
            createdAt: profile.created_at,
          });
        }
      } else {
        setUser(null);
      }
    });

    return () => subscription?.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }

    return data;
  };

  const login = useCallback(
    async (email: string, password: string): Promise<{ ok: boolean; error?: string }> => {
      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        return { ok: false, error: error.message };
      }

      return { ok: true };
    },
    [],
  );

  const loginWithGoogle = useCallback(async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });

    if (error) {
      console.error('Google login error:', error);
      return { ok: false, error: error.message };
    }

    return { ok: true };
  }, []);

  const signup = useCallback(
    async (payload: SignupPayload): Promise<{ ok: boolean; error?: string }> => {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: payload.email,
        password: payload.password,
      });

      if (authError) {
        return { ok: false, error: authError.message };
      }

      if (!authData.user) {
        return { ok: false, error: 'Signup failed.' };
      }

      // Create profile
      const { error: profileError } = await supabase.from('profiles').insert({
        id: authData.user.id,
        name: `${payload.firstName} ${payload.lastName}`,
        company: payload.company,
        business_type: payload.businessType,
        city: payload.city,
      });

      if (profileError) {
        console.error('Profile creation error:', profileError);
        return { ok: false, error: (profileError as any).message || 'Erreur lors de la création du profil.' };
      }

      // Insert welcome notification
      await insertNotification(
        authData.user.id,
        'Bienvenue sur Legal Pilot ! 👋',
        'Complétez votre diagnostic pour obtenir votre score de conformité.',
        'action',
      );

      return { ok: true };
    },
    [],
  );

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push('/');
  }, [router]);

  const updateUser = useCallback(
    async (patch: Partial<MassiliaUser>) => {
      if (!user) return;

      const { error } = await supabase
        .from('profiles')
        .update({
          name: patch.name || user.name,
          company: patch.company || user.company,
          city: patch.city || user.city,
        })
        .eq('id', user.id);

      if (error) {
        console.error('Error updating profile:', error);
        return;
      }

      const updated = { ...user, ...patch };
      setUser(updated);
    },
    [user],
  );

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    loginWithGoogle,
    signup,
    logout,
    updateUser,
  };
}
