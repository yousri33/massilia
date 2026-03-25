'use client'

import React from 'react'
import { CreativePricing, type PricingTier } from "@/components/ui/creative-pricing"
import { SpeedAssurance } from "@/components/ui/speed-assurance"
import { Sparkles, Zap, Star, Layout, Heart } from "lucide-react"

const packTiers: (PricingTier & { unit: string })[] = [
  {
    name: 'Pack Création',
    price: 19900,
    unit: 'DA HT',
    description: 'L\'essentiel pour un départ propre et structuré.',
    icon: <Zap className="w-7 h-7" />,
    color: 'coral',
    features: [
      'Rédaction des statuts',
      'Annonce légale incluse',
      'Assistance juriste dédiée',
      'Dossier CNRC complet',
      'KBIS reçu sous 48h'
    ],
  },
  {
    name: 'Pack Zen (Expert)',
    price: 0,
    unit: 'DA HT',
    description: 'Le gold standard de l\'entrepreneur moderne.',
    icon: <Star className="w-7 h-7" />,
    color: 'navy',
    features: [
      'Tout le Pack Création',
      'Modèles de contrats',
      'Logiciel de gestion',
      'Support prioritaire 24/7',
      'Accès Premium illimité'
    ],
    popular: true,
  },
  {
    name: 'Pack Modification',
    price: 14500,
    unit: 'DA HT',
    description: 'Faites évoluer votre structure sans friction.',
    icon: <Layout className="w-7 h-7" />,
    color: 'coral',
    features: [
      'Transfert de siège',
      'Changement de gérant',
      'Augmentation de capital',
      'Mise à jour des statuts',
      'Assistance formalités'
    ],
  },
]

export const PacksSection = () => {
  return (
    <section id="offres" className="py-24 bg-background relative overflow-hidden">
      {/* Enhanced background interest */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full h-[600px] bg-coral/5 blur-[180px] pointer-events-none opacity-40" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <CreativePricing 
          tag="L'Innovation Juridique en Algérie" 
          title="Investissez dans votre propre succès"
          description="Des tarifs transparents, sans frais cachés, pour propulser votre croissance sur le marché algérien."
          tiers={packTiers.map(p => ({
            ...p,
            price: p.price.toLocaleString('fr-FR')
          }))} 
        />

        <div className="mt-20">
          <SpeedAssurance />
        </div>
      </div>
      
    </section>
  )
}
