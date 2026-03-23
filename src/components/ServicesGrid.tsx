'use client'

import { motion } from 'framer-motion'
import { Rocket, FileEdit, Calculator, ShieldAlert, Scale, ChevronRight, Zap } from 'lucide-react'

const services = [
  { 
    title: 'Création d’entreprise', 
    desc: 'Choix forme juridique, obtention KBIS, Rédaction statuts.', 
    icon: Rocket,
    color: 'bg-navy/10',
    iconColor: 'text-navy'
  },
  { 
    title: 'Expertise-Comptable', 
    desc: 'Déclarations fiscales, approbation des comptes, tenue régulière.', 
    icon: Calculator,
    color: 'bg-coral/10',
    iconColor: 'text-coral'
  },
  { 
    title: 'Modifier mes statuts', 
    desc: 'Transfert de siège, cessions d’actions, augmentations de capital.', 
    icon: FileEdit,
    color: 'bg-navy/10',
    iconColor: 'text-navy'
  },
  { 
    title: 'Rédiger des contrats', 
    desc: 'CGV, contrats de prestation, pactes d’associés haut-de-gamme.', 
    icon: ShieldAlert,
    color: 'bg-coral/10',
    iconColor: 'text-coral'
  },
  { 
    title: 'Consulter un avocat', 
    desc: 'Droit des affaires, propriété intellectuelle, conseils juridiques.', 
    icon: Scale,
    color: 'bg-navy/10',
    iconColor: 'text-navy'
  },
]

export const ServicesGrid = () => {
  return (
    <section className="py-32 bg-background relative overflow-hidden">
      {/* Visual background interests */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-coral/5 rounded-full blur-[120px] -mr-64 -mt-32 opacity-40" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-navy/5 rounded-full blur-[100px] -ml-48 -mb-32 opacity-30" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center mb-12"
        >
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-coral/20 bg-background shadow-lg ring-4 ring-coral/5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-coral opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-coral"></span>
            </span>
            <span className="text-[10px] font-black text-coral uppercase tracking-[0.2em] leading-none">
              Nos Solutions
            </span>
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row items-end justify-between mb-24 gap-8">
          <div className="max-w-xl">
            <h2 className="font-serif font-black text-4xl sm:text-5xl lg:text-6xl text-navy leading-[1.1] mb-8">La plateforme pour <br/><span className="text-coral underline decoration-navy decoration-4 underline-offset-8">entreprendre.</span></h2>
            <p className="text-lg text-navy/75 font-medium leading-relaxed">
              Juristes, experts-comptables et avocats : accédez à une expertise d&apos;élite réunie sur une seule interface digitale.
            </p>
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-navy font-black text-lg border-b-2 border-navy hover:text-coral hover:border-coral transition-all pb-2 flex items-center gap-4 group"
          >
            Voir tout le catalogue
            <ChevronRight size={20} className="group-hover:translate-x-2 transition-transform duration-300" />
          </motion.button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.7, ease: "easeOut" }}
              viewport={{ once: true, margin: "-50px" }}
              className="group relative h-full"
            >
              <div className="absolute inset-0 bg-navy/5 rounded-[3rem] group-hover:bg-coral/5 transition-colors duration-500" />
              <div className="relative p-10 bg-background shadow-[0_20px_50px_-15px_rgba(29,61,93,0.08)] rounded-[3rem] hover:shadow-[0_40px_80px_-20px_rgba(29,61,93,0.15)] transition-all duration-500 flex flex-col h-full border border-navy/5 hover:border-coral/20 hover:-translate-y-3">
                <div className={`w-24 h-24 rounded-[2rem] flex items-center justify-center mb-10 group-hover:rotate-[15deg] transition-all duration-500 ${
                  service.color.includes('coral')
                    ? 'bg-gradient-to-br from-coral/15 to-coral/5 shadow-inner'
                    : 'bg-gradient-to-br from-navy/15 to-navy/5 shadow-inner'
                }`}>
                  <service.icon size={40} className={service.iconColor} />
                </div>
                <h3 className="text-2xl font-bold text-navy mb-5 tracking-tight group-hover:text-coral transition-colors">{service.title}</h3>
                <p className="text-navy/65 font-medium leading-[1.7] mb-10 flex-grow text-base">
                  {service.desc}
                </p>
                <button className="flex items-center gap-3 font-black text-navy uppercase text-xs tracking-widest group-hover:text-coral transition-all duration-300">
                  En savoir plus
                  <div className="w-8 h-8 rounded-full border border-navy group-hover:border-coral flex items-center justify-center transition-all">
                    <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>

                {/* Bottom accent stripe */}
                <div className="absolute bottom-10 right-10 opacity-10 group-hover:opacity-100 transition-opacity duration-500">
                   <Zap size={32} fill="currentColor" className="text-navy/10 group-hover:text-coral" />
                </div>
              </div>
            </motion.div>
          ))}
          
          {/* Card Special pour l’offre à 0€ */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="group relative"
          >
            <div className="absolute inset-0 bg-coral/30 rounded-[3rem] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative p-12 bg-navy rounded-[3rem] shadow-2xl flex flex-col justify-center text-white overflow-hidden border-2 border-white/10 hover:border-coral/40 transition-all duration-500 hover:scale-[1.02]">
              <div className="absolute top-[-20%] right-[-20%] w-60 h-60 bg-coral rounded-full blur-[80px] opacity-20 group-hover:opacity-40 transition-all duration-700" />
              <div className="absolute bottom-[-10%] left-[-10%] w-50 h-50 bg-white rounded-full blur-[100px] opacity-10" />

              <h3 className="text-4xl font-serif font-black mb-6 z-10 leading-tight">Démarrer à <span className="text-coral">0€</span></h3>
              <p className="text-white/80 mb-10 font-medium leading-relaxed z-10 text-lg">
                 Lancez votre activité sans investir un centime en honoraires juridiques. 
                 <span className="block mt-4 text-white font-bold underline decoration-coral decoration-2">Offre limitée aux premiers inscrits.</span>
              </p>
              <button className="w-full py-5 bg-coral text-white rounded-[1.5rem] font-black text-lg hover:shadow-[0_20px_40px_-10px_rgba(239,108,119,0.5)] transition-all active:scale-95 z-10 group-hover:scale-105 uppercase tracking-widest shadow-xl shadow-coral/20">
                Saisir l&apos;opportunité
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
