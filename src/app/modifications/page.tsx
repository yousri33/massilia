'use client'

import { Header } from "@/components/ui/header-2";
import { Footer } from "@/components/Footer";
import { ServiceDetail } from "@/components/ServiceDetail";
import { Pencil } from "lucide-react";

export default function ModificationsPage() {
  const slide = {
    number: '04',
    tag: 'Modifications & Formalités',
    icon: Pencil,
    title: 'Évoluez sans\nfriction administrative',
    description: 'Changement de siège, augmentation de capital, modification de statuts — toutes vos formalités légales traitées rapidement et sans stress.',
    cta: 'Modifier mon entreprise',
    stats: [
      { value: '3 jours', label: 'Traitement moyen' },
      { value: '100%', label: 'En ligne' },
    ],
    accent: '#EF6C77',
    id: 's4',
  };

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <ServiceDetail slide={slide} />
      <Footer />
    </main>
  );
}
