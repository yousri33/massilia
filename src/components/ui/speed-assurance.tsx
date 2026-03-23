import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Clock, ShieldCheck, Zap } from "lucide-react";

export function SpeedAssurance() {
    return (
        <section className="relative w-full max-w-6xl mx-auto px-6 py-24 overflow-hidden">
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 items-center gap-16 p-12 lg:p-20 bg-navy rounded-[3rem] shadow-[20px_20px_0px_0px] shadow-coral/10">
                {/* Text Content */}
                <div className="space-y-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/20 backdrop-blur-sm">
                        <Zap className="w-4 h-4 text-coral fill-coral" />
                        <span className="text-[10px] font-bold text-white uppercase tracking-[0.2em]">Engagement de Rapidité</span>
                    </div>
                    
                    <h2 className="font-serif font-bold text-4xl sm:text-5xl text-white leading-tight">
                        Vos documents officiels <br />
                        <span className="text-coral italic">en un temps record.</span>
                    </h2>
                    
                    <p className="text-white/70 text-lg leading-relaxed max-w-md">
                        Notre plateforme automatise les tâches administratives complexes pour vous garantir un traitement en moins de 24h. Un expert valide chaque étape.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                        <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                            <Clock className="w-8 h-8 text-coral shrink-0" />
                            <div>
                                <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-1">Traitement 24h</h4>
                                <p className="text-white/50 text-xs">Validation express de vos dossiers.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                            <ShieldCheck className="w-8 h-8 text-coral shrink-0" />
                            <div>
                                <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-1">100% Conforme</h4>
                                <p className="text-white/50 text-xs">Vérifié par nos experts juristes.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Image Section */}
                <div className="relative flex justify-center lg:justify-end">
                    <div className="relative w-full aspect-square max-w-[450px]">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            whileInView={{ opacity: 1, scale: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="relative w-full h-full rounded-[2.5rem] overflow-hidden border-8 border-white shadow-2xl rotate-2"
                        >
                            <video
                                src="/kling_20260323_Image_to_Video_animate_th_2085_0.mp4"
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="w-full h-full object-cover"
                            />
                        </motion.div>
                        
                        {/* Decorative floating elements */}
                        <div className="absolute -top-6 -left-6 w-24 h-24 bg-coral rounded-3xl -rotate-6 shadow-xl flex items-center justify-center animate-bounce duration-[3000ms]">
                            <Zap className="w-10 h-10 text-white fill-white" />
                        </div>
                        <div className="absolute -bottom-10 -right-4 bg-white p-6 rounded-[2rem] shadow-2xl border border-navy/5 flex items-center gap-4 -rotate-2">
                             <div className="w-12 h-12 rounded-full bg-navy/5 flex items-center justify-center">
                                <span className="font-serif font-black text-2xl text-navy italic">24</span>
                             </div>
                             <div className="pr-4">
                                <p className="text-[10px] uppercase font-bold text-navy/40 tracking-widest leading-none mb-1">Heures</p>
                                <p className="text-sm font-bold text-navy leading-none">Record de vitesse</p>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
