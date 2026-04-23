'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';

function BrandedLoader() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8f9fc]">
      <motion.div
        className="flex flex-col items-center gap-6"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Logo + spinner ring */}
        <div className="relative w-20 h-20 flex items-center justify-center">
          {/* Spinning ring */}
          <svg
            className="absolute inset-0 w-full h-full animate-spin"
            viewBox="0 0 80 80"
            style={{ animationDuration: '1.4s' }}
          >
            <circle
              cx="40" cy="40" r="34"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="4"
            />
            <circle
              cx="40" cy="40" r="34"
              fill="none"
              stroke="#EF6C77"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="60 154"
              strokeDashoffset="0"
            />
          </svg>

          {/* Logo centered inside ring */}
          <div className="w-12 h-12 rounded-xl overflow-hidden shadow-sm flex items-center justify-center bg-white">
            <Image
              src="/logo.png"
              alt="Legal Pilot"
              width={40}
              height={40}
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Brand name */}
        <div className="text-center">
          <p className="text-navy font-black text-lg tracking-tight">
            Legal <span className="text-coral">Pilot</span>
          </p>
          <motion.p
            className="text-slate-400 text-xs font-medium mt-1"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.6, repeat: Infinity }}
          >
            Chargement de votre espace…
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/auth/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated) {
    return <BrandedLoader />;
  }

  return <>{children}</>;
}
