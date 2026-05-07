'use client'

import React from 'react'
import { CreativePricing, type PricingTier } from "@/components/ui/creative-pricing"
import { SpeedAssurance } from "@/components/ui/speed-assurance"
import { Sparkles, Zap, Star, Layout, Heart, Shield, Bot, Users } from "lucide-react"

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
  return (
    <section id="offres" className="py-24 bg-background relative overflow-hidden">
      {/* Enhanced background interest */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full h-[600px] bg-coral/5 blur-[180px] pointer-events-none opacity-40" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <CreativePricing 
          tag="Packs d'Intervention" 
          title="Des solutions adaptées à chaque étape"
          description="Des tarifs transparents pour propulser votre croissance sur le marché algérien."
          tiers={packTiers} 
        />

        <div className="mt-8">
          <CreativePricing 
            tag="Abonnements" 
            title="Votre conformité en continu"
            description="Une protection juridique d'exception pour libérer votre ambition."
            tiers={abonnementTiers} 
          />
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
