'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Building2,
  FileSignature,
  ShieldCheck,
  Award,
  Users,
  Calculator,
  RotateCcw,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  MessageSquare,
  Loader2,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { getDiagnostic } from '@/lib/storage';
import { computeComplianceScore, generateRecommendations } from '@/lib/compliance';
import type { DiagnosticAnswers, Recommendation } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const ICON_MAP: Record<string, React.ElementType> = {
  Building2,
  FileSignature,
  ShieldCheck,
  Award,
  Users,
  Calculator,
};

function AnimatedNumber({ target }: { target: number }) {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const duration = 1000;
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target]);
  return <>{current}</>;
}

function ScoreRing({ score }: { score: number }) {
  const radius = 64;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const viewBoxSize = (radius + strokeWidth) * 2 + 4;
  const center = viewBoxSize / 2;
  const color = score < 40 ? 'var(--coral)' : score < 70 ? '#f59e0b' : '#22c55e';

  return (
    <div className="relative flex items-center justify-center" style={{ width: 160, height: 160 }}>
      <svg
        className="absolute inset-0 -rotate-90"
        width="160"
        height="160"
        viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
      >
        <circle cx={center} cy={center} r={radius} fill="none"
          stroke="currentColor" className="text-muted" strokeWidth={strokeWidth} />
        <motion.circle
          cx={center} cy={center} r={radius} fill="none"
          stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - (score / 100) * circumference }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
        />
      </svg>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col items-center"
      >
        <span className="text-4xl font-black" style={{ color }}>
          <AnimatedNumber target={score} />%
        </span>
        <span className="text-xs font-bold text-muted-foreground tracking-wider uppercase mt-0.5">Score</span>
      </motion.div>
    </div>
  );
}

function PriorityBadge({ priority }: { priority: Recommendation['priority'] }) {
  if (priority === 'haute') return <Badge className="bg-red-50 text-red-600 border border-red-200 hover:bg-red-50 text-xs">Haute priorité</Badge>;
  if (priority === 'moyenne') return <Badge className="bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-50 text-xs">Priorité moyenne</Badge>;
  return <Badge className="bg-green-50 text-green-700 border border-green-200 hover:bg-green-50 text-xs">Faible priorité</Badge>;
}

function RecommendationCard({ rec, index }: { rec: Recommendation; index: number }) {
  const Icon = ICON_MAP[rec.icon] ?? ShieldCheck;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index + 0.5 }}
    >
      <Card className="border-border hover:border-navy/20 transition-colors hover:shadow-sm">
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-navy/5 flex items-center justify-center shrink-0 mt-0.5">
              <Icon className="w-5 h-5 text-navy" />
            </div>
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <h3 className="font-bold text-foreground text-sm leading-snug">{rec.title}</h3>
                <PriorityBadge priority={rec.priority} />
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">{rec.description}</p>
              <Link
                href={rec.serviceLink}
                className="inline-flex items-center gap-1.5 text-sm font-bold transition-all group"
                style={{ color: 'var(--coral)' }}
              >
                En savoir plus
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function ResultatsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [diagnostic, setDiagnosticState] = useState<DiagnosticAnswers | null>(null);
  const [score, setScore] = useState(0);
  const [recs, setRecs] = useState<Recommendation[]>([]);
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    const answers = getDiagnostic();
    if (!answers) { router.replace('/diagnostic'); return; }
    setDiagnosticState(answers);
    setScore(computeComplianceScore(answers));
    
    const fetchAiAnalysis = async (answers: DiagnosticAnswers) => {
      setLoadingAi(true);
      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: "En tant qu'expert juridique spécialisé dans le droit algérien, analyse ces résultats de diagnostic. Fournis une analyse stratégique ultra-concise (maximum 3 bullet points très courts). Sois très direct, utilise un ton professionnel. Structure ta réponse en Markdown. Ne fais pas d'introduction ni de conclusion, va droit au but sur les risques immédiats et opportunités.",
            userContext: {
              name: answers.contactName,
              company: "Mon entreprise",
              businessType: answers.legalStructure,
              businessStage: answers.businessStage,
              complianceNeeds: answers.complianceNeeds
            }
          })
        });
        const data = await res.json();
        if (data.message) {
          setAiAnalysis(data.message);
        } else {
          setAiAnalysis("### Analyse Stratégique\n\n* **Attention Immédiate** : Votre profil présente des points critiques nécessitant une régularisation.\n* **Structuration** : Une optimisation de votre forme juridique pourrait réduire vos risques.\n* **Conformité** : La mise en place de contrats types est votre priorité #1.");
        }
      } catch (err) {
        console.error("AI Analysis failed:", err);
        setAiAnalysis("### Analyse Temporairement Indisponible\n\n* Nous rencontrons un volume élevé de demandes.\n* Vos recommandations basées sur les règles métiers restent valides ci-dessous.");
      } finally {
        setLoadingAi(false);
      }
    };

    fetchAiAnalysis(answers);

    const fakeUser = user ?? {
      id: 'anon',
      name: answers.contactName || 'Entrepreneur',
      email: answers.contactEmail,
      company: 'Votre entreprise',
      businessType: 'SARL' as const,
      city: '',
      createdAt: new Date().toISOString(),
    };
    setRecs(generateRecommendations(fakeUser, answers));
  }, [router, user]);

  if (!diagnostic) return null;

  const scoreLevel =
    score < 40 ? { label: 'Conformité faible', icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50' } :
    score < 70 ? { label: 'Conformité partielle', icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50' } :
    { label: 'Bonne conformité', icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' };

  const ScoreIcon = scoreLevel.icon;

  const scoreDesc =
    score < 40
      ? "Votre entreprise présente des lacunes juridiques importantes. Agissez rapidement pour vous protéger."
      : score < 70
      ? "Vous avez pris quelques mesures, mais des risques subsistent. Nos experts peuvent compléter votre conformité."
      : "Félicitations ! Votre entreprise est sur la bonne voie. Quelques optimisations restent possibles.";

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen bg-[#fcfcfd] relative overflow-hidden font-sans"
    >
      {/* Premium Background Ornaments - Animated */}
      <motion.div 
        animate={{ 
          scale: [1, 1.15, 1],
          opacity: [0.03, 0.05, 0.03],
          x: [0, 20, 0]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-navy blur-[120px] pointer-events-none" 
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.25, 1],
          opacity: [0.03, 0.06, 0.03],
          x: [0, -30, 0]
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-coral blur-[120px] pointer-events-none" 
      />
      {/* Synchronized Header */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-border/40 bg-white/80 backdrop-blur-md sticky top-0 z-20">
        <Link href="/">
          <Image src="/logo.png" alt="Legal Pilot" width={90} height={28} className="object-contain" />
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/diagnostic">
            <Button variant="ghost" size="sm" className="text-navy/50 hover:text-navy text-[10px] font-black uppercase tracking-widest gap-1.5 transition-colors">
              <RotateCcw className="w-3.5 h-3.5" /> Refaire
            </Button>
          </Link>
          <div className="w-px h-4 bg-border/40 hidden sm:block" />
          <Badge variant="outline" className="hidden sm:inline-flex text-navy border-navy/10 bg-navy/5 font-black text-[10px] uppercase tracking-widest px-3 py-1 rounded-full">
            Rapport Final
          </Badge>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-12 space-y-8 relative z-10">
        
        {/* Header Section */}
        <div className="text-center space-y-4 mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy/5 border border-navy/10 text-[10px] font-black text-navy uppercase tracking-[0.2em]"
          >
            Rapport de Conformité
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-navy tracking-tight">
            Analyse de votre situation
          </h1>
          <p className="text-muted-foreground text-sm max-w-lg mx-auto leading-relaxed">
            Basé sur vos réponses, nous avons identifié les points de vigilance et les opportunités pour sécuriser votre croissance en Algérie.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Score Card */}
          <motion.div className="md:col-span-5" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <Card className="h-full border-border/40 shadow-xl shadow-navy/[0.02] bg-white/70 backdrop-blur-xl rounded-[2rem] overflow-hidden border-2 border-white">
              <CardContent className="p-8 flex flex-col items-center justify-center h-full text-center space-y-6">
                <ScoreRing score={score} />
                <div className="space-y-2">
                  <Badge className={`${scoreLevel.bg} ${scoreLevel.color} border-0 gap-1.5 font-bold text-[10px] uppercase tracking-wider px-3 py-1`}>
                    <ScoreIcon className="w-3.5 h-3.5" />
                    {scoreLevel.label}
                  </Badge>
                  <p className="text-xs font-medium text-muted-foreground leading-relaxed px-4">
                    {scoreDesc}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* AI Insights Card */}
          <motion.div className="md:col-span-7" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <Card className="h-full border-border/40 shadow-2xl shadow-navy/[0.03] bg-navy text-white rounded-[2rem] overflow-hidden relative border-none">
              <div className="absolute top-0 right-0 p-6 opacity-10">
                <Sparkles className="w-20 h-20 text-white" />
              </div>
              <CardContent className="p-8 space-y-6 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center border border-white/10">
                      <Sparkles className="w-4.5 h-4.5 text-coral" />
                    </div>
                    <h2 className="font-bold text-lg tracking-tight">Smart Legal Insights</h2>
                  </div>
                  <Badge variant="outline" className="border-white/20 text-white/60 font-medium text-[9px] uppercase tracking-widest px-2 py-0.5">
                    Powered by Gemini 2.0
                  </Badge>
                </div>

                {loadingAi ? (
                  <div className="space-y-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="absolute inset-0 bg-coral/20 rounded-full animate-ping" />
                        <Loader2 className="w-4 h-4 text-coral animate-spin relative z-10" />
                      </div>
                      <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] animate-pulse">
                        Génération de l&apos;expertise...
                      </span>
                    </div>
                    <div className="space-y-3 opacity-20">
                      <div className="h-2 w-full bg-white rounded-full" />
                      <div className="h-2 w-[92%] bg-white rounded-full" />
                      <div className="h-2 w-[85%] bg-white rounded-full" />
                    </div>
                  </div>
                ) : aiAnalysis ? (
                  <div className="prose prose-sm prose-invert max-w-none ai-analysis-custom text-white/80 leading-relaxed font-medium text-[13px]">
                    <Markdown>
                      {aiAnalysis}
                    </Markdown>
                  </div>
                ) : (
                  <p className="text-white/40 text-sm italic">Analyse en cours de préparation...</p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Unauthenticated banner */}
        {!isAuthenticated && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <Card className="border-0 overflow-hidden" style={{ background: 'var(--navy)' }}>
              <CardContent className="p-5 flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                    <Sparkles className="w-4.5 h-4.5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">Sauvegardez vos résultats</p>
                    <p className="text-white/60 text-xs mt-0.5">Créez votre compte pour retrouver ce diagnostic dans votre espace.</p>
                  </div>
                </div>
                <Button asChild size="sm" className="shrink-0 font-bold rounded-lg text-xs" style={{ background: 'var(--coral)' }}>
                  <Link href="/auth/signup">
                    Créer mon compte <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Recommendations Section */}
        {recs.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-serif font-bold text-navy text-lg">
                Recommandations
              </h2>
              <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest border-navy/10">
                {recs.length} action{recs.length > 1 ? 's' : ''}
              </Badge>
            </div>
            <div className="grid gap-3">
              {recs.map((rec, i) => (
                <RecommendationCard key={rec.id} rec={rec} index={i} />
              ))}
            </div>
          </motion.div>
        )}

        <Separator />

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-navy/5 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-navy" />
                </div>
                <CardTitle className="text-base font-bold text-navy">
                  Parler à un expert juridique
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-0 space-y-4">
              <p className="text-muted-foreground text-sm leading-relaxed">
                Nos avocats partenaires analysent votre situation et vous proposent un plan d&apos;action personnalisé adapté au droit algérien.
              </p>
              <div className="flex flex-col sm:flex-row gap-2.5">
                <Button asChild className="flex-1 h-10 font-bold rounded-xl text-sm" style={{ background: 'var(--coral)' }}>
                  <Link href={isAuthenticated ? '/espace-client' : '/auth/signup'}>
                    {isAuthenticated ? 'Mon espace client' : 'Commencer maintenant'}
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="flex-1 h-10 border-border font-bold rounded-xl text-sm">
                  <Link href="/">Retour à l&apos;accueil</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

      </div>
    </motion.div>
  );
}
