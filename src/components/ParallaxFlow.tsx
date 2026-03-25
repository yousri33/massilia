'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Play } from 'lucide-react'
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button'

// ─── Hero Section ───────────────────────────────────────────
const HeroSection = () => {
  const verbs = ["Lancez", "Gérez", "Protégez"]
  const [verbIndex, setVerbIndex] = React.useState(0)

  React.useEffect(() => {
    const timer = setInterval(() => {
      setVerbIndex((prev) => (prev + 1) % verbs.length)
    }, 2500)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="min-h-screen flex items-center justify-center pt-20 lg:pt-24 pb-12 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Content */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border-2 border-navy/10 bg-background shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-navy animate-pulse" />
              <span className="text-xs font-bold text-navy uppercase tracking-widest leading-none">
                L&apos;Innovation Juridique en Algérie
              </span>
            </div>
          </motion.div>

          <h1 className="font-serif font-bold text-5xl sm:text-6xl lg:text-[5.5rem] leading-[1.05] tracking-tight mb-8">
            <div className="h-[1.2em] relative overflow-hidden flex justify-center lg:justify-start">
              <motion.span 
                key={verbs[verbIndex]}
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "-100%", opacity: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="text-coral block"
              >
                {verbs[verbIndex]}
              </motion.span>
            </div>
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="text-navy block"
            >
              votre entreprise <br />
              <span className="relative">
                sans effort
                <motion.span 
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1, delay: 1 }}
                  className="absolute bottom-1 left-0 w-full h-1 bg-coral origin-left"
                />
              </span>
            </motion.span>
          </h1>

          {/* Mobile Video Area */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="lg:hidden w-full mb-10 -mt-8 transition-all"
          >
            <div className="relative z-10 w-full aspect-[4/3] overflow-hidden">
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

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="text-lg sm:text-xl text-navy/80 max-w-lg mb-10 leading-relaxed"
          >
            Juristes et avocats réunis sur{' '}
            <span className="font-bold text-navy">la plateforme #1 pour entreprendre.</span>
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            className="flex flex-row items-center justify-center lg:justify-start gap-3 w-full"
          >
            <InteractiveHoverButton 
              text="Démarrer" 
              className="flex-1 sm:flex-none h-12 sm:h-16 px-4 sm:px-12 text-sm sm:text-lg whitespace-nowrap z-30"
            />
            <InteractiveHoverButton 
              text="Infos" 
              variant="coral"
              icon={<Play size={14} fill="white" />}
              className="flex-1 sm:flex-none h-12 sm:h-16 px-4 sm:px-8 text-sm sm:text-lg whitespace-nowrap border-coral/30"
            />
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
          <div className="relative z-10 w-full aspect-[4/3] md:aspect-[4/3] overflow-hidden rounded-[2.5rem]">
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

// ─── Main Component ──────────────────────────────────────────
export const ParallaxFlow = () => {
  return (
    <div className="relative">
      <HeroSection />
    </div>
  )
}