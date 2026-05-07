import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin, Send } from 'lucide-react'

export const Footer = () => {
  return (
    <footer className="bg-background text-navy relative overflow-hidden border-t border-navy/5">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-coral/5 rounded-full blur-[100px] -ml-40 -mt-28" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-navy/5 rounded-full blur-[80px] -mr-28 -mb-28" />

      {/* Newsletter Section */}
      <div className="border-b border-navy/10 relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="flex items-center gap-6">
               <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-navy/10 shrink-0 shadow-xl bg-[#e6cfb2]/30">
                  <Image 
                    src="/images/legal-expert-clock.jpg" 
                    alt="Newsletter support" 
                    fill 
                    className="object-cover"
                  />
               </div>
               <div>
                  <h3 className="text-xl font-serif font-black mb-1.5 text-navy">Restez informé</h3>
                  <p className="text-sm text-navy/80 font-medium max-w-sm">Recevez l'essentiel juridique pour votre entreprise en Algérie.</p>
               </div>
            </div>
            <div className="flex gap-2.5 flex-col sm:flex-row">
              <input
                type="email"
                placeholder="Votre email"
                className="flex-grow px-5 py-3 rounded-xl bg-navy/5 border border-navy/10 text-sm text-navy placeholder:text-navy/30 focus:outline-none focus:border-coral transition-colors"
              />
              <button className="px-6 py-3 bg-coral text-white rounded-xl text-sm font-black hover:bg-coral/90 hover:shadow-lg hover:shadow-coral/30 transition-all flex items-center justify-center gap-2 whitespace-nowrap uppercase tracking-widest">
                S&apos;abonner
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-20 pb-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16 relative">
          {/* Brand & Social */}
          <div className="flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-2.5 group hover:scale-105 transition-transform duration-300">
              <img src="/logo.png" alt="Legal Pilot" className="h-24 w-auto object-contain" />
            </Link>
            <p className="text-sm text-navy/80 font-bold leading-relaxed max-w-xs uppercase tracking-tight">
              Devenez l&apos;entrepreneur que vous avez toujours voulu être. Nous nous occupons de tout l&apos;aspect juridique.
            </p>
            <div className="flex gap-3">
              {[Facebook, Twitter, Linkedin, Instagram].map((Icon, i) => (
                <Link key={i} href="#" className="w-10 h-10 rounded-xl bg-navy/5 border border-navy/10 flex items-center justify-center text-navy hover:bg-coral hover:text-white hover:border-coral hover:scale-110 transition-all outline-none focus:ring-2 focus:ring-coral shadow-sm">
                  <Icon size={18} />
                </Link>
              ))}
            </div>
          </div>

          {/* Links 1 */}
          <div>
            <h4 className="text-xs font-black mb-6 text-navy uppercase tracking-[0.2em]">Lancez-vous</h4>
            <ul className="flex flex-col gap-3.5 text-sm text-navy/80 font-bold uppercase tracking-tight">
              <li><Link href="/creation" className="hover:text-coral transition-colors">Créer une SARL</Link></li>
              <li><Link href="/creation" className="hover:text-coral transition-colors">Créer une EURL</Link></li>
              <li><Link href="/creation" className="hover:text-coral transition-colors">Créer une SPA</Link></li>
              <li><Link href="/creation" className="hover:text-coral transition-colors">Micro-entreprise</Link></li>
            </ul>
          </div>

          {/* Links 2 */}
          <div>
            <h4 className="text-xs font-black mb-6 text-navy uppercase tracking-[0.2em]">Développez</h4>
            <ul className="flex flex-col gap-3.5 text-sm text-navy/80 font-bold uppercase tracking-tight">
              <li><Link href="/modifications" className="hover:text-coral transition-colors">Modification de statuts</Link></li>
              <li><Link href="/juridique" className="hover:text-coral transition-colors">Modèle de contrat</Link></li>
              <li><Link href="/juridique" className="hover:text-coral transition-colors">Marques & Brevets</Link></li>
            </ul>
          </div>

          {/* Contact & Mascot */}
          <div className="relative">
            <h4 className="text-xs font-black mb-6 text-navy uppercase tracking-[0.2em]">Contactez-nous</h4>
            <ul className="flex flex-col gap-5 text-sm text-navy/70 font-bold uppercase tracking-tight relative z-10">
              <li className="group">
                <a href="mailto:legal_pilot@gmail.com" className="flex items-center gap-3.5 cursor-pointer">
                  <div className="w-9 h-9 rounded-xl bg-coral/10 border border-coral/20 flex items-center justify-center text-coral group-hover:bg-coral group-hover:text-white transition-all shadow-sm">
                    <Mail size={16} />
                  </div>
                  <span className="group-hover:text-coral transition-colors truncate">legal_pilot@gmail.com</span>
                </a>
              </li>
              <li className="group">
                <a href="https://wa.me/213775753965" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3.5 cursor-pointer">
                  <div className="w-9 h-9 rounded-xl bg-coral/10 border border-coral/20 flex items-center justify-center text-coral group-hover:bg-coral group-hover:text-white transition-all shadow-sm">
                    <Phone size={16} />
                  </div>
                  <span className="group-hover:text-coral transition-colors">+213 775 75 39 65</span>
                </a>
              </li>
            </ul>
            
            {/* Waving Mascot */}
            <div className="absolute -bottom-12 -right-48 w-52 h-72 pointer-events-none hidden lg:block">
              <Image 
                src="/images/image.png" 
                alt="Friendly mascot" 
                fill 
                className="object-contain object-bottom"
              />
            </div>
          </div>

        </div>

        <div className="pt-10 border-t border-navy/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] text-navy/65 font-black uppercase tracking-widest text-center">
            <p>© 2026 Legal Pilot. Algérie.</p>
            <div className="flex gap-8">
              <Link href="#" className="hover:text-coral transition-colors">Mentions Légales</Link>
              <Link href="#" className="hover:text-coral transition-colors">CGV</Link>
              <Link href="#" className="hover:text-coral transition-colors">Confidentialité</Link>
            </div>
          </div>

        </div>
      </div>
    </footer>
  )
}
