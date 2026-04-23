'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

const schema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Minimum 6 caractères'),
});
type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const { login, loginWithGoogle, isAuthenticated, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/espace-client');
    }
  }, [isAuthenticated, isLoading, router]);

  const onSubmit = async (data: FormData) => {
    setServerError('');
    setIsSubmitting(true);
    const result = await login(data.email, data.password);
    setIsSubmitting(false);
    if (result.ok) {
      // Wait for auth state to update before redirecting
      setTimeout(() => {
        router.push('/espace-client');
      }, 500);
    } else {
      setServerError(result.error ?? 'Erreur de connexion.');
    }
  };

  const handleGoogleLogin = async () => {
    setServerError('');
    setIsGoogleLoading(true);
    const result = await loginWithGoogle();
    setIsGoogleLoading(false);
    if (!result.ok) {
      setServerError(result.error ?? 'Erreur de connexion Google.');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left — brand panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-navy flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle at 30% 50%, #EF6C77 0%, transparent 60%), radial-gradient(circle at 80% 20%, #ffffff 0%, transparent 50%)',
          }}
        />
        <div className="relative z-10">
          <Link href="/">
            <Image src="/logo.png" alt="Massilia Legal" width={140} height={40} className="brightness-0 invert" />
          </Link>
        </div>
        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2">
            <ShieldCheck className="w-4 h-4 text-coral" />
            <span className="text-white/80 text-sm font-bold">Plateforme sécurisée</span>
          </div>
          <h2 className="text-4xl font-serif text-white leading-tight">
            Votre juridique,<br />
            <span className="text-coral">simplifié.</span>
          </h2>
          <p className="text-white/60 text-lg leading-relaxed max-w-sm">
            Accédez à tous vos dossiers, documents et experts juridiques en un seul endroit.
          </p>
          <div className="flex items-center gap-4 pt-4">
            {['+1 500 entreprises', '24h de délai', 'Droit algérien'].map((badge) => (
              <span key={badge} className="text-xs font-black text-white/50 tracking-widest uppercase">
                {badge}
              </span>
            ))}
          </div>
        </div>
        <div className="relative z-10 text-white/30 text-xs">
          © 2026 Massilia Legal. Tous droits réservés.
        </div>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-cream">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <div className="mb-8 lg:hidden">
            <Link href="/">
              <Image src="/logo.png" alt="Massilia Legal" width={120} height={36} />
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-serif font-black text-navy mb-2">
              Bon retour 👋
            </h1>
            <p className="text-navy/60 font-medium">
              Connectez-vous à votre espace client.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-black text-navy" htmlFor="email">
                Email professionnel
              </label>
              <Input
                id="email"
                type="email"
                placeholder="vous@entreprise.dz"
                autoComplete="email"
                {...register('email')}
                className="h-12 rounded-2xl border-navy/20 bg-white text-navy placeholder:text-navy/30 focus-visible:ring-coral"
              />
              {errors.email && (
                <p className="text-coral text-xs font-bold">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-black text-navy" htmlFor="password">
                Mot de passe
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  {...register('password')}
                  className="h-12 rounded-2xl border-navy/20 bg-white text-navy placeholder:text-navy/30 focus-visible:ring-coral pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-navy/40 hover:text-navy transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-coral text-xs font-bold">{errors.password.message}</p>
              )}
            </div>

            {serverError && (
              <div className="bg-coral/10 border border-coral/30 rounded-2xl p-3">
                <p className="text-coral text-sm font-bold">{serverError}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 bg-navy hover:bg-dark-navy text-white font-black rounded-2xl flex items-center justify-center gap-2 transition-all"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
              ) : (
                <>
                  Se connecter
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-3">
              <Separator className="flex-1" />
              <span className="text-xs font-bold text-navy/40 uppercase">Ou</span>
              <Separator className="flex-1" />
            </div>
            <Button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading}
              className="w-full h-12 bg-white hover:bg-slate-50 border border-navy/20 text-navy font-black rounded-2xl flex items-center justify-center gap-2 transition-all"
            >
              {isGoogleLoading ? (
                <div className="w-5 h-5 rounded-full border-2 border-navy border-t-transparent animate-spin" />
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Connexion avec Google
                </>
              )}
            </Button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-navy/50 text-sm font-medium">
              Pas encore de compte ?{' '}
              <Link
                href="/auth/signup"
                className="text-coral font-black hover:underline"
              >
                Créer mon compte
              </Link>
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-navy/10 text-center">
            <Link href="/" className="text-navy/40 text-xs font-bold hover:text-navy transition-colors">
              ← Retour à l&apos;accueil
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
