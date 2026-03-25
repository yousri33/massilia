'use client'

import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2, Play, Users } from 'lucide-react'

const item = {
  hidden: { opacity: 0, y: 18 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' as const, delay: i * 0.12 },
  }),
}

export const Hero = () => {
  return (
    <section 
      className="relative min-h-screen pt-44 pb-32 overflow-hidden flex items-center bg-background"
    >
      {/* Background Shapes Removed to stay seamless with the video */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Content */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left order-2 lg:order-1">
            <motion.div
              custom={0}
              variants={item}
              initial="hidden"
              animate="visible"
              className="mb-8"
            >
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border-2 border-navy/10 bg-white/70 backdrop-blur-sm shadow-sm">
                <span className="flex h-2 w-2 rounded-full bg-navy animate-pulse" />
                <span className="text-xs font-bold text-navy uppercase tracking-widest leading-none">
                  L'Innovation Juridique en Algérie
                </span>
              </div>
            </motion.div>

            <motion.h1
              custom={1}
              variants={item}
              initial="hidden"
              animate="visible"
              className="font-serif font-bold text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-navy leading-[1.05] tracking-tight mb-8"
            >
              Votre entreprise, <br />
              <span className="text-navy relative inline-block">
                sans effort.
                <motion.svg
                  className="absolute -bottom-2 left-0 w-full h-[12px] opacity-20 text-navy"
                  viewBox="0 0 200 14"
                  preserveAspectRatio="none"
                >
                  <path d="M 0 10 Q 50 3, 100 10 T 200 10" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
                </motion.svg>
              </span>
            </motion.h1>

            <motion.p
              custom={2}
              variants={item}
              initial="hidden"
              animate="visible"
              className="text-lg sm:text-xl text-slate-600 max-w-lg mb-12 leading-relaxed"
            >
              Juristes et avocats : toutes leurs expertises réunies sur <span className="font-bold text-navy">la plateforme #1 pour entreprendre.</span>
            </motion.p>

            <motion.div
              custom={3}
              variants={item}
              initial="hidden"
              animate="visible"
              className="flex flex-col sm:flex-row items-center gap-5 w-full sm:w-auto"
            >
              <button className="w-full sm:w-auto bg-navy text-white px-10 h-16 rounded-full text-lg font-bold hover:bg-navy/90 hover:shadow-2xl hover:shadow-navy/30 transition-all flex items-center justify-center gap-3 active:scale-95">
                Démarrer mon projet
                <ArrowRight size={20} />
              </button>
              
              <button className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 h-16 rounded-full border-2 border-navy/10 hover:border-navy/20 bg-white/50 backdrop-blur transition-all font-bold text-navy active:scale-95 group">
                <div className="w-8 h-8 rounded-full bg-coral flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  <Play size={14} fill="currentColor" />
                </div>
                Voir comment ça marche
              </button>
            </motion.div>

            {/* Social Proof */}
            <motion.div 
              custom={4}
              variants={item}
              initial="hidden"
              animate="visible"
              className="mt-12 flex flex-wrap items-center justify-center lg:justify-start gap-8"
            >
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-cream bg-slate-200" />
                ))}
              </div>
              <div className="text-left">
                <div className="text-navy font-bold flex items-center gap-1.5">
                  <Users size={16} className="text-coral" />
                  +1,500 entrepreneurs
                </div>
                <p className="text-xs text-slate-500 font-medium tracking-wide">Nous font confiance chaque jour</p>
              </div>
            </motion.div>
          </div>

          {/* Visual Area (Cartoon-ish Loop Video) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
            className="relative order-1 lg:order-2 hidden lg:block"
          >
            <div className="relative z-10 w-full aspect-square md:aspect-[4/3] overflow-hidden rounded-[2.5rem] group">
              <video 
                src="/kling_20260323_Image_to_Video_animate_th_1331_0.mp4" 
                autoPlay 
                loop 
                muted 
                playsInline
                className="relative w-[110%] left-[-5%] h-[110%] object-cover object-top group-hover:scale-110 transition-transform duration-700"
              />
              
              {/* Optional: Removed the floating card for total seamlessness */}
            </div>
            
            {/* Decoration Removed for perfectly flat background */}
          </motion.div>

        </div>
      </div>
    </section>
  )
}
