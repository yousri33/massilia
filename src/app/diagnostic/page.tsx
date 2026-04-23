'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Lightbulb,
  Rocket,
  TrendingUp,
  Building2,
  Lock,
  FileText,
  Award,
  Users,
  BarChart3,
  HelpCircle,
  User,
  Mail,
  Phone,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { setDiagnostic } from '@/lib/storage';
import type {
  BusinessStage,
  LegalStructure,
  EmployeesCount,
  ComplianceNeed,
  DiagnosticAnswers,
} from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 48 : -48, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -48 : 48, opacity: 0 }),
};

interface StepState {
  businessStage: BusinessStage | '';
  legalStructure: LegalStructure | '';
  employeesCount: EmployeesCount | '';
  complianceNeeds: ComplianceNeed[];
  contactName: string;
  contactEmail: string;
  contactPhone: string;
}

const STAGE_OPTIONS: { value: BusinessStage; label: string; sub: string; icon: React.ElementType }[] = [
  { value: 'idea', label: "En phase d'idée", sub: "Projet non encore créé", icon: Lightbulb },
  { value: 'early', label: "Tout récemment créée", sub: "Moins d'un an d'activité", icon: Rocket },
  { value: 'growing', label: "En pleine croissance", sub: "Développement actif", icon: TrendingUp },
  { value: 'established', label: "Entreprise établie", sub: "Plus de 2 ans d'existence", icon: Building2 },
];

const STRUCTURE_OPTIONS: { value: LegalStructure; label: string; sub: string }[] = [
  { value: 'SARL', label: 'SARL', sub: 'Société à Responsabilité Limitée' },
  { value: 'EURL', label: 'EURL', sub: 'Entreprise Unipersonnelle à RL' },
  { value: 'SPA', label: 'SPA', sub: 'Société par Actions' },
  { value: 'Auto-entrepreneur', label: 'Auto-entrepreneur', sub: 'Régime simplifié' },
  { value: 'None', label: 'Pas encore de structure', sub: 'Je démarrerai bientôt' },
  { value: 'Unsure', label: 'Je ne sais pas', sub: "Besoin d'être orienté" },
];

const EMPLOYEES_OPTIONS: { value: EmployeesCount; label: string; sub: string }[] = [
  { value: '0', label: 'Solo', sub: 'Je travaille seul(e)' },
  { value: '1-5', label: '1 à 5', sub: 'Petite équipe' },
  { value: '6-20', label: '6 à 20', sub: 'Équipe intermédiaire' },
  { value: '20+', label: 'Plus de 20', sub: 'Grande équipe' },
];

const COMPLIANCE_OPTIONS: { value: ComplianceNeed; label: string; icon: React.ElementType; desc: string }[] = [
  { value: 'rgpd_dpo', label: 'RGPD / DPO', icon: Lock, desc: 'Protection des données personnelles' },
  { value: 'contracts', label: 'Contrats', icon: FileText, desc: 'Rédaction et révision contractuelle' },
  { value: 'trademark', label: 'Marques & brevets', icon: Award, desc: 'Propriété intellectuelle' },
  { value: 'employees', label: 'Paie & RH', icon: Users, desc: 'Gestion des ressources humaines' },
  { value: 'accounting', label: 'Comptabilité', icon: BarChart3, desc: 'Obligations comptables' },
  { value: 'none', label: 'Aucun besoin précis', icon: HelpCircle, desc: "Je ne sais pas encore" },
];

function RadioCard({
  selected,
  onClick,
  label,
  sub,
  icon: Icon,
}: {
  selected: boolean;
  onClick: () => void;
  label: string;
  sub?: string;
  icon?: React.ElementType;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left px-5 py-4 rounded-2xl border-2 transition-all duration-300 group ${
        selected
          ? 'border-coral bg-coral/5 shadow-md shadow-coral/10 scale-[1.01] ring-1 ring-coral/20'
          : 'border-border/60 bg-white/50 hover:bg-white hover:border-navy/30 hover:shadow-md hover:-translate-y-0.5'
      }`}
    >
      <div className="flex items-center gap-4">
        {Icon && (
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${
            selected ? 'bg-coral/15 shadow-inner' : 'bg-muted group-hover:bg-navy/5'
          }`}>
            <Icon className={`w-5 h-5 transition-colors ${selected ? 'text-coral' : 'text-muted-foreground group-hover:text-navy'}`} />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className={`font-bold text-base transition-colors ${selected ? 'text-navy' : 'text-foreground'}`}>{label}</p>
          {sub && <p className="text-sm text-muted-foreground mt-1">{sub}</p>}
        </div>
        <div className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-all duration-300 ${
          selected ? 'border-coral bg-coral shadow-[0_0_10px_rgba(var(--coral-rgb),0.5)]' : 'border-muted-foreground/30'
        }`}>
          {selected && <div className="w-2 h-2 rounded-full bg-white scale-in" />}
        </div>
      </div>
    </button>
  );
}

function CheckCard({
  selected,
  onClick,
  icon: Icon,
  label,
  desc,
}: {
  selected: boolean;
  onClick: () => void;
  icon: React.ElementType;
  label: string;
  desc: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl border-2 transition-all duration-300 group text-left ${
        selected
          ? 'border-coral bg-coral/5 shadow-md shadow-coral/10 scale-[1.01] ring-1 ring-coral/20'
          : 'border-border/60 bg-white/50 hover:bg-white hover:border-navy/30 hover:shadow-md hover:-translate-y-0.5'
      }`}
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${
        selected ? 'bg-coral/15 shadow-inner' : 'bg-muted group-hover:bg-navy/5'
      }`}>
        <Icon className={`w-5 h-5 transition-colors ${selected ? 'text-coral' : 'text-muted-foreground group-hover:text-navy'}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`font-bold text-base ${selected ? 'text-navy' : 'text-foreground'}`}>{label}</p>
        <p className="text-sm text-muted-foreground mt-1">{desc}</p>
      </div>
      <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center shrink-0 transition-all duration-300 ${
        selected ? 'border-coral bg-coral shadow-[0_0_10px_rgba(var(--coral-rgb),0.5)]' : 'border-muted-foreground/30'
      }`}>
        {selected && <CheckCircle2 className="w-4 h-4 text-white scale-in" />}
      </div>
    </button>
  );
}

const STEP_LABELS = ['Activité', 'Structure', 'Équipe', 'Besoins', 'Contact'];

export default function DiagnosticPage() {
  const router = useRouter();
  const { user, isAuthenticated, updateUser } = useAuth();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [data, setData] = useState<StepState>({
    businessStage: '',
    legalStructure: '',
    employeesCount: '',
    complianceNeeds: [],
    contactName: user?.name ?? '',
    contactEmail: user?.email ?? '',
    contactPhone: '',
  });

  const go = (next: number) => {
    setDirection(next > step ? 1 : -1);
    setStep(next);
  };

  const toggleCompliance = (val: ComplianceNeed) => {
    setData((prev) => {
      if (val === 'none') {
        return { ...prev, complianceNeeds: prev.complianceNeeds.includes('none') ? [] : ['none'] };
      }
      const without = prev.complianceNeeds.filter((v) => v !== 'none');
      return {
        ...prev,
        complianceNeeds: without.includes(val) ? without.filter((v) => v !== val) : [...without, val],
      };
    });
  };

  const canAdvance = () => {
    if (step === 1) return !!data.businessStage;
    if (step === 2) return !!data.legalStructure;
    if (step === 3) return !!data.employeesCount;
    if (step === 4) return data.complianceNeeds.length > 0;
    return true;
  };

  const handleSubmit = () => {
    const answers: DiagnosticAnswers = {
      businessStage: data.businessStage as BusinessStage,
      legalStructure: data.legalStructure as LegalStructure,
      employeesCount: data.employeesCount as EmployeesCount,
      complianceNeeds: data.complianceNeeds,
      contactName: data.contactName,
      contactEmail: data.contactEmail,
      contactPhone: data.contactPhone,
      completedAt: new Date().toISOString(),
    };
    setDiagnostic(answers);
    if (isAuthenticated) updateUser({ onboardingAnswers: answers });
    router.push('/diagnostic/resultats');
  };

  const STEP_QUESTIONS = [
    "Où en est votre entreprise ?",
    "Quelle est votre structure juridique ?",
    "Combien d'employés avez-vous ?",
    "Quels sont vos besoins prioritaires ?",
    "Comment vous contacter ?",
  ];

  const progress = (step / 5) * 100;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="h-screen w-screen bg-[#fcfcfd] flex flex-col relative overflow-hidden font-sans"
    >
      {/* Premium Background Ornaments - Animated */}
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.03, 0.05, 0.03]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-navy blur-[120px] pointer-events-none" 
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.03, 0.06, 0.03]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-coral blur-[120px] pointer-events-none" 
      />

      {/* Synchronized Header */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-border/40 bg-white/80 backdrop-blur-md sticky top-0 z-20">
        <Link href="/">
          <Image src="/logo.png" alt="Massilia Legal" width={90} height={28} className="object-contain" />
        </Link>
        <Badge variant="outline" className="text-navy border-navy/20 bg-navy/5 font-black text-[10px] uppercase tracking-widest px-3 py-1 rounded-full">
          Étape {step} sur 5
        </Badge>
      </header>
      
      <div className="flex-1 flex flex-col items-center justify-center px-4 relative z-10 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-[540px] flex flex-col"
        >

          {/* Progress Section */}
          <div className="mb-8 px-2">
            <div className="flex justify-between items-center relative z-10">
              {STEP_LABELS.map((label, i) => {
                const num = i + 1;
                const isDone = num < step;
                const isCurrent = num === step;
                return (
                  <div key={label} className="flex flex-col items-center gap-2 relative z-10">
                    <motion.div 
                      initial={false}
                      animate={{
                        backgroundColor: isCurrent ? 'var(--navy)' : isDone ? 'var(--coral)' : 'var(--muted)',
                        color: isCurrent || isDone ? '#fff' : 'var(--muted-foreground)',
                        scale: isCurrent ? 1.1 : 1,
                      }}
                      className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-sm font-bold shadow-sm transition-colors duration-300"
                    >
                      {isDone ? <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" /> : num}
                    </motion.div>
                    <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider hidden sm:block transition-colors duration-300 ${
                      isCurrent ? 'text-navy' : isDone ? 'text-coral' : 'text-muted-foreground'
                    }`}>
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>
            
            {/* Connecting Lines */}
            <div className="relative -top-7 sm:-top-10 left-0 w-full h-1 sm:h-1.5 bg-muted/80 rounded-full overflow-hidden -z-10">
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, var(--coral), var(--navy))' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
              />
            </div>
          </div>

          {/* Card */}
          <Card className="border-border/40 shadow-2xl shadow-navy/5 bg-white/80 backdrop-blur-xl rounded-[2rem] overflow-visible">
            <CardContent className="p-7 sm:p-9">
              <div className="overflow-hidden px-6 py-4 -mx-6 -my-4">
                <AnimatePresence custom={direction} mode="wait">
                  <motion.div
                    key={step}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ 
                      type: 'spring',
                      stiffness: 260,
                      damping: 20,
                      mass: 0.5
                    }}
                    className="space-y-5 px-1"
                  >
                    {/* Question */}
                    <div className="space-y-3 mb-6">
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-coral/10 text-coral text-xs font-bold tracking-widest uppercase"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-coral animate-pulse" />
                        Étape {step} / 5
                      </motion.div>
                      <h2 className="text-2xl sm:text-3xl font-serif font-bold text-navy leading-tight">
                        {STEP_QUESTIONS[step - 1]}
                      </h2>
                    </div>

                    <Separator className="bg-border/50" />

                    <div className="max-h-[50vh] overflow-y-auto px-4 -mx-4 py-2 -my-2 custom-scrollbar">
                      {/* Step 1 */}
                      {step === 1 && (
                        <div className="grid grid-cols-1 gap-2.5 px-0.5">
                        {STAGE_OPTIONS.map((opt) => (
                          <RadioCard
                            key={opt.value}
                            selected={data.businessStage === opt.value}
                            onClick={() => setData({ ...data, businessStage: opt.value })}
                            label={opt.label}
                            sub={opt.sub}
                            icon={opt.icon}
                          />
                        ))}
                      </div>
                    )}

                    {/* Step 2 */}
                    {step === 2 && (
                      <div className="space-y-2.5">
                        {STRUCTURE_OPTIONS.map((opt) => (
                          <RadioCard
                            key={opt.value}
                            selected={data.legalStructure === opt.value}
                            onClick={() => setData({ ...data, legalStructure: opt.value })}
                            label={opt.label}
                            sub={opt.sub}
                          />
                        ))}
                      </div>
                    )}

                    {/* Step 3 */}
                    {step === 3 && (
                      <div className="space-y-2.5">
                        {EMPLOYEES_OPTIONS.map((opt) => (
                          <RadioCard
                            key={opt.value}
                            selected={data.employeesCount === opt.value}
                            onClick={() => setData({ ...data, employeesCount: opt.value })}
                            label={opt.label}
                            sub={opt.sub}
                          />
                        ))}
                      </div>
                    )}

                    {/* Step 4 */}
                    {step === 4 && (
                      <div className="space-y-2.5">
                        <p className="text-sm text-muted-foreground">Sélectionnez tout ce qui s&apos;applique.</p>
                        {COMPLIANCE_OPTIONS.map((opt) => (
                          <CheckCard
                            key={opt.value}
                            selected={data.complianceNeeds.includes(opt.value)}
                            onClick={() => toggleCompliance(opt.value)}
                            icon={opt.icon}
                            label={opt.label}
                            desc={opt.desc}
                          />
                        ))}
                      </div>
                    )}

                    {/* Step 5 */}
                    {step === 5 && (
                      <div className="space-y-6">
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Pour recevoir votre rapport complet personnalisé. Vos données restent strictement confidentielles.
                        </p>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-sm font-bold text-navy flex items-center gap-2">
                              <User className="w-4 h-4 text-coral" /> Nom complet
                            </label>
                            <Input
                              value={data.contactName}
                              onChange={(e) => setData({ ...data, contactName: e.target.value })}
                              placeholder="Yousri Amrane"
                              className="h-12 rounded-xl bg-white/50 border-border/60 focus:bg-white focus:ring-2 focus:ring-coral/20 focus:border-coral transition-all text-base shadow-sm"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-bold text-navy flex items-center gap-2">
                              <Mail className="w-4 h-4 text-coral" /> Email
                            </label>
                            <Input
                              type="email"
                              value={data.contactEmail}
                              onChange={(e) => setData({ ...data, contactEmail: e.target.value })}
                              placeholder="vous@entreprise.dz"
                              className="h-12 rounded-xl bg-white/50 border-border/60 focus:bg-white focus:ring-2 focus:ring-coral/20 focus:border-coral transition-all text-base shadow-sm"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-bold text-navy flex items-center gap-2">
                              <Phone className="w-4 h-4 text-coral" />
                              Téléphone <span className="text-muted-foreground font-normal">(optionnel)</span>
                            </label>
                            <Input
                              type="tel"
                              value={data.contactPhone}
                              onChange={(e) => setData({ ...data, contactPhone: e.target.value })}
                              placeholder="+213 5XX XX XX XX"
                              className="h-12 rounded-xl bg-white/50 border-border/60 focus:bg-white focus:ring-2 focus:ring-coral/20 focus:border-coral transition-all text-base shadow-sm"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="mt-6 flex gap-3">
            {step > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => go(step - 1)}
                className="h-14 w-14 p-0 rounded-2xl border-2 border-border/60 hover:bg-white hover:border-navy/30 transition-all text-navy shadow-sm"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
            )}
            <Button
              type="button"
              onClick={step < 5 ? () => go(step + 1) : handleSubmit}
              disabled={!canAdvance()}
              className="flex-1 h-14 rounded-2xl font-bold text-base shadow-lg shadow-navy/20 hover:shadow-navy/30 hover:-translate-y-0.5 transition-all duration-300 text-white"
              style={{ background: canAdvance() ? 'var(--navy)' : undefined }}
            >
              {step < 5 ? (
                <>Continuer <ArrowRight className="w-5 h-5 ml-2" /></>
              ) : (
                <>Obtenir mon diagnostic <ArrowRight className="w-5 h-5 ml-2" /></>
              )}
            </Button>
          </div>

          <p className="mt-6 flex items-center justify-center gap-2 text-xs font-medium text-muted-foreground">
            <Lock className="w-3.5 h-3.5" /> Données chiffrées et stockées localement
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
