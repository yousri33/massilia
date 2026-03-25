'use client';

import * as React from 'react';
import { 
  LayoutDashboard, 
  MessageSquare, 
  FileText, 
  CreditCard, 
  Settings, 
  Search, 
  Bell, 
  User, 
  LogOut, 
  Send,
  MoreVertical,
  Paperclip,
  CheckCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// --- Types & Data ---

type View = 'dashboard' | 'chat' | 'documents' | 'billing' | 'settings';

const DATA = {
  user: {
    name: 'Yousri Aberkane',
    email: 'yousri.a@massilia.dz',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200&h=200&auto=format&fit=crop',
    company: 'Massilia Digital SARL',
    location: 'Alger, Algérie'
  },
  expert: {
    name: 'Me. Amine Hadjadj',
    role: 'Avocat à la Cour - Expert en Droit des Sociétés',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&h=200&auto=format&fit=crop',
    online: true
  },
  stats: [
    { label: 'Dossiers Actifs', value: '4', trend: '+1', color: 'bg-blue-500' },
    { label: 'Documents Signés', value: '12', trend: '+3', color: 'bg-green-500' },
    { label: 'Factures en attente', value: '2', trend: '0', color: 'bg-amber-500' },
    { label: 'Temps de réponse expert', value: '15m', trend: '-2m', color: 'bg-purple-500' },
  ],
  recentCases: [
    { id: '1', title: 'Rédaction Statuts SARL', date: '25 Mars 2024', status: 'En cours', progress: 65 },
    { id: '2', title: 'Contrat de Distribution Oran', date: '20 Mars 2024', status: 'Terminé', progress: 100 },
    { id: '3', title: 'Dépôt de Marque INAPI', date: '18 Mars 2024', status: 'Action requise', progress: 30 },
  ],
  messages: [
    { id: '1', sender: 'expert', text: 'Bonjour Yousri, j\'ai bien reçu vos documents pour la modification des statuts.', time: '10:30' },
    { id: '2', sender: 'user', text: 'Merci Maître. Est-ce que le procès-verbal est conforme à la nouvelle loi de finances ?', time: '10:32' },
    { id: '3', sender: 'expert', text: 'Absolument. J\'ai intégré les nouvelles dispositions concernant le capital social. Je vous envoie la version finale demain matin.', time: '10:45' },
  ]
};

// --- Components ---

const ChatInterface = () => {
  const [messages, setMessages] = React.useState(DATA.messages);
  const [input, setInput] = React.useState('');
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMessage = {
        id: Date.now().toString(),
        sender: 'user',
        text: input,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([...messages, newMessage]);
    setInput('');
    
    // Fake expert reply
    setTimeout(() => {
        setMessages(prev => [...prev, {
            id: (Date.now() + 1).toString(),
            sender: 'expert',
            text: "C'est noté, je reviens vers vous rapidement.",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
    }, 1500);
  };

  return (
    <Card className="flex flex-col h-[calc(100vh-180px)] border-none shadow-2xl bg-white/80 backdrop-blur-md rounded-3xl overflow-hidden ring-1 ring-navy/5">
      <CardHeader className="flex flex-row items-center justify-between border-b border-navy/5 bg-gradient-to-r from-slate-50 to-white px-6 py-5">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
              <AvatarImage src={DATA.expert.avatar} />
              <AvatarFallback>AH</AvatarFallback>
            </Avatar>
            {DATA.expert.online && (
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white" />
            )}
          </div>
          <div>
            <CardTitle className="text-sm font-bold">{DATA.expert.name}</CardTitle>
            <CardDescription className="text-xs">{DATA.expert.role}</CardDescription>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <Button variant="ghost" size="icon" className="rounded-full"><Search className="h-4 w-4" /></Button>
           <Button variant="ghost" size="icon" className="rounded-full"><MoreVertical className="h-4 w-4" /></Button>
        </div>
      </CardHeader>
      
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-slate-200"
      >
        <div className="text-center py-4 text-xs font-black uppercase tracking-widest text-slate-400">
            Aujourd'hui
        </div>
        
        {messages.map((m) => (
          <div key={m.id} className={cn("flex", m.sender === 'user' ? "justify-end" : "justify-start")}>
            <div className={cn(
               "max-w-[75%] px-4 py-3 rounded-2xl shadow-sm text-sm",
               m.sender === 'user' 
                ? "bg-navy text-white rounded-br-none" 
                : "bg-white text-slate-700 rounded-bl-none border border-slate-100"
            )}>
              <p className="leading-relaxed">{m.text}</p>
              <div className={cn("flex items-center gap-1 mt-1 justify-end", m.sender === 'user' ? "text-white/50" : "text-slate-400")}>
                <span className="text-[10px]">{m.time}</span>
                {m.sender === 'user' && <CheckCheck className="h-3 w-3" />}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-white/50 backdrop-blur-lg border-t border-navy/5 shadow-[0_-10px_40px_rgba(0,0,0,0.03)]">
        <div className="flex items-center gap-3 bg-slate-50 rounded-2xl border p-2 focus-within:ring-2 ring-navy/5 transition-all">
          <Button variant="ghost" size="icon" className="shrink-0 rounded-full text-slate-400 hover:text-navy"><Paperclip className="h-5 w-5" /></Button>
          <Input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Écrivez votre message..." 
            className="border-none bg-transparent focus-visible:ring-0 px-0 h-10"
          />
          <Button 
            onClick={handleSend}
            disabled={!input.trim()}
            className="shrink-0 rounded-xl bg-navy hover:bg-navy/90 text-white shadow-md active:scale-95 transition-transform"
          >
            <Send className="h-4 w-4 mr-2" />
            Envoyer
          </Button>
        </div>
      </div>
    </Card>
  );
};

const DashboardView = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-black text-navy tracking-tighter drop-shadow-sm">Bonjour, <span className="text-coral">{DATA.user.name.split(' ')[0]}</span> 👋</h1>
            <p className="text-slate-500 font-medium text-lg">Voici le point sur vos dossiers juridiques pour <span className="font-bold text-navy">{DATA.user.company}</span>.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {DATA.stats.map((stat, i) => (
                <Card key={i} className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/90 backdrop-blur-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 rounded-3xl">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className={cn("p-2 rounded-xl text-white", stat.color)}>
                                <LayoutDashboard className="h-5 w-5" />
                            </div>
                            <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-100 font-black">+12%</Badge>
                        </div>
                        <p className="text-sm font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                        <h3 className="text-2xl font-black text-navy mt-1">{stat.value}</h3>
                    </CardContent>
                </Card>
            ))}
        </div>

        {/* Two Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/90 backdrop-blur-md overflow-hidden rounded-3xl">
                    <CardHeader className="border-b bg-slate-50/50">
                        <CardTitle className="text-lg font-black text-navy">Dossiers Récents</CardTitle>
                        <CardDescription>Suivi de vos procédures en cours</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-slate-100">
                            {DATA.recentCases.map((item) => (
                                <div key={item.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-navy/5 rounded-2xl text-navy">
                                            <FileText className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-navy">{item.title}</p>
                                            <p className="text-xs text-slate-400 font-medium">{item.date} • {DATA.user.location}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="hidden md:block w-32">
                                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full bg-coral transition-all duration-1000" 
                                                    style={{ width: `${item.progress}%` }} 
                                                />
                                            </div>
                                            <p className="text-[10px] text-right mt-1 font-black text-coral">{item.progress}%</p>
                                        </div>
                                        <Badge 
                                            className={cn(
                                                "font-black uppercase text-[10px] tracking-widest",
                                                item.status === 'Terminé' ? "bg-green-500" : "bg-navy"
                                            )}
                                        >
                                            {item.status}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-6">
                <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.12)] bg-gradient-to-br from-navy via-navy to-slate-900 text-white overflow-hidden rounded-3xl relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-coral/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-black italic">Besoin d'aide ?</CardTitle>
                        <CardDescription className="text-white/60">Contactez directement votre expert juridique dédié.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                        <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                            <Avatar className="h-12 w-12 ring-2 ring-coral/20">
                                <AvatarImage src={DATA.expert.avatar} />
                                <AvatarFallback>AH</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-bold">{DATA.expert.name}</p>
                                <p className="text-xs text-white/50 font-medium">Expert Sénior</p>
                            </div>
                        </div>
                        <Button className="relative group w-full bg-coral hover:bg-coral/90 text-white font-black py-7 rounded-2xl shadow-[0_0_40px_rgba(255,107,107,0.3)] hover:shadow-[0_0_60px_rgba(255,107,107,0.4)] transition-all active:scale-[0.98] overflow-hidden">
                            <span className="relative z-10 text-base tracking-wide">Démarrer le chat</span>
                            <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                        </Button>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/90 backdrop-blur-md rounded-3xl">
                    <CardHeader>
                        <CardTitle className="text-lg font-black text-navy">Notifications</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 pt-0 space-y-4">
                        {[1, 2].map((i) => (
                           <div key={i} className="flex gap-4 items-start p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer group">
                              <div className="h-2 w-2 rounded-full bg-coral mt-2 shrink-0 group-hover:scale-125 transition-transform" />
                              <div>
                                 <p className="text-sm font-bold text-navy">Votre contrat a été validé</p>
                                 <p className="text-xs text-slate-400">Il y a 2 heures</p>
                              </div>
                           </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
};

// --- Page Main ---

export default function EspaceClientPage() {
  const [activeView, setActiveView] = React.useState<View>('dashboard');

  return (
    <SidebarProvider>
      <Sidebar variant="sidebar" collapsible="icon" className="border-r border-slate-100">
        <SidebarHeader className="h-20 flex justify-center px-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-navy rounded-xl flex items-center justify-center text-white p-1 shadow-lg">
                <LayoutDashboard className="h-5 w-5" />
            </div>
            <span className="font-black text-navy tracking-tight text-xl group-data-[collapsible=icon]:hidden">
                LEGAL <span className="text-coral">PILOT</span>
            </span>
          </div>
        </SidebarHeader>

        <SidebarContent className="px-2">
          <SidebarGroup>
            <SidebarGroupLabel className="text-slate-400 uppercase tracking-[0.2em] font-black text-[10px] px-4 py-4">Menu Principal</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                   isActive={activeView === 'dashboard'} 
                   onClick={() => setActiveView('dashboard')}
                   className={cn("h-11 rounded-xl font-bold transition-all", activeView === 'dashboard' ? "bg-navy text-white shadow-md shadow-navy/20" : "text-slate-500 hover:bg-slate-100")}
                >
                  <LayoutDashboard className="h-5 w-5" />
                  <span>Tableau de Bord</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                   isActive={activeView === 'chat'} 
                   onClick={() => setActiveView('chat')}
                   className={cn("h-11 rounded-xl font-bold transition-all", activeView === 'chat' ? "bg-navy text-white shadow-md shadow-navy/20" : "text-slate-500 hover:bg-slate-100")}
                >
                  <MessageSquare className="h-5 w-5" />
                  <span>Chat avec Expert</span>
                  <Badge className="ml-auto bg-coral text-white border-none text-[10px] h-5 w-5 flex items-center justify-center p-0 rounded-full font-black">2</Badge>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                   isActive={activeView === 'documents'} 
                   onClick={() => setActiveView('documents')}
                   className={cn("h-11 rounded-xl font-bold transition-all", activeView === 'documents' ? "bg-navy text-white shadow-md shadow-navy/20" : "text-slate-500 hover:bg-slate-100")}
                >
                  <FileText className="h-5 w-5" />
                  <span>Mes Documents</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel className="text-slate-400 uppercase tracking-[0.2em] font-black text-[10px] px-4 py-4">Gestion</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                   isActive={activeView === 'billing'} 
                   onClick={() => setActiveView('billing')}
                   className="h-11 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-all"
                >
                  <CreditCard className="h-5 w-5" />
                  <span>Factures</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                   isActive={activeView === 'settings'} 
                   onClick={() => setActiveView('settings')}
                   className="h-11 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-all"
                >
                  <Settings className="h-5 w-5" />
                  <span>Configuration</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="p-4">
          <div className="bg-slate-50 rounded-2xl p-3 flex items-center gap-3 border border-slate-100 overflow-hidden">
            <Avatar className="h-10 w-10 ring-2 ring-white">
                <AvatarImage src={DATA.user.avatar} />
                <AvatarFallback>YA</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
                <p className="text-sm font-black text-navy truncate">{DATA.user.name}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight truncate">{DATA.user.company}</p>
            </div>
            <Button variant="ghost" size="icon" className="shrink-0 text-slate-400 group-data-[collapsible=icon]:hidden"><LogOut className="h-4 w-4" /></Button>
          </div>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset className="bg-slate-50/10 transition-colors">
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-2 px-6 bg-white/40 backdrop-blur-md border-b">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <Separator orientation="vertical" className="h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="#" className="font-bold text-slate-400">Tableau de Bord</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-black text-navy">
                    {activeView === 'dashboard' ? 'Général' : activeView === 'chat' ? 'Conversation Expert' : 'Documents'}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className="flex items-center gap-4">
             <div className="relative group hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-navy transition-colors" />
                <Input placeholder="Rechercher..." className="pl-10 h-10 w-[240px] bg-slate-50 border-none rounded-full text-xs font-bold focus-visible:ring-navy/10 placeholder:text-slate-300" />
             </div>
             <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-slate-100">
                <Bell className="h-5 w-5 text-slate-500" />
                <span className="absolute top-2 right-2 h-2 w-2 bg-coral rounded-full ring-2 ring-white" />
             </Button>
          </div>
        </header>

        <main className="p-8 max-w-7xl mx-auto w-full min-h-[calc(100vh-64px)]">
           <AnimatePresence mode="wait">
             <motion.div
               key={activeView}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
               transition={{ duration: 0.3 }}
               className="h-full"
             >
                {activeView === 'dashboard' && <DashboardView />}
                {activeView === 'chat' && <ChatInterface />}
                {activeView === 'documents' && (
                  <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
                    <div className="p-6 bg-slate-100 rounded-full"><FileText className="h-12 w-12 text-slate-400" /></div>
                    <h2 className="text-xl font-bold text-navy">Vos documents juridiques</h2>
                    <p className="text-slate-400 max-w-xs">Gérez vos contrats, statuts et actes administratifs signés.</p>
                  </div>
                )}
             </motion.div>
           </AnimatePresence>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
