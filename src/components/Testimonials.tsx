'use client'

import { TestimonialsSection } from "@/components/ui/testimonials-with-marquee"

const testimonials = [
  {
    author: {
      name: "Sami Benali",
      handle: "@sami_dev",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    text: "Une simplicité déconcertante. J'ai créé ma SARL en moins de 48h sans aucun déplacement ! Un gain de temps précieux pour mon activité.",
    href: "#"
  },
  {
    author: {
      name: "Lina Mansouri",
      handle: "@lina_ecommerce",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face"
    },
    text: "Enfin une solution digitale en Algérie qui fonctionne vraiment ! Ma création d'entreprise a été fluide et rapide.",
    href: "#"
  },
  {
    author: {
      name: "Karim Ziani",
      handle: "@karimz",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face"
    },
    text: "Le support client est exceptionnel. J'ai eu une réponse d'un expert juridique en moins de 2h pour mes contrats.",
    href: "#"
  },
  {
    author: {
      name: "Amel B.",
      handle: "@amel_startup",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face"
    },
    text: "L'interface est intuitive et les documents sont stockés en toute sécurité. Plus besoin de chercher mes Kbis partout !",
    href: "#"
  }
]

export const Testimonials = () => {
  return (
    <TestimonialsSection
      title="Ils nous font confiance"
      description="Découvrez pourquoi des centaines d'entrepreneurs ont choisi Legal Pilot pour propulser leur croissance."
      testimonials={testimonials}
    />
  )
}

export default Testimonials
