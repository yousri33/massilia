'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, LucideIcon } from 'lucide-react'

interface ServiceProps {
  slide: {
    number: string
    tag: string
    icon: LucideIcon
    title: string
    description: string
    cta: string
    stats: { value: string; label: string }[]
    accent: string
    id: string
  }
}

export const ServiceDetail = ({ slide }: ServiceProps) => {
  const Icon = slide.icon

  return (
    <section className="min-h-[80vh] flex items-center justify-center px-6 lg:px-20 py-28 bg-background">
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-5"
        >
          <div className="flex items-center gap-2.5">
            <div
              className="h-9 w-9 flex items-center justify-center rounded-xl text-white shadow-lg shadow-navy/10"
              style={{ backgroundColor: slide.accent }}
            >
              <Icon size={16} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-navy/65">
              {slide.tag}
            </span>
          </div>

          <div
            className="text-[80px] font-serif font-black leading-none opacity-5 -mb-4"
            style={{ color: slide.accent }}
          >
            {slide.number}
          </div>

          <h1 className="font-serif text-4xl lg:text-6xl font-black text-navy whitespace-pre-line leading-[1.1] tracking-tight">
            {slide.title}
          </h1>

          <p className="text-base text-navy/80 font-medium leading-relaxed max-w-lg">{slide.description}</p>

          <div className="flex gap-10 py-8 border-y border-navy/10">
            {slide.stats.map((s) => (
              <div key={s.label}>
                <div className="text-2xl font-black text-navy font-serif">{s.value}</div>
                <div className="text-[9px] text-navy/60 font-black uppercase tracking-widest mt-1">
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          <button
            className="inline-flex items-center gap-3 self-start text-white px-10 py-5 rounded-[1.2rem] font-black text-sm uppercase tracking-widest shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all outline-none"
            style={{ backgroundColor: slide.accent }}
          >
            {slide.cta} <ArrowRight size={16} />
          </button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative aspect-square max-w-[320px] w-full mx-auto"
        >
          <div
            className="absolute inset-0 rounded-[3rem] blur-3xl opacity-20"
            style={{ backgroundColor: slide.accent }}
          />
          <div
            className="absolute inset-0 rounded-[3rem] border-2 border-white/50 backdrop-blur-xl shadow-2xl"
            style={{ backgroundColor: `${slide.accent}05` }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-36 h-36 rounded-3xl flex items-center justify-center shadow-2xl shadow-navy/20"
              style={{ backgroundColor: slide.accent }}
            >
              <Icon size={56} className="text-white" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
