'use client';
import React from 'react';
import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MenuToggleIcon } from '@/components/ui/menu-toggle-icon';
import { useScroll } from '@/hooks/use-scroll';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LogOut, User } from 'lucide-react';

export function Header() {
	const scrolled = useScroll(10);
	const [open, setOpen] = React.useState(false);
	const [servicesOpen, setServicesOpen] = React.useState(false);
	const [userMenuOpen, setUserMenuOpen] = React.useState(false);
	const { user, isAuthenticated, logout } = useAuth();

	const services = [
		{ label: "Création d'entreprise", href: '/creation', description: 'Immatriculation rapide' },
		{ label: 'Juridique & Contrats', href: '/juridique', description: 'Avocats & Experts' },
		{ label: 'Modifications', href: '/modifications', description: 'Évolutions statutaires' },
	];

	const initials = user?.name
		.split(' ')
		.map((n) => n[0])
		.join('')
		.toUpperCase()
		.slice(0, 2) ?? '';

	React.useEffect(() => {
		if (open) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
		return () => {
			document.body.style.overflow = '';
		};
	}, [open]);

	return (
		<header
			className={cn(
				'fixed top-0 z-50 mx-auto left-0 right-0 w-full md:top-5 md:w-[90%] max-w-5xl border transition-all duration-300 md:rounded-2xl',
				scrolled && !open
					? 'bg-background/80 border-navy/10 backdrop-blur-xl md:top-4 md:max-w-4xl md:shadow-lg py-1 shadow-navy/5'
					: 'bg-transparent border-transparent py-1 md:py-2',
				{
					'bg-background h-full top-0 w-full max-w-none rounded-none border-none': open,
				},
			)}
		>
			<nav
				className={cn(
					'flex h-16 md:h-12 w-full items-center justify-between px-6 md:transition-all md:ease-out',
					{ 'md:px-4': scrolled },
				)}
			>
				<Link href="/" className="flex items-center gap-2 group cursor-pointer shrink-0">
					<img src="/logo.png" alt="Legal Pilot" className="h-7 md:h-8 w-auto object-contain transition-transform group-hover:scale-105" />
				</Link>

				<div className="hidden items-center gap-1 md:flex">
					<Link
						className={cn(buttonVariants({ variant: 'ghost' }), 'font-bold text-navy/80 hover:text-coral transition-colors text-sm uppercase tracking-wide')}
						href="/"
					>
						Accueil
					</Link>

					<Link
						className={cn(buttonVariants({ variant: 'ghost' }), 'font-bold text-navy/80 hover:text-coral transition-colors text-sm uppercase tracking-wide')}
						href="/diagnostic"
					>
						Diagnostic
					</Link>

					<div
						className="relative"
						onMouseEnter={() => setServicesOpen(true)}
						onMouseLeave={() => setServicesOpen(false)}
					>
						<button className={cn(buttonVariants({ variant: 'ghost' }), 'font-bold text-navy/80 hover:text-coral transition-colors flex items-center gap-1.5 text-sm uppercase tracking-wide')}>
							Services
							<svg className={cn('w-3.5 h-3.5 transition-transform duration-200', servicesOpen && 'rotate-180')} fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
							</svg>
						</button>
						<div className={cn(
							'absolute top-full left-1/2 -translate-x-1/2 pt-4 transition-all duration-200',
							servicesOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none',
						)}>
							<div className="bg-background border border-navy/10 rounded-2xl shadow-xl p-3 w-64 grid gap-1">
								{services.map((item) => (
									<Link key={item.label} href={item.href} className="flex flex-col gap-0.5 p-2.5 rounded-xl hover:bg-navy/5 group transition-colors">
										<span className="font-bold text-navy group-hover:text-coral transition-colors text-[13px]">{item.label}</span>
										<span className="text-[10px] text-navy/60 font-black uppercase tracking-tighter">{item.description}</span>
									</Link>
								))}
							</div>
						</div>
					</div>

					<Link
						className={cn(buttonVariants({ variant: 'ghost' }), 'font-bold text-navy/80 hover:text-coral transition-colors text-sm uppercase tracking-wide')}
						href="#about"
					>
						À propos
					</Link>

					{isAuthenticated ? (
						<div
							className="relative ml-4"
							onMouseEnter={() => setUserMenuOpen(true)}
							onMouseLeave={() => setUserMenuOpen(false)}
						>
							<button className="flex items-center gap-2 group">
								<Avatar className="h-8 w-8 ring-2 ring-navy/10 group-hover:ring-coral/40 transition-all">
									<AvatarFallback className="bg-navy text-white text-xs font-black">{initials}</AvatarFallback>
								</Avatar>
								<span className="text-sm font-black text-navy hidden xl:block">{user?.name.split(' ')[0]}</span>
							</button>
							<div className={cn(
								'absolute top-full right-0 pt-2 transition-all duration-200 min-w-[180px]',
								userMenuOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none',
							)}>
								<div className="bg-background border border-navy/10 rounded-2xl shadow-xl p-2 space-y-0.5">
									<Link href="/espace-client" className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-navy/5 group transition-colors">
										<User className="w-4 h-4 text-navy/40 group-hover:text-navy" />
										<span className="font-bold text-navy text-sm">Mon espace</span>
									</Link>
									<button onClick={logout} className="w-full flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-coral/5 group transition-colors">
										<LogOut className="w-4 h-4 text-navy/40 group-hover:text-coral" />
										<span className="font-bold text-navy group-hover:text-coral text-sm">Se déconnecter</span>
									</button>
								</div>
							</div>
						</div>
					) : (
						<>
							<Link href="/espace-client" className={cn(buttonVariants({ variant: 'outline' }), 'rounded-full border-navy/10 text-navy font-bold ml-4 text-xs h-9 px-4 uppercase')}>
								Espace Client
							</Link>
							<Link href="/diagnostic">
								<Button className="rounded-full bg-navy hover:bg-coral text-white font-bold px-5 h-9 text-xs uppercase tracking-wide">
									Démarrer
								</Button>
							</Link>
						</>
					)}
				</div>

				<Button size="icon" variant="ghost" onClick={() => setOpen(!open)} className="md:hidden text-navy hover:bg-transparent">
					<MenuToggleIcon open={open} className="size-6" duration={300} />
				</Button>
			</nav>

			{/* Mobile menu */}
			<div className={cn('fixed top-20 right-0 bottom-0 left-0 z-50 flex flex-col overflow-hidden md:hidden bg-background', open ? 'block' : 'hidden')}>
				<div
					data-slot={open ? 'open' : 'closed'}
					className={cn(
						'data-[slot=open]:animate-in data-[slot=open]:slide-in-from-top-4 data-[slot=closed]:animate-out data-[slot=closed]:slide-out-to-top-4 ease-out',
						'flex h-full w-full flex-col justify-between gap-y-2 p-8',
					)}
				>
					<div className="grid gap-y-2">
						<Link className="text-xl font-black text-navy hover:text-coral transition-colors py-2 uppercase tracking-tight" href="/" onClick={() => setOpen(false)}>
							Accueil
						</Link>
						<Link className="text-xl font-black text-navy hover:text-coral transition-colors py-2 uppercase tracking-tight" href="/diagnostic" onClick={() => setOpen(false)}>
							Diagnostic
						</Link>
						<div className="py-4 space-y-4">
							<span className="text-[10px] font-black uppercase tracking-widest text-navy/50">Nos Services</span>
							<div className="grid gap-y-4 ml-2">
								{services.map((link) => (
									<Link
										key={link.label}
										className="text-xl font-black text-navy hover:text-coral transition-colors uppercase tracking-tight"
										href={link.href}
										onClick={() => setOpen(false)}
									>
										{link.label}
									</Link>
								))}
							</div>
						</div>
						<Link className="text-xl font-black text-navy hover:text-coral transition-colors py-2 uppercase tracking-tight" href="#about" onClick={() => setOpen(false)}>
							À propos
						</Link>
					</div>
					<div className="flex flex-col gap-4 mb-20">
						{isAuthenticated ? (
							<>
								<Link href="/espace-client" onClick={() => setOpen(false)} className={cn(buttonVariants({ variant: 'outline' }), 'w-full h-14 rounded-2xl text-base font-black uppercase tracking-widest')}>
									Mon espace
								</Link>
								<Button onClick={() => { logout(); setOpen(false); }} className="w-full h-14 rounded-2xl bg-coral text-base font-black uppercase tracking-widest hover:bg-coral/90">
									Se déconnecter
								</Button>
							</>
						) : (
							<>
								<Link href="/espace-client" onClick={() => setOpen(false)} className={cn(buttonVariants({ variant: 'outline' }), 'w-full h-14 rounded-2xl text-base font-black uppercase tracking-widest')}>
									Espace Client
								</Link>
								<Link href="/diagnostic" onClick={() => setOpen(false)}>
									<Button className="w-full h-14 rounded-2xl bg-navy text-base font-black uppercase tracking-widest hover:bg-coral">
										Démarrer
									</Button>
								</Link>
							</>
						)}
					</div>
				</div>
			</div>
		</header>
	);
}
