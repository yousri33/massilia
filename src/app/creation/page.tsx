'use client'

import { Header } from "@/components/ui/header-2";
import { Footer } from "@/components/Footer";
import { ServiceDetail } from "@/components/ServiceDetail";
import { FileText } from "lucide-react";

export default function CreationPage() {
  const slide = {
    number: '01',
    tag: "Création d'entreprise",
    icon: FileText,
    title: 'Lancez votre\nentreprise en 24h',
    description: "De l'idée à l'immatriculation, nos juristes gèrent toute la paperasse. SARL, SAS, Auto-entrepreneur — nous choisissons la meilleure structure pour vous.",
    cta: 'Créer mon entreprise',
    stats: [
      { value: '+1,500', label: 'Entreprises créées' },
      { value: '24h', label: 'Délai moyen' },
    ],
    accent: '#1D3D5D',
    id: 's1',
  };

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <ServiceDetail slide={slide} />
      <Footer />
    </main>
  );
}
