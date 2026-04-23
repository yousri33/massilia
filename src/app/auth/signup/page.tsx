'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { BusinessType } from '@/lib/types';

const step1Schema = z
  .object({
    firstName: z.string().min(2, 'Minimum 2 caractères'),
    lastName: z.string().min(2, 'Minimum 2 caractères'),
    email: z.string().email('Email invalide'),
    password: z.string().min(6, 'Minimum 6 caractères'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  });

const step2Schema = z.object({
  company: z.string().min(2, 'Minimum 2 caractères'),
  businessType: z.enum(['SARL', 'EURL', 'SPA', 'Auto-entrepreneur', 'SNC', 'Autre']),
  city: z.string().min(2, 'Minimum 2 caractères'),
});

type Step1Data = z.infer<typeof step1Schema>;
type Step2Data = z.infer<typeof step2Schema>;

const businessTypes: BusinessType[] = ['SARL', 'EURL', 'SPA', 'Auto-entrepreneur', 'SNC', 'Autre'];

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
};

export default function SignupPage() {
  const router = useRouter();
  const { signup, isAuthenticated, isLoading } = useAuth();
  const [step, setStep] = useState<1 | 2>(1);
  const [direction, setDirection] = useState(1);
  const [step1Data, setStep1Data] = useState<Step1Data | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/espace-client');
    }
  }, [isAuthenticated, isLoading, router]);

  const form1 = useForm<Step1Data>({ resolver: zodResolver(step1Schema) });
  const form2 = useForm<Step2Data>({ resolver: zodResolver(step2Schema) });

  const handleStep1 = (data: Step1Data) => {
    setStep1Data(data);
    setDirection(1);
    setStep(2);
  };

  const handleBack = () => {
    setDirection(-1);
    setStep(1);
  };

  const handleStep2 = async (data: Step2Data) => {
    if (!step1Data) return;
    setServerError('');
    setIsSubmitting(true);
    const result = await signup({
      ...step1Data,
      company: data.company,
      businessType: data.businessType as BusinessType,
      city: data.city,
    });
    setIsSubmitting(false);
    if (result.ok) {
      router.push('/espace-client');
    } else {
      setServerError(result.error ?? 'Erreur lors de la création du compte.');
      setDirection(-1);
      setStep(1);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left — brand panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-navy flex-col justify-between p-12 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'radial-gradient(circle at 70% 40%, #EF6C77 0%, transparent 60%), radial-gradient(circle at 20% 80%, #ffffff 0%, transparent 50%)',
          }}
        />
        <div className="relative z-10">
          <Link href="/">
            <Image src="/logo.png" alt="Massilia Legal" width={140} height={40} className="brightness-0 invert" />
          </Link>
        </div>
        <div className="relative z-10 space-y-6">
          <h2 className="text-4xl font-serif text-white leading-tight">
            Rejoignez +1 500<br />
            <span className="text-coral">entrepreneurs</span>
          </h2>
          <p className="text-white/60 text-lg leading-relaxed max-w-sm">
            Créez votre compte en 2 minutes et obtenez votre diagnostic juridique gratuit.
          </p>
          <div className="space-y-3">
            {[
              '✓ Diagnostic juridique gratuit',
              '✓ Accès à votre Legal Drive',
              '✓ Assistant IA disponible 24h/24',
              '✓ Avocats partenaires certifiés',
            ].map((item) => (
              <p key={item} className="text-white/70 font-bold text-sm">
                {item}
              </p>
            ))}
          </div>
        </div>
        <div className="relative z-10 text-white/30 text-xs">
          © 2026 Massilia Legal. Tous droits réservés.
        </div>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-cream overflow-hidden">
        <div className="w-full max-w-md">
          <div className="mb-6 lg:hidden">
            <Link href="/">
              <Image src="/logo.png" alt="Massilia Legal" width={120} height={36} />
            </Link>
          </div>

          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-3xl font-serif font-black text-navy">
                {step === 1 ? 'Créer mon compte' : 'Mon entreprise'}
              </h1>
              <span className="text-navy/40 text-sm font-black">{step}/2</span>
            </div>
            <div className="h-1.5 bg-navy/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-coral rounded-full"
                animate={{ width: `${(step / 2) * 100}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
          </div>

          {serverError && (
            <div className="mb-4 bg-coral/10 border border-coral/30 rounded-2xl p-3">
              <p className="text-coral text-sm font-bold">{serverError}</p>
            </div>
          )}

          <div className="relative overflow-hidden">
            <AnimatePresence custom={direction} mode="wait">
              {step === 1 ? (
                <motion.form
                  key="step1"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  onSubmit={form1.handleSubmit(handleStep1)}
                  className="space-y-5"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-black text-navy">Prénom</label>
                      <Input
                        {...form1.register('firstName')}
                        placeholder="Yousri"
                        className="h-12 rounded-2xl border-navy/20 bg-white text-navy placeholder:text-navy/30 focus-visible:ring-coral"
                      />
                      {form1.formState.errors.firstName && (
                        <p className="text-coral text-xs font-bold">{form1.formState.errors.firstName.message}</p>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-black text-navy">Nom</label>
                      <Input
                        {...form1.register('lastName')}
                        placeholder="Aberkane"
                        className="h-12 rounded-2xl border-navy/20 bg-white text-navy placeholder:text-navy/30 focus-visible:ring-coral"
                      />
                      {form1.formState.errors.lastName && (
                        <p className="text-coral text-xs font-bold">{form1.formState.errors.lastName.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-black text-navy">Email professionnel</label>
                    <Input
                      {...form1.register('email')}
                      type="email"
                      placeholder="vous@entreprise.dz"
                      autoComplete="email"
                      className="h-12 rounded-2xl border-navy/20 bg-white text-navy placeholder:text-navy/30 focus-visible:ring-coral"
                    />
                    {form1.formState.errors.email && (
                      <p className="text-coral text-xs font-bold">{form1.formState.errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-black text-navy">Mot de passe</label>
                    <div className="relative">
                      <Input
                        {...form1.register('password')}
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        autoComplete="new-password"
                        className="h-12 rounded-2xl border-navy/20 bg-white text-navy placeholder:text-navy/30 focus-visible:ring-coral pr-12"
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-navy/40 hover:text-navy transition-colors">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {form1.formState.errors.password && (
                      <p className="text-coral text-xs font-bold">{form1.formState.errors.password.message}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-black text-navy">Confirmer le mot de passe</label>
                    <div className="relative">
                      <Input
                        {...form1.register('confirmPassword')}
                        type={showConfirm ? 'text' : 'password'}
                        placeholder="••••••••"
                        autoComplete="new-password"
                        className="h-12 rounded-2xl border-navy/20 bg-white text-navy placeholder:text-navy/30 focus-visible:ring-coral pr-12"
                      />
                      <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-navy/40 hover:text-navy transition-colors">
                        {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {form1.formState.errors.confirmPassword && (
                      <p className="text-coral text-xs font-bold">{form1.formState.errors.confirmPassword.message}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-navy hover:bg-dark-navy text-white font-black rounded-2xl flex items-center justify-center gap-2"
                  >
                    Continuer <ArrowRight className="w-4 h-4" />
                  </Button>
                </motion.form>
              ) : (
                <motion.form
                  key="step2"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  onSubmit={form2.handleSubmit(handleStep2)}
                  className="space-y-5"
                >
                  <div className="space-y-1.5">
                    <label className="text-sm font-black text-navy">Nom de l&apos;entreprise</label>
                    <Input
                      {...form2.register('company')}
                      placeholder="Massilia Digital"
                      className="h-12 rounded-2xl border-navy/20 bg-white text-navy placeholder:text-navy/30 focus-visible:ring-coral"
                    />
                    {form2.formState.errors.company && (
                      <p className="text-coral text-xs font-bold">{form2.formState.errors.company.message}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-black text-navy">Forme juridique</label>
                    <select
                      {...form2.register('businessType')}
                      className="w-full h-12 rounded-2xl border border-navy/20 bg-white text-navy px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-coral"
                      defaultValue=""
                    >
                      <option value="" disabled>Sélectionner…</option>
                      {businessTypes.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                    {form2.formState.errors.businessType && (
                      <p className="text-coral text-xs font-bold">Veuillez sélectionner une forme juridique</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-black text-navy">Ville</label>
                    <Input
                      {...form2.register('city')}
                      placeholder="Alger"
                      className="h-12 rounded-2xl border-navy/20 bg-white text-navy placeholder:text-navy/30 focus-visible:ring-coral"
                    />
                    {form2.formState.errors.city && (
                      <p className="text-coral text-xs font-bold">{form2.formState.errors.city.message}</p>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      onClick={handleBack}
                      variant="outline"
                      className="flex-1 h-12 border-navy/20 text-navy font-black rounded-2xl flex items-center justify-center gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" /> Retour
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 h-12 bg-coral hover:bg-coral/90 text-white font-black rounded-2xl flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      ) : (
                        <>Créer mon compte <ArrowRight className="w-4 h-4" /></>
                      )}
                    </Button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-8 text-center">
            <p className="text-navy/50 text-sm font-medium">
              Déjà un compte ?{' '}
              <Link href="/auth/login" className="text-coral font-black hover:underline">
                Se connecter
              </Link>
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-navy/10 text-center">
            <Link href="/" className="text-navy/40 text-xs font-bold hover:text-navy transition-colors">
              ← Retour à l&apos;accueil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
