'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, MessageSquare, FileText, CreditCard, Settings,
  Search, Bell, LogOut, Send, Paperclip, CheckCheck, ArrowRight,
  TrendingUp, TrendingDown, Building2, FileSignature, ShieldCheck,
  Award, Users, Calculator, ChevronRight, Sparkles,
  Clock, CheckCircle2, Circle, AlertCircle, Download,
  Mail, MapPin, Calendar, Activity,
  FileCheck, Zap, Star, Filter, Grid3X3,
  List, Upload,
} from 'lucide-react';

import {
  Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import {
  SidebarProvider, SidebarInset, SidebarTrigger, Sidebar, SidebarHeader,
  SidebarContent, SidebarFooter, SidebarGroup,
  SidebarMenu, SidebarMenuItem, SidebarMenuButton,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator as Sep } from '@/components/ui/separator';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription, DialogFooter
} from '@/components/ui/dialog';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import MorphPanel from '@/components/ui/ai-input';

import { AuthGuard } from '@/components/AuthGuard';
import { FileUpload } from '@/components/FileUpload';
import { FileList } from '@/components/FileList';
import { useAuth } from '@/hooks/useAuth';
import { getDiagnostic } from '@/lib/storage';
import { getDocuments, getNotifications, markNotificationRead } from '@/lib/db';
import { supabase } from '@/lib/supabase';
import { computeComplianceScore, generateRecommendations } from '@/lib/compliance';
import type { StoredFile, DiagnosticAnswers, Recommendation } from '@/lib/types';

// ─── Types ───────────────────────────────────────────────────────────────────
type View = 'dashboard' | 'chat' | 'documents' | 'billing' | 'settings';

// ─── Static Demo Data ────────────────────────────────────────────────────────
const EXPERT = {
  name: 'Me. Amine Hadjadj',
  role: 'Avocat — Droit des Sociétés',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&h=200&auto=format&fit=crop',
  online: true,
  responseTime: '< 2h',
};

const DEMO_CASES = [
  { id: '1', title: 'Rédaction Statuts SARL', type: 'Création', date: '25 Mar 2026', status: 'En cours', progress: 65, priority: 'haute' },
  { id: '2', title: 'Contrat de Distribution Oran', type: 'Contrat', date: '20 Mar 2026', status: 'Terminé', progress: 100, priority: 'faible' },
  { id: '3', title: 'Dépôt de Marque INAPI', type: 'PI', date: '18 Mar 2026', status: 'Action requise', progress: 30, priority: 'haute' },
  { id: '4', title: 'Conformité RGPD/DPO', type: 'Conformité', date: '10 Mar 2026', status: 'En cours', progress: 50, priority: 'moyenne' },
];

const DEMO_MESSAGES = [
  { id: '1', sender: 'expert', text: "Bonjour, j'ai bien reçu vos documents pour la modification des statuts. Je les analyse actuellement.", time: '09:30', date: 'Aujourd\'hui' },
  { id: '2', sender: 'user', text: "Merci Maître. Est-ce que le procès-verbal est conforme à la nouvelle loi de finances ?", time: '09:32', date: 'Aujourd\'hui' },
  { id: '3', sender: 'expert', text: "Absolument. J'ai intégré les nouvelles dispositions concernant le capital social. Je vous envoie la version finale demain matin.", time: '09:45', date: 'Aujourd\'hui' },
  { id: '4', sender: 'user', text: "Parfait, merci beaucoup pour la rapidité.", time: '09:47', date: 'Aujourd\'hui' },
];

const DEMO_INVOICES = [
  { id: 'INV-001', label: 'Pack Création SARL', date: '01 Avr 2026', amount: '45 000 DA', status: 'Payée' },
  { id: 'INV-002', label: 'Module DPO — Mensuel', date: '01 Mar 2026', amount: '12 000 DA', status: 'Payée' },
  { id: 'INV-003', label: 'Consultation Avocat', date: '15 Fév 2026', amount: '8 500 DA', status: 'En attente' },
];

const ICON_MAP: Record<string, React.ElementType> = {
  Building2, FileSignature, ShieldCheck, Award, Users, Calculator,
};

// ─── Animated Counter ────────────────────────────────────────────────────────
function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = React.useState(0);
  React.useEffect(() => {
    const step = value / 30;
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= value) { setDisplay(value); clearInterval(timer); }
      else setDisplay(Math.floor(current));
    }, 20);
    return () => clearInterval(timer);
  }, [value]);
  return <>{display}</>;
}

// ─── Compliance Ring ─────────────────────────────────────────────────────────
function ComplianceRing({ score, size = 'md' }: { score: number; size?: 'sm' | 'md' | 'lg' }) {
  const dims = { sm: 88, md: 120, lg: 160 };
  const dim = dims[size];
  const r = (dim / 2) - 10;
  const circ = 2 * Math.PI * r;
  const color = score < 40 ? '#EF6C77' : score < 70 ? '#f59e0b' : '#22c55e';
  const label = score < 40 ? 'Faible' : score < 70 ? 'Partielle' : 'Bonne';
  return (
    <div className="relative flex items-center justify-center" style={{ width: dim, height: dim }}>
      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox={`0 0 ${dim} ${dim}`}>
        <circle cx={dim / 2} cy={dim / 2} r={r} fill="none" stroke="currentColor" className="text-slate-100" strokeWidth="8" />
        <motion.circle
          cx={dim / 2} cy={dim / 2} r={r} fill="none" stroke={color} strokeWidth="8"
          strokeLinecap="round" strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ - (score / 100) * circ }}
          transition={{ duration: 1.4, ease: 'easeOut' }}
        />
      </svg>
      <div className="flex flex-col items-center">
        <span className={cn('font-black text-navy tabular-nums', size === 'lg' ? 'text-4xl' : size === 'md' ? 'text-2xl' : 'text-lg')}>
          <AnimatedNumber value={score} />%
        </span>
        <span className="text-[9px] font-black tracking-widest uppercase text-slate-400">{label}</span>
      </div>
    </div>
  );
}

// ─── KPI Card ────────────────────────────────────────────────────────────────
function KpiCard({
  label, value, unit = '', trend, trendLabel, icon: Icon, iconBg,
}: {
  label: string; value: string | number; unit?: string;
  trend?: 'up' | 'down' | 'neutral'; trendLabel?: string;
  icon: React.ElementType; iconBg: string;
}) {
  return (
    <Card className="border-0 shadow-sm bg-white rounded-2xl hover:shadow-md transition-all duration-300 group">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', iconBg)}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          {trendLabel && (
            <div className={cn('flex items-center gap-1 text-xs font-black px-2 py-1 rounded-full', {
              'bg-green-50 text-green-600': trend === 'up',
              'bg-red-50 text-red-500': trend === 'down',
              'bg-slate-50 text-slate-500': trend === 'neutral',
            })}>
              {trend === 'up' && <TrendingUp className="w-3 h-3" />}
              {trend === 'down' && <TrendingDown className="w-3 h-3" />}
              {trendLabel}
            </div>
          )}
        </div>
        <p className="text-xs font-black text-slate-400 uppercase tracking-[0.15em] mb-1">{label}</p>
        <p className="text-2xl font-black text-navy">
          {value}<span className="text-sm text-slate-400 font-bold ml-1">{unit}</span>
        </p>
      </CardContent>
    </Card>
  );
}

// ─── Status Badge ────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    'Terminé': 'bg-green-50 text-green-700 border-green-200',
    'En cours': 'bg-blue-50 text-blue-700 border-blue-200',
    'Action requise': 'bg-coral/10 text-coral border-coral/20',
    'Payée': 'bg-green-50 text-green-700 border-green-200',
    'En attente': 'bg-amber-50 text-amber-700 border-amber-200',
  };
  const icons: Record<string, React.ElementType> = {
    'Terminé': CheckCircle2,
    'En cours': Circle,
    'Action requise': AlertCircle,
    'Payée': CheckCircle2,
    'En attente': Clock,
  };
  const Icon = icons[status] ?? Circle;
  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-black', styles[status] ?? 'bg-slate-50 text-slate-600 border-slate-200')}>
      <Icon className="w-3 h-3" />
      {status}
    </span>
  );
}

// ─── Dashboard View ───────────────────────────────────────────────────────────
function DashboardView({ diagnostic, setActiveView }: { diagnostic: DiagnosticAnswers | null; setActiveView: (v: View) => void; logout?: () => void }) {
  const { user } = useAuth();
  const [cases, setCases] = React.useState<any[]>([]);
  const [casesLoading, setCasesLoading] = React.useState(true);

  React.useEffect(() => {
    if (!user?.id) return;
    import('@/lib/db').then(({ getCases }) => {
      getCases(user.id).then(data => {
        setCases(data.length > 0 ? data : DEMO_CASES);
        setCasesLoading(false);
      });
    });
  }, [user?.id]);

  if (!user) return null;
  // Fallback: use email prefix if name is blank (happens before profile syncs)
  const rawName = user.name?.trim() || user.email?.split('@')[0] || 'vous';
  const firstName = rawName.split(' ')[0];
  const score = diagnostic ? computeComplianceScore(diagnostic) : null;
  const recs: Recommendation[] = diagnostic ? generateRecommendations(user, diagnostic) : [];
  const companyLabel = user.company?.trim() || '';
  const cityLabel = user.city?.trim() || 'Algérie';

  const typeColors: Record<string, string> = {
    'Création':   'bg-blue-50   text-blue-700   border-blue-200',
    'Contrat':    'bg-purple-50 text-purple-700  border-purple-200',
    'PI':         'bg-amber-50  text-amber-700   border-amber-200',
    'Conformité': 'bg-teal-50   text-teal-700    border-teal-200',
  };

  return (
    <div className="space-y-5">

      {/* ── Welcome Banner ── */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-2xl bg-navy overflow-hidden"
      >
        {/* subtle mesh */}
        <div className="absolute inset-0 opacity-30"
          style={{ backgroundImage: 'radial-gradient(circle at 80% 50%, #EF6C77 0%, transparent 55%), radial-gradient(circle at 10% 80%, #1e4080 0%, transparent 55%)' }} />
        <div className="relative px-6 py-7 md:px-8 flex items-center justify-between gap-6 flex-wrap">
          {/* Left text */}
          <div>
            <p className="text-white/40 text-[11px] font-bold uppercase tracking-[0.15em] mb-2">
              {new Date().toLocaleDateString('fr-DZ', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
            <h1 className="text-2xl md:text-[28px] font-black text-white tracking-tight leading-none">
              Bonjour,&nbsp;<span className="text-coral">{firstName}</span>&nbsp;👋
            </h1>
            {(companyLabel || cityLabel) && (
              <p className="text-white/50 text-sm font-medium mt-2">
                {companyLabel}{companyLabel && cityLabel ? ' · ' : ''}{cityLabel}
              </p>
            )}
          </div>
          {/* Right: score badge or CTA */}
          {score !== null ? (
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl px-4 py-3">
              <div className="text-right">
                <p className="text-white/40 text-[9px] font-black uppercase tracking-widest">Conformité</p>
                <p className="text-white font-black text-2xl tabular-nums leading-none">{score}<span className="text-sm text-white/50">%</span></p>
                <p className="text-[10px] font-bold mt-0.5"
                   style={{ color: score < 40 ? '#EF6C77' : score < 70 ? '#f59e0b' : '#22c55e' }}>
                  {score < 40 ? 'Faible' : score < 70 ? 'Partielle' : 'Bonne'}
                </p>
              </div>
              <svg className="w-10 h-10 -rotate-90 shrink-0" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
                <circle cx="18" cy="18" r="14" fill="none"
                  stroke={score < 40 ? '#EF6C77' : score < 70 ? '#f59e0b' : '#22c55e'}
                  strokeWidth="3" strokeLinecap="round"
                  strokeDasharray={`${(score / 100) * 87.96} 87.96`} />
              </svg>
            </div>
          ) : (
            <Button asChild className="bg-coral hover:bg-coral/90 text-white font-black rounded-xl gap-2 shadow-lg shadow-coral/30 shrink-0">
              <Link href="/diagnostic"><Sparkles className="w-4 h-4" />Faire mon diagnostic</Link>
            </Button>
          )}
        </div>
      </motion.div>

      {/* ── Onboarding prompt ── */}
      {!diagnostic && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="flex items-center gap-4 px-5 py-4 rounded-2xl border-2 border-dashed border-coral/30 bg-coral/5">
            <div className="w-10 h-10 rounded-xl bg-coral/10 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-coral" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-black text-navy text-sm">Complétez votre diagnostic juridique</p>
              <p className="text-slate-500 text-xs mt-0.5 truncate">Score de conformité + recommandations personnalisées pour {user.company}</p>
            </div>
            <Button asChild size="sm" className="bg-navy hover:bg-navy/90 text-white font-black rounded-xl shrink-0">
              <Link href="/diagnostic">Démarrer <ArrowRight className="w-3.5 h-3.5 ml-1" /></Link>
            </Button>
          </div>
        </motion.div>
      )}

      {/* ── KPI Stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {[
          { label: 'Dossiers actifs', value: cases.filter(c => c.status !== 'Terminé').length || 4, icon: FileText, color: 'from-blue-500 to-blue-600', light: 'bg-blue-50 text-blue-600', trend: '+1 ce mois' },
          { label: 'Documents', value: 12, icon: FileCheck, color: 'from-emerald-500 to-emerald-600', light: 'bg-emerald-50 text-emerald-600', trend: '+3 récents' },
          { label: 'Factures en attente', value: 2, icon: CreditCard, color: 'from-amber-500 to-amber-600', light: 'bg-amber-50 text-amber-600', trend: '8 500 DA' },
          { label: 'Réponse avocat', value: '< 2h', icon: Zap, color: 'from-violet-500 to-violet-600', light: 'bg-violet-50 text-violet-600', trend: 'Excellent' },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <div className="bg-white rounded-2xl p-4 md:p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 group">
              <div className="flex items-center justify-between mb-3">
                <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br', stat.color)}>
                  <stat.icon className="w-4 h-4 text-white" />
                </div>
                <span className={cn('text-[10px] font-bold px-2 py-1 rounded-lg', stat.light)}>{stat.trend}</span>
              </div>
              <p className="text-2xl font-black text-navy tabular-nums">{stat.value}</p>
              <p className="text-xs text-slate-400 font-semibold mt-0.5">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Main 2-col Grid ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* Left — Cases */}
        <div className="xl:col-span-2 space-y-5">

          {/* Cases card */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div>
                <h2 className="text-sm font-black text-navy">Dossiers récents</h2>
                <p className="text-xs text-slate-400 font-medium mt-0.5">Suivi en temps réel de vos procédures</p>
              </div>
              <button className="text-xs font-black text-coral hover:text-coral/80 flex items-center gap-1 transition-colors">
                Tout voir <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <div className="divide-y divide-slate-50">
              {casesLoading ? (
                [1,2,3,4].map(i => (
                  <div key={i} className="flex items-center gap-4 px-5 py-4">
                    <Skeleton className="w-9 h-9 rounded-xl shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-3.5 w-44" />
                      <Skeleton className="h-2 w-full" />
                    </div>
                    <Skeleton className="h-6 w-20 rounded-full shrink-0" />
                  </div>
                ))
              ) : cases.map((c, i) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50/80 transition-colors cursor-pointer group"
                >
                  <div className="w-9 h-9 rounded-xl bg-navy/5 group-hover:bg-navy/10 flex items-center justify-center shrink-0 transition-colors">
                    <FileText className="w-4 h-4 text-navy/40" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-navy truncate">{c.title}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <div className="flex-1 bg-slate-100 rounded-full h-1.5 max-w-[120px]">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-navy to-blue-500 transition-all duration-700"
                          style={{ width: `${c.progress}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-black text-slate-400">{c.progress}%</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={cn('text-[10px] font-black px-2 py-1 rounded-lg border hidden sm:inline-block', typeColors[c.type] || 'bg-slate-50 text-slate-500 border-slate-200')}>{c.type}</span>
                    <StatusBadge status={c.status} />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* AI Recommendations */}
          {recs.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-100">
                <div className="w-7 h-7 rounded-lg bg-coral/10 flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-coral" />
                </div>
                <h2 className="text-sm font-black text-navy">Recommandations IA</h2>
                <span className="ml-auto text-[10px] font-black text-white bg-coral rounded-full w-5 h-5 flex items-center justify-center">{recs.length}</span>
              </div>
              <div className="divide-y divide-slate-50">
                {recs.slice(0, 3).map((rec) => {
                  const Icon = ICON_MAP[rec.icon] ?? ShieldCheck;
                  const priorityBadge = {
                    haute: 'bg-red-50 text-red-600 border-red-200',
                    moyenne: 'bg-amber-50 text-amber-700 border-amber-200',
                    faible: 'bg-green-50 text-green-700 border-green-200',
                  }[rec.priority];
                  return (
                    <div key={rec.id} className="flex items-start gap-3 px-5 py-4 hover:bg-slate-50 transition-colors cursor-pointer group">
                      <div className="w-8 h-8 rounded-xl bg-navy/5 flex items-center justify-center shrink-0 mt-0.5">
                        <Icon className="w-4 h-4 text-navy/50" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-black text-navy">{rec.title}</span>
                          <span className={cn('text-[10px] font-black px-1.5 py-0.5 rounded-full border', priorityBadge)}>
                            {{ haute: 'Urgent', moyenne: 'Moyen', faible: 'Faible' }[rec.priority]}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{rec.description}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-coral shrink-0 mt-1 transition-colors" />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* ── Right column ── */}
        <div className="space-y-4">

          {/* Expert card — white with navy accent strip */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="bg-navy/4 border-b border-slate-100 px-4 py-2.5">
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-slate-400">Votre expert dédié</p>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="h-11 w-11 ring-2 ring-slate-100">
                    <AvatarImage src={EXPERT.avatar} />
                    <AvatarFallback className="bg-navy text-white font-black text-sm">AH</AvatarFallback>
                  </Avatar>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-navy text-sm truncate">{EXPERT.name}</p>
                  <p className="text-slate-400 text-[11px] font-medium">{EXPERT.role}</p>
                  <p className="text-emerald-500 text-[10px] font-black flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                    En ligne · {EXPERT.responseTime}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveView('chat')}
                className="w-full flex items-center justify-center gap-2 bg-navy hover:bg-navy/90 text-white text-sm font-black rounded-xl py-2.5 transition-all active:scale-95"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Démarrer la conversation
              </button>
            </div>
          </div>

          {/* Quick actions */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-4 py-2.5 border-b border-slate-100">
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-slate-400">Actions rapides</p>
            </div>
            <div className="p-2">
              {([
                { label: 'Uploader un document', icon: Upload,       onClick: () => setActiveView('documents'), dot: 'bg-blue-500' },
                { label: 'Voir mes factures',    icon: CreditCard,   onClick: () => setActiveView('billing'),   dot: 'bg-amber-500' },
                { label: 'Mon diagnostic',       icon: Activity,     href: '/diagnostic',                       dot: 'bg-coral' },
                { label: 'Contacter un avocat',  icon: MessageSquare,onClick: () => setActiveView('chat'),      dot: 'bg-violet-500' },
              ] as const).map((item) => {
                const inner = (
                  <>
                    <span className={cn('w-2 h-2 rounded-full shrink-0', item.dot)} />
                    <span className="text-sm font-semibold text-slate-700 flex-1 text-left">{item.label}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                  </>
                );
                return 'href' in item ? (
                  <Link key={item.label} href={item.href} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                    {inner}
                  </Link>
                ) : (
                  <button key={item.label} onClick={(item as any).onClick} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                    {inner}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Compliance score (if diagnostic done) */}
          {score !== null && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-4 py-2.5 border-b border-slate-100">
                <p className="text-[9px] font-black uppercase tracking-[0.18em] text-slate-400">Score de conformité</p>
              </div>
              <div className="p-4 flex items-center gap-4">
                <ComplianceRing score={score} size="md" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    {score < 40 ? 'Des lacunes importantes à corriger.' : score < 70 ? 'Bonne base — quelques points à renforcer.' : 'Entreprise bien protégée.'}
                  </p>
                  <Link href="/diagnostic" className="mt-2 inline-flex items-center gap-1 text-xs font-black text-navy hover:text-coral transition-colors">
                    Refaire <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Chat View ────────────────────────────────────────────────────────────────
function ChatView() {
  const [input, setInput] = React.useState('');
  const scrollRef = React.useRef<HTMLDivElement>(null);
  
  const EXPERTS = {
    amine: EXPERT,
    sarah: {
      name: 'Me. Sarah Bensmail',
      role: 'Conseil Fiscal',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&h=200&auto=format&fit=crop',
      online: false,
      responseTime: '< 4h'
    },
    karim: {
      name: 'Me. Karim Zerrouki',
      role: 'Propriété Intellectuelle',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&h=200&auto=format&fit=crop',
      online: true,
      responseTime: '< 1h'
    },
    lynda: {
      name: 'Me. Lynda Belkacem',
      role: 'Droit du Travail',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&h=200&auto=format&fit=crop',
      online: true,
      responseTime: '< 1h30'
    }
  };

  const [selectedExpert, setSelectedExpert] = React.useState(EXPERTS.amine);
  const [isBookingOpen, setIsBookingOpen] = React.useState(false);
  const [bookingStep, setBookingStep] = React.useState(1);
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d;
  });
  const [selectedTime, setSelectedTime] = React.useState<string | null>(null);

  const TIMES = ['09:00', '10:30', '14:00', '15:30', '17:00'];

  const CONVOS = [
    { 
      id: '1', 
      expert: EXPERTS.amine, 
      lastMsg: 'Je vous envoie la version finale...', 
      time: '09:45', 
      unread: 0 
    },
    { 
      id: '2', 
      expert: EXPERTS.sarah, 
      lastMsg: 'Votre bilan est prêt.', 
      time: 'Hier', 
      unread: 2 
    },
    {
      id: '3',
      expert: EXPERTS.karim,
      lastMsg: 'Le dépôt INAPI est validé.',
      time: '2 j.',
      unread: 0
    },
    {
      id: '4',
      expert: EXPERTS.lynda,
      lastMsg: 'Le contrat est conforme.',
      time: '1 sem.',
      unread: 0
    }
  ];

  // Map to track messages for each conversation
  const [chatHistories, setChatHistories] = React.useState<Record<string, any[]>>({
    '1': DEMO_MESSAGES,
    '2': [
      { id: '101', sender: 'expert', text: "Bonjour, j'ai terminé l'analyse de votre dernier bilan fiscal.", time: 'Hier', date: 'Hier' },
      { id: '102', sender: 'user', text: "Merci Sarah. Est-ce qu'on peut optimiser les charges sociales ?", time: 'Hier', date: 'Hier' },
    ],
    '3': [
      { id: '301', sender: 'expert', text: "J'ai bien reçu votre demande de dépôt de marque. C'est en cours.", time: 'Lundi', date: 'Lundi' },
    ],
    '4': [
      { id: '401', sender: 'expert', text: "Le nouveau contrat de travail pour votre commercial est prêt.", time: '10/04', date: '10/04' },
    ]
  });

  const activeConvo = CONVOS.find(c => c.expert.name === selectedExpert.name) || CONVOS[0];
  const currentMessages = chatHistories[activeConvo.id] || [];

  React.useEffect(() => {
    if (scrollRef.current) {
      const el = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (el) el.scrollTop = el.scrollHeight;
    }
  }, [currentMessages, selectedExpert]);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMsg = { 
      id: Date.now().toString(), 
      sender: 'user', 
      text: input, 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 
      date: "Aujourd'hui" 
    };
    
    setChatHistories(prev => ({
      ...prev,
      [activeConvo.id]: [...(prev[activeConvo.id] || []), newMsg]
    }));
    
    setInput('');
    
    setTimeout(() => {
      setChatHistories(prev => ({
        ...prev,
        [activeConvo.id]: [
          ...(prev[activeConvo.id] || []), 
          { 
            id: (Date.now() + 1).toString(), 
            sender: 'expert', 
            text: `Merci pour votre message concernant ${selectedExpert.name === EXPERT.name ? 'les statuts' : 'la fiscalité'}. Je l'examine immédiatement.`, 
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 
            date: "Aujourd'hui" 
          }
        ]
      }));
    }, 1500);
  };

  return (
    <div className="flex h-[calc(100vh-130px)] bg-white rounded-2xl border-0 shadow-sm overflow-hidden border-2 border-white">
      {/* Convos Sidebar */}
      <div className="w-80 border-r border-slate-100 hidden md:flex flex-col bg-slate-50/30">
        <div className="p-4 border-b border-slate-100 bg-white">
          <h3 className="font-black text-navy text-sm">Mes Conversations</h3>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {CONVOS.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedExpert(c.expert)}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-xl transition-all",
                  selectedExpert.name === c.expert.name ? "bg-white shadow-sm ring-1 ring-slate-100" : "hover:bg-white/50"
                )}
              >
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={c.expert.avatar} />
                    <AvatarFallback>{c.expert.name[0]}</AvatarFallback>
                  </Avatar>
                  {c.expert.online && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center justify-between">
                    <p className="font-black text-navy text-xs truncate">{c.expert.name}</p>
                    <span className="text-[10px] text-slate-400 font-bold">{c.time}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium truncate mt-0.5">{c.lastMsg}</p>
                </div>
                {c.unread > 0 && (
                  <span className="w-4 h-4 bg-coral text-white text-[9px] font-black rounded-full flex items-center justify-center">
                    {c.unread}
                  </span>
                )}
              </button>
            ))}
          </div>
        </ScrollArea>
        <div className="p-4 border-t border-slate-100 bg-white">
          <Button variant="outline" className="w-full rounded-xl border-slate-200 text-[10px] font-black uppercase tracking-widest h-9">
            Nouveau message
          </Button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Chat header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white/50 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="h-10 w-10">
                <AvatarImage src={selectedExpert.avatar} />
                <AvatarFallback>{selectedExpert.name[0]}</AvatarFallback>
              </Avatar>
              {selectedExpert.online && <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />}
            </div>
            <div>
              <p className="font-black text-navy text-sm">{selectedExpert.name}</p>
              <p className="text-[10px] font-bold text-slate-500">{selectedExpert.role}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              className="bg-navy hover:bg-navy/90 text-white font-black text-[10px] uppercase tracking-widest px-4 h-9 rounded-xl shadow-lg shadow-navy/10"
              onClick={() => {
                setBookingStep(1);
                setIsBookingOpen(true);
              }}
            >
              <Calendar className="w-3.5 h-3.5 mr-2 text-coral" />
              Prendre RDV
            </Button>
            <Separator orientation="vertical" className="h-6 bg-slate-100" />
            <Button variant="ghost" size="icon" className="rounded-xl h-9 w-9 text-slate-400 hover:text-navy">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Booking Modal */}
        <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
          <DialogContent className="sm:max-w-[480px] p-0 border-0 overflow-hidden rounded-3xl bg-white shadow-2xl">
            <AnimatePresence mode="wait">
              {bookingStep === 1 && (
                <motion.div 
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex flex-col h-full"
                >
                  <div className="p-6 border-b border-slate-100 bg-white">
                    <div className="flex items-center gap-4 mb-2">
                      <div className="w-12 h-12 rounded-2xl bg-coral/10 flex items-center justify-center shrink-0">
                        <Calendar className="w-6 h-6 text-coral" />
                      </div>
                      <div>
                        <DialogTitle className="text-xl font-black text-navy">Planifier un rendez-vous</DialogTitle>
                        <DialogDescription className="font-medium text-slate-500 text-xs mt-1">
                          Choisissez une date et un créneau pour votre consultation avec {selectedExpert.name}.
                        </DialogDescription>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 space-y-8 bg-white/50 relative">
                    <div className="flex justify-center bg-white/40 backdrop-blur-md border border-white/60 shadow-sm rounded-3xl p-4 relative z-10">
                      <CalendarComponent 
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        className="border-0 p-0"
                        disabled={{ before: new Date() }}
                      />
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-px bg-slate-200 flex-1" />
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Créneaux disponibles</label>
                        <div className="h-px bg-slate-200 flex-1" />
                      </div>
                      <div className="grid grid-cols-5 gap-2.5">
                        {TIMES.map(t => (
                          <button
                            key={t}
                            onClick={() => setSelectedTime(t)}
                            className={cn(
                              "py-2.5 rounded-full text-xs font-black transition-all border shadow-sm",
                              selectedTime === t 
                                ? "bg-navy text-white border-navy ring-4 ring-navy/10" 
                                : "bg-white text-navy border-slate-200 hover:border-navy/30 hover:bg-slate-50"
                            )}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-5 border-t border-slate-100 bg-white flex justify-between items-center rounded-b-3xl">
                    <Button variant="ghost" onClick={() => setIsBookingOpen(false)} className="rounded-xl font-bold text-slate-400 hover:text-navy hover:bg-slate-50">
                      Annuler
                    </Button>
                    <Button 
                      disabled={!selectedDate || !selectedTime}
                      onClick={() => setBookingStep(2)}
                      className="bg-navy hover:bg-navy/90 text-white font-black rounded-xl px-8 shadow-lg shadow-navy/20 transition-all disabled:shadow-none"
                    >
                      Suivant <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {bookingStep === 2 && (
                <motion.div 
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="p-6"
                >
                  <DialogHeader className="mb-6">
                    <DialogTitle className="text-xl font-black text-navy">Détails de la consultation</DialogTitle>
                    <DialogDescription className="font-medium text-slate-500">
                      Précisez l&apos;objet de votre appel pour que {selectedExpert.name} puisse se préparer.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-5">
                    <div className="p-4 bg-slate-50 rounded-2xl flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                        <Clock className="w-5 h-5 text-navy/40" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-navy">{selectedDate?.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                        <p className="text-[10px] font-bold text-slate-500">à {selectedTime}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Sujet de discussion</label>
                      <Input placeholder="Ex: Revue de pacte d'associés" className="h-12 rounded-xl border-slate-200 font-medium" />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Notes additionnelles</label>
                      <textarea 
                        className="w-full min-h-[100px] p-4 rounded-2xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-navy/5 outline-none resize-none"
                        placeholder="Quels points spécifiques souhaitez-vous aborder ?"
                      />
                    </div>
                  </div>

                  <DialogFooter className="mt-8 flex gap-3 sm:justify-end">
                    <Button variant="ghost" onClick={() => setBookingStep(1)} className="rounded-xl font-bold text-slate-400">
                      Retour
                    </Button>
                    <Button 
                      onClick={() => setBookingStep(3)}
                      className="bg-coral hover:bg-coral/90 text-white font-black rounded-xl px-8"
                    >
                      Confirmer le RDV
                    </Button>
                  </DialogFooter>
                </motion.div>
              )}

              {bookingStep === 3 && (
                <motion.div 
                  key="step3"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-8 text-center"
                >
                  <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6 relative">
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 20 }}
                      className="w-full h-full rounded-full bg-green-500 flex items-center justify-center"
                    >
                      <CheckCircle2 className="w-10 h-10 text-white" />
                    </motion.div>
                    <motion.div 
                      animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 rounded-full bg-green-500 -z-10"
                    />
                  </div>

                  <h3 className="text-2xl font-black text-navy mb-2">C&apos;est confirmé !</h3>
                  <p className="text-slate-500 font-medium mb-8">
                    Votre rendez-vous avec {selectedExpert.name} est enregistré pour le <span className="text-navy font-bold">{selectedDate?.toLocaleDateString('fr-FR')}</span> à <span className="text-navy font-bold">{selectedTime}</span>.
                  </p>

                  <div className="bg-slate-50 p-4 rounded-2xl mb-8 flex items-center gap-3 text-left">
                    <Zap className="w-5 h-5 text-amber-500 shrink-0" />
                    <p className="text-xs font-bold text-slate-600">
                      Un lien de visioconférence vous a été envoyé par email ainsi qu&apos;une invitation calendrier.
                    </p>
                  </div>

                  <Button 
                    onClick={() => setIsBookingOpen(false)}
                    className="w-full bg-navy text-white font-black rounded-xl py-6"
                  >
                    Fermer
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </DialogContent>
        </Dialog>

        {/* Messages */}
        <ScrollArea ref={scrollRef} className="flex-1 px-6 py-6 bg-slate-50/30">
          <div className="space-y-6">
            <div className="flex items-center gap-4 my-4">
              <div className="flex-1 h-px bg-slate-100" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Discussion active</span>
              <div className="flex-1 h-px bg-slate-100" />
            </div>
            {currentMessages.map((m, i) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={cn('flex gap-3', m.sender === 'user' ? 'justify-end' : 'justify-start')}
              >
                {m.sender === 'expert' && (
                  <Avatar className="h-8 w-8 shrink-0 mt-1 border border-slate-100">
                    <AvatarImage src={selectedExpert.avatar} />
                    <AvatarFallback>{selectedExpert.name[0]}</AvatarFallback>
                  </Avatar>
                )}
                <div className={cn('max-w-[75%]', m.sender === 'user' ? 'items-end' : 'items-start', 'flex flex-col gap-1.5')}>
                  <div className={cn(
                    'px-5 py-3 rounded-2xl text-sm leading-relaxed font-medium shadow-sm',
                    m.sender === 'user'
                      ? 'bg-navy text-white rounded-tr-sm'
                      : 'bg-white text-slate-800 rounded-tl-sm border border-slate-100',
                  )}>
                    {m.text}
                  </div>
                  <div className={cn('flex items-center gap-1.5 px-1', m.sender === 'user' ? 'justify-end' : 'justify-start')}>
                    <span className="text-[10px] text-slate-400 font-bold">{m.time}</span>
                    {m.sender === 'user' && <CheckCheck className="w-3.5 h-3.5 text-blue-500" />}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollArea>

        {/* Input area */}
        <div className="px-6 py-4 border-t border-slate-100 bg-white shrink-0">
          <div className="flex items-center gap-3 bg-slate-50 rounded-2xl border border-slate-200 px-4 py-2.5 focus-within:border-navy/30 focus-within:bg-white focus-within:shadow-lg focus-within:shadow-navy/5 transition-all">
            <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0 rounded-xl text-slate-400 hover:text-navy hover:bg-white shadow-sm">
              <Paperclip className="h-4.5 w-4.5" />
            </Button>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
              placeholder={`Message à ${selectedExpert.name.split(' ')[1]}...`}
              className="border-none bg-transparent focus-visible:ring-0 h-10 text-sm font-medium"
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim()}
              className="h-10 px-5 shrink-0 bg-navy hover:bg-navy/90 text-white rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-40 shadow-md shadow-navy/10"
            >
              Envoyer <Send className="h-3.5 w-3.5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Documents View ───────────────────────────────────────────────────────────
function DocumentsView({ userId }: { userId: string }) {
  const [files, setFilesState] = React.useState<(StoredFile & { filePath?: string })[]>([]);
  const [view, setView] = React.useState<'list' | 'grid'>('list');
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const loadFiles = async () => {
      setIsLoading(true);
      const docs = await getDocuments(userId);
      setFilesState(docs as any);
      setIsLoading(false);
    };
    loadFiles();
  }, [userId]);

  const handleUploadComplete = (file: StoredFile) => setFilesState((prev) => [...prev, file as any]);
  const handleDelete = (fileId: string) => {
    const updated = files.filter((f) => f.id !== fileId);
    setFilesState(updated);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-black text-navy tracking-tight">Mon Legal Drive</h2>
          <p className="text-slate-500 text-sm mt-0.5">Gérez vos documents juridiques en toute sécurité.</p>
        </div>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={() => setView(view === 'list' ? 'grid' : 'list')} className="rounded-xl border-slate-200 h-9 w-9">
                  {view === 'list' ? <Grid3X3 className="h-4 w-4" /> : <List className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Changer de vue</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Storage info */}
      {isLoading && (
        <Card className="border-0 shadow-sm bg-white rounded-2xl">
          <CardContent className="p-4">
            <Skeleton className="h-4 w-full" />
          </CardContent>
        </Card>
      )}

      {/* Upload zone */}
      <Card className="border-0 shadow-sm bg-white rounded-2xl">
        <CardContent className="p-5">
          <FileUpload userId={userId} onUploadComplete={handleUploadComplete} />
        </CardContent>
      </Card>

      {/* File list */}
      <Card className="border-0 shadow-sm bg-white rounded-2xl overflow-hidden">
        <CardHeader className="px-5 py-4 border-b border-slate-50 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-black text-navy">Documents ({files.length})</CardTitle>
          <Button variant="ghost" size="sm" className="text-xs text-slate-400 hover:text-navy rounded-xl gap-1">
            <Filter className="w-3.5 h-3.5" />Filtrer
          </Button>
        </CardHeader>
        <CardContent className="p-4">
          <FileList files={files} userId={userId} onDelete={handleDelete} />
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Billing View ─────────────────────────────────────────────────────────────
function BillingView() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-black text-navy tracking-tight">Facturation</h2>
        <p className="text-slate-500 text-sm mt-0.5">Gérez votre abonnement et vos factures.</p>
      </div>

      {/* Current plan */}
      <Card className="border-0 shadow-sm bg-navy rounded-2xl overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(239,108,119,0.2),transparent_60%)]" />
        <CardContent className="p-6 relative">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Star className="w-4 h-4 text-coral" />
                <span className="text-coral text-xs font-black uppercase tracking-widest">Abonnement actif</span>
              </div>
              <h3 className="text-2xl font-black text-white">Pack Essentiel</h3>
              <p className="text-white/60 text-sm mt-1">Création, contrats, DPO mensuel inclus</p>
              <div className="flex items-baseline gap-1 mt-3">
                <span className="text-3xl font-black text-white">57 000</span>
                <span className="text-white/50 font-bold">DA / mois</span>
              </div>
            </div>
            <Button className="bg-white/10 hover:bg-white/20 text-white font-black rounded-xl border border-white/20 text-sm">
              Gérer l&apos;abonnement
            </Button>
          </div>
          <div className="mt-5 pt-5 border-t border-white/10 flex items-center gap-2">
            <Clock className="w-4 h-4 text-white/40" />
            <span className="text-white/40 text-xs font-bold">Renouvellement le 1er Mai 2026</span>
          </div>
        </CardContent>
      </Card>

      {/* Invoices */}
      <Card className="border-0 shadow-sm bg-white rounded-2xl overflow-hidden">
        <CardHeader className="px-6 py-5 border-b border-slate-50">
          <CardTitle className="text-base font-black text-navy">Historique des factures</CardTitle>
        </CardHeader>
        <Table>
          <TableHeader>
            <TableRow className="border-slate-50 hover:bg-transparent">
              <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-6">Facture</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">Date</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">Montant</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">Statut</TableHead>
              <TableHead className="pr-6" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {DEMO_INVOICES.map((inv) => (
              <TableRow key={inv.id} className="border-slate-50 hover:bg-slate-50/60 transition-colors">
                <TableCell className="pl-6 py-4">
                  <div>
                    <p className="font-bold text-navy text-sm">{inv.label}</p>
                    <p className="text-xs text-slate-400">{inv.id}</p>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-slate-500">{inv.date}</TableCell>
                <TableCell className="font-black text-navy text-sm">{inv.amount}</TableCell>
                <TableCell><StatusBadge status={inv.status} /></TableCell>
                <TableCell className="pr-6">
                  <Button variant="ghost" size="sm" className="text-xs text-slate-400 hover:text-navy rounded-xl gap-1.5">
                    <Download className="w-3.5 h-3.5" />PDF
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

// ─── Settings View ────────────────────────────────────────────────────────────
function SettingsView() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = React.useState({ name: user?.name ?? '', company: user?.company ?? '', city: user?.city ?? '' });
  const [saved, setSaved] = React.useState(false);
  if (!user) return null;
  const initials = user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  const handleSave = () => {
    updateUser({ name: form.name, company: form.company, city: form.city });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <h2 className="text-2xl font-black text-navy tracking-tight">Paramètres</h2>
        <p className="text-slate-500 text-sm mt-0.5">Gérez votre profil et vos préférences.</p>
      </div>

      {/* Profile card */}
      <Card className="border-0 shadow-sm bg-white rounded-2xl">
        <CardHeader className="px-6 py-5 border-b border-slate-50">
          <CardTitle className="text-base font-black text-navy">Informations personnelles</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-5">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-navy text-white font-black text-xl">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-black text-navy">{user.name}</p>
              <p className="text-sm text-slate-500">{user.email}</p>
              <p className="text-xs text-slate-400 mt-1">Membre depuis {new Date(user.createdAt).toLocaleDateString('fr-DZ', { month: 'long', year: 'numeric' })}</p>
            </div>
          </div>
          <Sep />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-black text-navy uppercase tracking-wider">Nom complet</label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="h-10 rounded-xl border-slate-200 text-sm focus-visible:ring-navy/20" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-black text-navy uppercase tracking-wider">Email</label>
              <Input value={user.email} disabled className="h-10 rounded-xl border-slate-200 text-sm opacity-60" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-black text-navy uppercase tracking-wider">Entreprise</label>
              <Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })}
                className="h-10 rounded-xl border-slate-200 text-sm focus-visible:ring-navy/20" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-black text-navy uppercase tracking-wider">Ville</label>
              <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="h-10 rounded-xl border-slate-200 text-sm focus-visible:ring-navy/20" />
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleSave} className={cn('font-black rounded-xl px-6 text-sm transition-all', saved ? 'bg-green-500 hover:bg-green-500' : 'bg-navy hover:bg-navy/90')}>
              {saved ? '✓ Enregistré !' : 'Enregistrer les modifications'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Business info */}
      <Card className="border-0 shadow-sm bg-white rounded-2xl">
        <CardHeader className="px-6 py-5 border-b border-slate-50">
          <CardTitle className="text-base font-black text-navy">Informations entreprise</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            {[
              { icon: Building2, label: 'Forme juridique', value: user.businessType },
              { icon: MapPin, label: 'Ville', value: user.city || '—' },
              { icon: Mail, label: 'Email', value: user.email },
              { icon: Calendar, label: 'Inscription', value: new Date(user.createdAt).toLocaleDateString('fr-DZ') },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-navy/5 flex items-center justify-center shrink-0 mt-0.5">
                  <item.icon className="w-4 h-4 text-navy/40" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">{item.label}</p>
                  <p className="font-bold text-navy mt-0.5">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Danger zone */}
      <Card className="border border-coral/20 bg-coral/5 rounded-2xl shadow-none">
        <CardContent className="p-5 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="font-black text-coral text-sm">Zone de danger</p>
            <p className="text-slate-500 text-xs mt-0.5">La suppression de votre compte est irréversible.</p>
          </div>
          <Button variant="outline" className="border-coral/30 text-coral hover:bg-coral hover:text-white font-black rounded-xl text-xs">
            Supprimer mon compte
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Page Shell ────────────────────────────────────────────────────────────────
function EspaceClientContent() {
  const { user, logout } = useAuth();
  const [activeView, setActiveView] = React.useState<View>('dashboard');
  const [diagnostic, setDiagnosticState] = React.useState<DiagnosticAnswers | null>(null);
  const [notifications, setNotifications] = React.useState<any[]>([]);
  const [showNotifs, setShowNotifs] = React.useState(false);
  const notifRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const d = getDiagnostic();
    setDiagnosticState(d ?? user?.onboardingAnswers ?? null);
  }, [user]);

  React.useEffect(() => {
    if (!user?.id) return;
    
    // Initial fetch
    getNotifications(user.id).then(setNotifications);

    // Real-time subscription
    const channel = supabase
      .channel(`notifications:${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const newNotif = payload.new;
          if (!newNotif.read) {
            setNotifications((prev) => [newNotif, ...prev]);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const updatedNotif = payload.new;
          if (updatedNotif.read) {
            setNotifications((prev) => prev.filter((n) => n.id !== updatedNotif.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  // Close notif panel on outside click
  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifs(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleMarkRead = async (id: string) => {
    await markNotificationRead(id);
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  if (!user) return null;
  const initials = user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  const NAV_ITEMS: { view: View; label: string; icon: React.ElementType; badge?: string }[] = [
    { view: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { view: 'chat', label: 'Messages', icon: MessageSquare, badge: '2' },
    { view: 'documents', label: 'Documents', icon: FileText },
    { view: 'billing', label: 'Facturation', icon: CreditCard },
    { view: 'settings', label: 'Paramètres', icon: Settings },
  ];

  const breadcrumbs: Record<View, string> = {
    dashboard: 'Tableau de bord', chat: 'Messages', documents: 'Documents',
    billing: 'Facturation', settings: 'Paramètres',
  };

  return (
    <SidebarProvider>
      <Sidebar
        variant="sidebar"
        collapsible="icon"
        className="border-r border-slate-100/80 bg-white shadow-sm"
      >
        {/* ── Logo ── */}
        <SidebarHeader className="h-16 flex items-center px-4 border-b border-slate-100">
          <Link href="/" className="flex items-center gap-2.5 min-w-0">
            <Image
              src="/logo.png"
              alt="Legal Pilot"
              width={32}
              height={32}
              className="rounded-lg shrink-0"
            />
            <span className="font-black text-navy tracking-tight text-[15px] group-data-[collapsible=icon]:hidden truncate">
              Legal <span className="text-coral">Pilot</span>
            </span>
          </Link>
        </SidebarHeader>

        {/* ── Navigation ── */}
        <SidebarContent className="px-2 py-4 flex flex-col gap-1">
          <SidebarGroup>
            <p className="px-3 mb-2 text-[9px] font-black uppercase tracking-[0.18em] text-slate-400 group-data-[collapsible=icon]:hidden">
              Navigation
            </p>
            <SidebarMenu className="gap-0.5">
              {NAV_ITEMS.map(({ view, label, icon: Icon, badge }) => (
                <SidebarMenuItem key={view}>
                  <SidebarMenuButton
                    isActive={activeView === view}
                    onClick={() => setActiveView(view)}
                    className={cn(
                      'h-10 rounded-xl font-semibold text-sm transition-all duration-200 relative group/btn',
                      activeView === view
                        ? 'bg-navy text-white shadow-md shadow-navy/20'
                        : 'text-slate-500 hover:bg-slate-50 hover:text-navy',
                    )}
                  >
                    <Icon className={cn('h-4 w-4 shrink-0 transition-colors', activeView === view ? 'text-white' : 'text-slate-400 group-hover/btn:text-navy')} />
                    <span className="group-data-[collapsible=icon]:hidden">{label}</span>
                    {badge && (
                      <span className="ml-auto group-data-[collapsible=icon]:hidden text-[9px] font-black bg-coral text-white rounded-full w-4 h-4 flex items-center justify-center shrink-0">
                        {badge}
                      </span>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

        {/* ── User + Logout ── */}
        <SidebarFooter className="p-3 border-t border-slate-100 space-y-1">
          {/* User card */}
          <button
            onClick={() => setActiveView('settings')}
            className="w-full flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group text-left"
          >
            <Avatar className="h-8 w-8 shrink-0 ring-2 ring-slate-100">
              <AvatarFallback className="bg-gradient-to-br from-navy to-[#2d4a7a] text-white text-xs font-black">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
              <p className="text-xs font-black text-navy truncate">{user.name}</p>
              <p className="text-[10px] text-slate-400 font-medium truncate">{user.company}</p>
            </div>
            <ChevronRight className="w-3 h-3 text-slate-300 group-hover:text-navy shrink-0 group-data-[collapsible=icon]:hidden" />
          </button>

          {/* Logout — always visible */}
          <button
            onClick={logout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-400 hover:text-coral hover:bg-coral/5 transition-all group text-sm font-semibold"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            <span className="group-data-[collapsible=icon]:hidden">Se déconnecter</span>
          </button>
        </SidebarFooter>
      </Sidebar>

      {/* ── Main Content ── */}
      <SidebarInset className="bg-[#f8f9fc] min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between px-6 bg-white border-b border-slate-100 shadow-sm">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="text-slate-400 hover:text-navy rounded-lg" />
            <Sep orientation="vertical" className="h-5 bg-slate-200" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <span className="text-xs font-semibold text-slate-400">Espace Client</span>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-xs font-black text-navy">{breadcrumbs[activeView]}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
              <Input placeholder="Rechercher…" className="pl-9 h-9 w-48 bg-slate-50 border-slate-200 rounded-xl text-xs focus-visible:ring-navy/20" />
            </div>
            <Sep orientation="vertical" className="h-5 bg-slate-200 hidden md:block" />
            {/* Notification Bell */}
            <div className="relative" ref={notifRef}>
              <Button
                variant="ghost" size="icon"
                onClick={() => setShowNotifs(v => !v)}
                className="relative rounded-xl h-9 w-9 text-slate-500 hover:text-navy hover:bg-slate-100 transition-all active:scale-95"
              >
                <Bell className="h-4.5 w-4.5" />
                {notifications.length > 0 && (
                  <>
                    <span className="absolute top-1.5 right-1.5 h-3 w-3 bg-coral text-white text-[8px] font-black rounded-full flex items-center justify-center ring-2 ring-white z-10">
                      {notifications.length > 9 ? '9+' : notifications.length}
                    </span>
                    <span className="absolute top-1.5 right-1.5 h-3 w-3 bg-coral rounded-full animate-ping opacity-40" />
                  </>
                )}
              </Button>
              <AnimatePresence>
                {showNotifs && (
                  <motion.div
                    initial={{ opacity: 0, y: 12, scale: 0.95, filter: 'blur(4px)' }}
                    animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: 8, scale: 0.95, filter: 'blur(4px)' }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="absolute right-0 top-12 w-80 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-navy/10 border border-slate-100 z-50 overflow-hidden"
                  >
                    <div className="px-4 py-3.5 border-b border-slate-100 flex items-center justify-between bg-white/50">
                      <p className="text-[10px] font-black text-navy uppercase tracking-widest">Notifications</p>
                      {notifications.length > 0 && (
                        <button
                          onClick={() => notifications.forEach(n => handleMarkRead(n.id))}
                          className="text-[10px] font-black text-coral hover:text-coral/80 transition-colors"
                        >
                          Tout marquer lu
                        </button>
                      )}
                    </div>
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center bg-white/50">
                        <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-3">
                          <Bell className="w-6 h-6 text-slate-200" />
                        </div>
                        <p className="text-xs text-slate-400 font-bold">Aucune notification</p>
                      </div>
                    ) : (
                      <div className="max-h-[360px] overflow-y-auto divide-y divide-slate-50 scrollbar-hide">
                        {notifications.map((n, i) => (
                          <motion.div 
                            key={n.id}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="flex items-start gap-3 px-4 py-4 hover:bg-slate-50/80 transition-all cursor-default group"
                          >
                            <div className={cn('w-2 h-2 rounded-full mt-1.5 shrink-0 shadow-sm', {
                              'bg-coral shadow-coral/20': n.type === 'action',
                              'bg-blue-400 shadow-blue-400/20': n.type === 'info',
                              'bg-green-400 shadow-green-400/20': n.type === 'success',
                            })} />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-black text-navy leading-tight">{n.title}</p>
                              <p className="text-[11px] text-slate-500 font-medium mt-1 line-clamp-2 leading-relaxed">{n.body}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <Clock className="w-3 h-3 text-slate-300" />
                                <p className="text-[9px] text-slate-300 font-bold uppercase tracking-wider">
                                  {new Date(n.created_at).toLocaleDateString('fr-DZ', { day: 'numeric', month: 'short' })}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => handleMarkRead(n.id)}
                              className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-200 hover:text-navy hover:bg-white hover:shadow-sm transition-all opacity-0 group-hover:opacity-100"
                            >
                              <CheckCheck className="w-4 h-4" />
                            </button>
                          </motion.div>
                        ))}
                      </div>
                    )}
                    {notifications.length > 0 && (
                      <div className="p-3 bg-slate-50/50 border-t border-slate-100 text-center">
                        <button className="text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-navy transition-colors">
                          Voir tout l&apos;historique
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6 md:p-8 max-w-7xl mx-auto w-full relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {activeView === 'dashboard' && <DashboardView diagnostic={diagnostic} setActiveView={setActiveView} />}
              {activeView === 'chat' && <ChatView />}
              {activeView === 'documents' && <DocumentsView userId={user.id} />}
              {activeView === 'billing' && <BillingView />}
              {activeView === 'settings' && <SettingsView />}
            </motion.div>
          </AnimatePresence>
          <MorphPanel />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default function EspaceClientPage() {
  return (
    <AuthGuard>
      <EspaceClientContent />
    </AuthGuard>
  );
}
