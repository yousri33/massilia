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

  useEffect(() => {
    // First: get the current session synchronously
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const profile = await fetchProfile(session.user.id);
        // Fall back to minimal user if profile row is missing (e.g. RLS or first-time)
        setUser(sessionToUser(session.user, profile ?? {}));
      }
      setIsLoading(false);
    });

    // Then: keep in sync with future auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('[useAuth] onAuthStateChange event:', event, session?.user?.id);

        if (event === 'SIGNED_OUT') {
          setUser(null);
          setIsLoading(false);
          return;
        }

        if (session?.user) {
          // Keep loading true while we fetch the profile
          setIsLoading(true);
          const profile = await fetchProfile(session.user.id);
          // IMPORTANT: even if profile is null (RLS / missing row), still mark
          // the user as authenticated so the redirect fires.
          setUser(sessionToUser(session.user, profile ?? {}));
          setIsLoading(false);
        }
      },
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('[useAuth] fetchProfile error:', error.message, error.code);
      return null;
    }
    console.log('[useAuth] fetchProfile result:', data);
    return data;
  };

  const sessionToUser = (authUser: any, profile: any): MassiliaUser => ({
    id: authUser.id,
    name: profile?.name ?? authUser.user_metadata?.name ?? '',
    email: authUser.email || '',
    company: profile?.company ?? '',
    businessType: (profile?.business_type as any) ?? null,
    city: profile?.city ?? '',
    createdAt: profile?.created_at ?? authUser.created_at,
  });

  const login = useCallback(
    async (email: string, password: string): Promise<{ ok: boolean; error?: string }> => {
      console.log('[useAuth] login attempt for:', email);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      console.log('[useAuth] signInWithPassword result — error:', error?.message, 'user:', data?.user?.id);
      if (error) return { ok: false, error: error.message };
      return { ok: true };
    },
    [],
  );

  const loginWithGoogle = useCallback(async (): Promise<{ ok: boolean; error?: string }> => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  }, []);

  const signup = useCallback(
    async (payload: SignupPayload): Promise<{ ok: boolean; error?: string }> => {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: payload.email,
        password: payload.password,
        options: {
          // Skip email confirmation — user is immediately active
          data: { name: `${payload.firstName} ${payload.lastName}` },
        },
      });

      if (authError) return { ok: false, error: authError.message };
      if (!authData.user) return { ok: false, error: 'Inscription échouée. Réessayez.' };

      // Insert profile row
      const { error: profileError } = await supabase.from('profiles').insert({
        id: authData.user.id,
        name: `${payload.firstName} ${payload.lastName}`,
        company: payload.company,
        business_type: payload.businessType,
        city: payload.city,
      });

      if (profileError) {
        console.error('Profile insert error:', profileError.message);
        return { ok: false, error: profileError.message };
      }

      // Welcome notification
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
          name: patch.name ?? user.name,
          company: patch.company ?? user.company,
          city: patch.city ?? user.city,
        })
        .eq('id', user.id);

      if (error) { console.error('updateUser error:', error.message); return; }
      setUser({ ...user, ...patch });
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
