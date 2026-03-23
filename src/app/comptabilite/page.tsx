'use client'

import { Header } from "@/components/ui/header-2";
import { Footer } from "@/components/Footer";
import { ServiceDetail } from "@/components/ServiceDetail";
import { Calculator } from "lucide-react";

export default function ComptabilitePage() {
  const slide = {
    number: '02',
    tag: 'Comptabilité',
    icon: Calculator,
    title: 'Vos comptes,\nen ordre parfait',
    description: "Bilan, TVA, paie — nos experts-comptables certifiés s'occupent de tout. Vous vous concentrez sur votre croissance, pas sur les chiffres.",
    cta: 'Voir les offres',
    stats: [
      { value: '100%', label: 'Conformité fiscale' },
      { value: '0 DA', label: 'Pénalités garanties' },
    ],
    accent: '#EF6C77',
    id: 's2',
  };

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <ServiceDetail slide={slide} />
      <Footer />
    </main>
  );
}
