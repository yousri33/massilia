'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, ArrowRight, X } from 'lucide-react'
import { useState } from 'react'

export const NanoBanner = () => {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="bg-navy text-white py-1.5 overflow-hidden relative"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between sm:justify-center gap-4 text-xs font-semibold tracking-wide">
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-white/80 animate-pulse" />
              <p>
                OFFRE SPÉCIALE : Création d’entreprise + Conformité Loi 18-07 = <span className="underline decoration-white/40 decoration-2 underline-offset-4">Premier mois offert</span>
              </p>
            </div>
            
            <a 
              href="#offre" 
              className="hidden sm:flex items-center gap-1 group transition-all"
            >
              Découvrir l'offre
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </a>

            {/* Manual close button if needed */}
            <button 
              onClick={() => setIsVisible(false)}
              className="sm:absolute sm:right-4 text-white/60 hover:text-white transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
