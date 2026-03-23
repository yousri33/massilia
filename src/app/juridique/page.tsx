'use client'

import { Header } from "@/components/ui/header-2";
import { Footer } from "@/components/Footer";
import { ServiceDetail } from "@/components/ServiceDetail";
import { Scale } from "lucide-react";

export default function JuridiquePage() {
  const slide = {
    number: '03',
    tag: 'Juridique & Contrats',
    icon: Scale,
    title: 'Protégez-vous\navec des contrats béton',
    description: 'Contrats commerciaux, CGV, accords de confidentialité — nos avocats rédigent des documents sur mesure qui vous protègent réellement.',
    cta: 'Consulter un avocat',
    stats: [
      { value: '+200', label: 'Modèles disponibles' },
      { value: '48h', label: 'Délai de livraison' },
    ],
    accent: '#1D3D5D',
    id: 's3',
  };

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <ServiceDetail slide={slide} />
      <Footer />
    </main>
  );
}
