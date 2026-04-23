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
        // TOKEN_REFRESHED fires every time the user switches browser tabs.
        // Never set isLoading for it — just silently update the session.
        const silentEvent = event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION';

        if (event === 'SIGNED_OUT') {
          setUser(null);
          setIsLoading(false);
          return;
        }

        if (session?.user) {
          if (!silentEvent) setIsLoading(true);
          const profile = await fetchProfile(session.user.id);
          setUser(sessionToUser(session.user, profile ?? {}));
          if (!silentEvent) setIsLoading(false);
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
      const fullName = `${payload.firstName} ${payload.lastName}`;

      // Pass all profile fields in user_metadata so the DB trigger can create
      // the profile row even when email confirmation is required (no session yet)
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: payload.email,
        password: payload.password,
        options: {
          data: {
            name: fullName,
            company: payload.company,
            business_type: payload.businessType,
            city: payload.city,
          },
        },
      });

      if (authError) return { ok: false, error: authError.message };
      if (!authData.user) return { ok: false, error: 'Inscription échouée. Réessayez.' };

      // If a session exists (email confirmation disabled), upsert the profile
      // and send the welcome notification. The trigger already created the row,
      // so we use upsert to avoid conflicts.
      if (authData.session) {
        await supabase.from('profiles').upsert({
          id: authData.user.id,
          name: fullName,
          company: payload.company,
          business_type: payload.businessType,
          city: payload.city,
        });

        await insertNotification(
          authData.user.id,
          'Bienvenue sur Legal Pilot ! 👋',
          'Complétez votre diagnostic pour obtenir votre score de conformité.',
          'action',
        );
      }

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
