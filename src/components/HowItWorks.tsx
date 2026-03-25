'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { FileSearch, UserCheck, ShieldCheck, ArrowRight, PlayCircle } from 'lucide-react'
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button'

const steps = [
  {
    title: 'Exprimez votre besoin',
    desc: 'Répondez à quelques questions en ligne. Notre algorithme identifie la meilleure solution pour vous.',
    icon: FileSearch,
    num: 1,
  },
  {
    title: 'Dialogue avec un expert',
    desc: 'Un juriste dédié valide votre dossier sous 24h et répond à toutes vos questions.',
    icon: UserCheck,
    num: 2,
  },
  {
    title: 'Obtenez vos documents',
    desc: 'Kbis, statuts ou contrats : recevez vos documents officiels directement dans votre espace client sécurisé.',
    icon: ShieldCheck,
    num: 3,
  },
]

export const HowItWorks = () => {
  return (
    <section className="py-16 bg-background relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-[550px] h-[550px] bg-coral/5 rounded-full blur-[140px] -ml-64 -mt-32 pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-[450px] h-[450px] bg-navy/5 rounded-full blur-[100px] -mr-64 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center mb-8"
        >
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border-2 border-coral/10 bg-coral/5 backdrop-blur-sm shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-coral animate-pulse" />
            <span className="text-[10px] font-black text-coral uppercase tracking-widest leading-none">
              Le Processus
            </span>
          </div>
        </motion.div>

        {/* Heading */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="font-serif font-bold text-3xl sm:text-4xl text-navy mb-5 leading-tight">
            Votre entreprise <br />
            <span className="text-coral italic">clés en main</span> sous 48h.
          </h2>
          <p className="text-navy/60 font-medium text-base leading-relaxed max-w-xl mx-auto">
            Oubliez les files d'attente et les dossiers incomplets. Nous avons simplifié le complexe pour vous.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connector line */}
          <div className="hidden lg:block absolute top-1/2 -translate-y-[80px] left-[16.6%] right-[16.6%] h-[2px] bg-navy/5 overflow-hidden">
            <motion.div 
              initial={{ x: '-100%' }}
              whileInView={{ x: '100%' }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
              className="h-full w-full bg-gradient-to-r from-transparent via-coral/50 to-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative z-10">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="flex flex-col items-center text-center group"
              >
                <div className="relative mb-8">
                  {/* Icon Container */}
                  <div className="w-24 h-24 rounded-[2rem] bg-background border-2 border-navy/10 shadow-xl flex items-center justify-center relative group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500 overflow-hidden">
                    <step.icon size={36} className={i === 1 ? "text-coral" : "text-navy"} />
                    <div className="absolute inset-0 bg-gradient-to-br from-coral/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  
                  {/* Number Badge */}
                  <div className="absolute -top-3 -right-3 w-10 h-10 bg-navy text-white rounded-2xl flex items-center justify-center font-bold text-sm shadow-lg border-4 border-background group-hover:bg-coral transition-colors duration-300">
                    {step.num}
                  </div>
                </div>

                <h3 className="font-sans font-black text-xl text-navy mb-3 tracking-tight group-hover:text-coral transition-colors">
                  {step.title}
                </h3>
                <p className="text-navy/60 font-medium leading-relaxed text-sm max-w-[260px]">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}