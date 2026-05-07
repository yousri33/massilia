'use client'

import React from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button'

const TRUST_BADGES = [
  { icon: '🏛️', label: 'Avocat certifié' },
  { icon: '🔒', label: 'Loi 18-07' },
  { icon: '⚡', label: 'Réponse 24h' },
  { icon: '🇩🇿', label: 'Droit algérien' },
]

const TAGLINES = [
  { prefix: 'Votre entreprise,', highlight: 'conforme', suffix: '— en 24h.' },
  { prefix: 'Votre conformité', highlight: 'Loi 18-07', suffix: 'maîtrisée — en 24h.' },
  { prefix: 'Votre structure,', highlight: 'sécurisée', suffix: '— en 24h.' },
]

const HeroSection = () => {
  const [currentWordIndex, setCurrentWordIndex] = React.useState(0)

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % TAGLINES.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const handleScrollToHowItWorks = () => {
    const el = document.getElementById('how-it-works')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="min-h-screen flex items-center justify-center pt-20 lg:pt-24 pb-12 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Content */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border-2 border-navy/10 bg-background shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-coral animate-pulse" />
              <span className="text-xs font-bold text-navy uppercase tracking-widest leading-none">
                L&apos;Innovation Juridique en Algérie
              </span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
            className="font-serif font-bold text-5xl sm:text-6xl lg:text-[4.5rem] leading-[1.1] tracking-tight mb-8 text-navy min-h-[3.3em]"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentWordIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              >
                {TAGLINES[currentWordIndex].prefix}{' '}
                <span className="text-coral">
                  {TAGLINES[currentWordIndex].highlight}
                </span>{' '}
                {TAGLINES[currentWordIndex].suffix}
              </motion.div>
            </AnimatePresence>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
            className="text-lg sm:text-xl text-navy/70 max-w-lg mb-8 leading-relaxed"
          >
            De la genèse de votre structure à l&apos;excellence de votre conformité Loi 18-07. 
            Une protection juridique d&apos;exception pour libérer votre ambition.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
            className="flex flex-row items-center justify-center lg:justify-start gap-3 w-full mb-8"
          >
            <Link href="/diagnostic" className="flex-1 sm:flex-none">
              <InteractiveHoverButton
                text="Évaluer mes besoins"
                className="w-full h-12 sm:h-14 px-6 sm:px-10 text-sm sm:text-base whitespace-nowrap z-30"
              />
            </Link>
            <button
              type="button"
              onClick={handleScrollToHowItWorks}
              className="flex-1 sm:flex-none h-12 sm:h-14 px-6 sm:px-8 rounded-full border-2 border-navy/15 bg-transparent text-navy text-sm sm:text-base font-black hover:border-navy/40 hover:bg-navy/5 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
            >
              Voir la démo <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex flex-wrap gap-2 justify-center lg:justify-start"
          >
            {TRUST_BADGES.map((badge) => (
              <span
                key={badge.label}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-navy/5 border border-navy/10 text-xs font-black text-navy"
              >
                {badge.icon} {badge.label}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Desktop Video Area */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="hidden lg:block relative"
        >
          <div className="relative z-10 w-full aspect-[4/3] overflow-hidden rounded-[2.5rem]">
            <video
              src="/kling_20260323_Image_to_Video_animate_th_1331_0.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="relative w-[110%] left-[-5%] h-[110%] object-cover object-bottom"
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export const ParallaxFlow = () => {
  return (
    <div className="relative">
      <HeroSection />
    </div>
  )
}
