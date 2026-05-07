'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CreativePricing, type PricingTier } from "@/components/ui/creative-pricing"
import { SpeedAssurance } from "@/components/ui/speed-assurance"
import { Sparkles, Zap, Star, Layout, Heart, Shield, Bot, Users } from "lucide-react"
import { cn } from "@/lib/utils"

const packTiers: (PricingTier & { unit: string })[] = [
  {
    name: 'Pack Création & Structuration',
    price: 'Sur devis',
    unit: '',
    description: 'Startups / nouvelles entreprises',
    icon: <Zap className="w-7 h-7" />,
    color: 'coral',
    features: [
      'Choix forme juridique',
      'Rédaction des statuts',
      'Constitution dossier légal',
      'Immatriculation',
      'Conseils organisationnels',
      'Génération documents'
    ],
  },
  {
    name: 'Pack Modification & Mise à jour',
    price: 'Sur devis',
    unit: '',
    description: 'PME / entreprises en évolution',
    icon: <Layout className="w-7 h-7" />,
    color: 'navy',
    features: [
      'Modification des statuts',
      'Changement gérance / siège',
      'Mise à jour documents légaux',
      'Renouvellement contrats'
    ],
    popular: true,
  },
  {
    name: 'Pack Fermeture / Dissolution',
    price: 'Sur devis',
    unit: '',
    description: 'Entreprises en fin de cycle',
    icon: <Shield className="w-7 h-7" />,
    color: 'coral',
    features: [
      'Procédure de dissolution',
      'PV assemblée',
      'Liquidation',
      'Radiation registre'
    ],
  },
]

const abonnementTiers: (PricingTier & { unit: string })[] = [
  {
    name: 'Abonnement Suivi & Conformité',
    price: 'Sur devis',
    unit: '/ mois',
    description: 'Toutes entreprises',
    icon: <Heart className="w-7 h-7" />,
    color: 'navy',
    features: [
      'Veille réglementaire',
      'Alertes légales',
      'Mise à jour documents',
      'Tableau de bord conformité'
    ],
    popular: true,
  },
  {
    name: 'Abonnement DPO externalisé',
    price: 'Sur devis',
    unit: '/ mois',
    description: 'Entreprises traitant des données',
    icon: <Star className="w-7 h-7" />,
    color: 'coral',
    features: [
      'Cartographie des traitements',
      'Registre RGPD (ou équivalent)',
      'Déclarations ANPDP',
      'Suivi conformité données'
    ],
  },
]

export const PacksSection = () => {
  const [activeTab, setActiveTab] = React.useState<'packs' | 'abonnements'>('packs')
  const [direction, setDirection] = React.useState(1)

  const handleSwitch = (tab: 'packs' | 'abonnements') => {
    setDirection(tab === 'abonnements' ? 1 : -1)
    setActiveTab(tab)
  }

  return (
    <section id="offres" className="py-24 bg-background relative overflow-hidden">
      {/* Enhanced background interest */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full h-[600px] bg-coral/5 blur-[180px] pointer-events-none opacity-40" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Animated Header */}
        <div className="text-center space-y-6 mb-10 relative z-10">
          <div className="flex justify-center">
            <motion.div
              key={activeTab + '-badge'}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15 }}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border-2 border-navy/10 bg-background shadow-sm"
            >
              <span className="flex h-2 w-2 rounded-full bg-coral animate-pulse" />
              <span className="text-[10px] font-bold text-navy uppercase tracking-widest leading-none">
                {activeTab === 'packs' ? "Packs d'Intervention" : "Abonnements"}
              </span>
            </motion.div>
          </div>

          <div className="relative inline-block overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.h2
                key={activeTab + '-title'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
                className="font-serif font-bold text-4xl sm:text-5xl lg:text-6xl text-navy leading-[1.1] tracking-tight px-4"
              >
                {activeTab === 'packs' ? "Des solutions adaptées à chaque étape" : "Votre conformité en continu"}
                <div className="absolute -right-12 top-0 text-3xl animate-pulse rotate-12 hidden md:block">✨</div>
              </motion.h2>
            </AnimatePresence>
          </div>

          <AnimatePresence mode="wait">
            <motion.p
              key={activeTab + '-desc'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
              className="font-medium text-lg sm:text-xl text-navy/60 max-w-2xl mx-auto leading-relaxed italic"
            >
              {activeTab === 'packs'
                ? "Des tarifs transparents pour propulser votre croissance sur le marché algérien."
                : "Une protection juridique d'exception pour libérer votre ambition."}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Premium Toggle Switch */}
        <div className="flex justify-center mb-2 relative z-20">
          <div className="relative inline-flex items-center bg-navy/[0.04] border border-navy/10 rounded-2xl p-1.5 gap-0 shadow-[inset_0_1px_4px_rgba(0,0,0,0.06)]">

            {/* Sliding active pill with LayoutId */}
            <motion.div
              layout
              layoutId="active-pill"
              transition={{ type: 'spring', stiffness: 700, damping: 40, mass: 0.6 }}
              className={cn(
                "absolute top-1.5 bottom-1.5 left-1.5 rounded-xl pointer-events-none",
                "shadow-[0_4px_20px_rgba(239,108,119,0.45)]",
                activeTab === 'packs'
                  ? "w-[calc(50%-6px)] bg-coral"
                  : "w-[calc(50%-6px)] translate-x-full bg-coral"
              )}
            />

            <button
              onClick={() => handleSwitch('packs')}
              className={cn(
                "relative z-10 flex items-center justify-center gap-2 w-44 py-3.5 px-4 rounded-xl text-sm font-black uppercase tracking-widest transition-colors duration-200 select-none",
                activeTab === 'packs' ? "text-white" : "text-navy/40 hover:text-navy/70"
              )}
            >
              <motion.span animate={{ scale: activeTab === 'packs' ? 1.12 : 1 }} transition={{ type: 'spring', stiffness: 600, damping: 25 }}>
                <Layout size={15} className="shrink-0" />
              </motion.span>
              Packs
            </button>

            <button
              onClick={() => handleSwitch('abonnements')}
              className={cn(
                "relative z-10 flex items-center justify-center gap-2 w-44 py-3.5 px-4 rounded-xl text-sm font-black uppercase tracking-widest transition-colors duration-200 select-none",
                activeTab === 'abonnements' ? "text-white" : "text-navy/40 hover:text-navy/70"
              )}
            >
              <motion.span animate={{ scale: activeTab === 'abonnements' ? 1.12 : 1 }} transition={{ type: 'spring', stiffness: 600, damping: 25 }}>
                <Sparkles size={15} className="shrink-0" />
              </motion.span>
              Abonnements
            </button>

          </div>
        </div>

        {/* Animated Content */}
        <div className="overflow-hidden -mt-4">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={activeTab}
              custom={direction}
              initial={{ opacity: 0, x: direction * 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -30 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            >
              {activeTab === 'packs' ? (
                <CreativePricing tiers={packTiers} />
              ) : (
                <CreativePricing tiers={abonnementTiers} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Extra Features Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="p-8 rounded-3xl bg-navy/5 border border-navy/10 flex items-start gap-4 hover:shadow-lg transition-all">
            <div className="w-12 h-12 rounded-xl bg-coral/10 text-coral flex items-center justify-center shrink-0">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xl font-serif font-bold text-navy mb-2">Chat bot intégré</h4>
              <p className="text-navy/70 font-medium">Un assistant IA disponible 24/7 pour répondre à toutes vos questions juridiques de premier niveau.</p>
            </div>
          </div>
          
          <div className="p-8 rounded-3xl bg-coral/5 border border-coral/10 flex items-start gap-4 hover:shadow-lg transition-all">
            <div className="w-12 h-12 rounded-xl bg-navy/10 text-navy flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xl font-serif font-bold text-navy mb-2">Réseau d'avocats</h4>
              <p className="text-navy/70 font-medium">Accès privilégié à nos avocats partenaires, prise de rendez-vous et consultations légales personnalisées.</p>
            </div>
          </div>
        </div>

        <div className="mt-20">
          <SpeedAssurance />
        </div>
      </div>
      
    </section>
  )
}
