import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface PricingTier {
    name: string;
    icon: React.ReactNode;
    price: string | number;
    unit?: string;
    description: string;
    features: string[];
    popular?: boolean;
    color: string;
}

function CreativePricing({
    tag,
    title,
    description,
    tiers,
}: {
    tag?: string;
    title?: string;
    description?: string;
    tiers: PricingTier[];
}) {
    return (
        <div className="w-full max-w-6xl mx-auto px-6 py-12 relative overflow-visible">
            {title && (
                <div className="text-center space-y-8 mb-12 relative z-10">
                    {/* Brand Badge */}
                    {tag && (
                        <div className="flex justify-center">
                            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border-2 border-navy/10 bg-background shadow-sm">
                                <span className="flex h-2 w-2 rounded-full bg-navy animate-pulse" />
                                <span className="text-[10px] font-bold text-navy uppercase tracking-widest leading-none">
                                    {tag}
                                </span>
                            </div>
                        </div>
                    )}

                    <div className="relative inline-block">
                        <h2 className="font-serif font-bold text-4xl sm:text-5xl lg:text-6xl text-navy leading-[1.1] tracking-tight px-4">
                            {title}
                            <div className="absolute -right-12 top-0 text-3xl animate-pulse rotate-12 hidden md:block">
                                ✨
                            </div>
                        </h2>
                    </div>
                    
                    {description && (
                        <p className="font-medium text-lg sm:text-xl text-navy/60 max-w-2xl mx-auto leading-relaxed italic">
                            {description}
                        </p>
                    )}
                </div>
            )}

            <div className={cn(
                "grid grid-cols-1 gap-10 relative z-10",
                tiers.length === 1 ? "md:grid-cols-1 max-w-sm mx-auto" : 
                tiers.length === 2 ? "md:grid-cols-2 max-w-4xl mx-auto" : 
                "md:grid-cols-3"
            )}>
                {tiers.map((tier, index) => (
                    <div
                        key={tier.name}
                        className={cn(
                            "relative group h-full",
                            "transition-all duration-300",
                            index === 0 && "rotate-[-1.5deg]",
                            index === 1 && "rotate-[1deg]",
                            index === 2 && "rotate-[-1.5deg]"
                        )}
                    >
                        {/* Shadow/Outline Surface */}
                        <div
                            className={cn(
                                "absolute inset-0",
                                tier.color === 'amber' && "bg-amber-50/50",
                                tier.color === 'blue' && "bg-blue-50/50",
                                tier.color === 'purple' && "bg-purple-50/50",
                                tier.color === 'navy' && "bg-navy dark:bg-navy shadow-navy/20",
                                tier.color === 'coral' && "bg-coral shadow-coral/20",
                                !tier.color && "bg-background",
                                "border-2 border-navy dark:border-white",
                                "rounded-3xl shadow-[8px_8px_0px_0px] shadow-navy dark:shadow-white",
                                "transition-all duration-500",
                                "group-hover:shadow-[12px_12px_0px_0px]",
                                "group-hover:translate-x-[-4px]",
                                "group-hover:translate-y-[-4px]"
                            )}
                        />

                        <div className="relative p-10 h-full flex flex-col">
                            {tier.popular && (
                                <div
                                    className="absolute -top-4 -right-2 bg-white text-coral 
                                    font-handwritten px-4 py-1.5 rounded-full rotate-12 text-sm border-2 border-navy shadow-lg"
                                >
                                    Conseillé !
                                </div>
                            )}

                            <div className="mb-6">
                                <div
                                    className={cn(
                                        "w-14 h-14 rounded-2xl mb-5",
                                        "flex items-center justify-center",
                                        "border-2 border-navy dark:border-white shadow-[4px_4px_0px_0px] shadow-navy/20",
                                        (tier.color === 'navy' || tier.color === 'coral') ? "text-navy bg-white" : `text-${tier.color}-500 bg-white`
                                    )}
                                >
                                    {tier.icon}
                                </div>
                                <h3 className={cn(
                                    "font-handwritten text-3xl mb-2",
                                    (tier.color === 'navy' || tier.color === 'coral') ? "text-white" : "text-navy dark:text-white"
                                )}>
                                    {tier.name}
                                </h3>
                                <p className={cn(
                                    "font-handwritten text-lg leading-snug",
                                    (tier.color === 'navy' || tier.color === 'coral') ? "text-white/80" : "text-navy/70 dark:text-zinc-400"
                                )}>
                                    {tier.description}
                                </p>
                            </div>

                            {/* Price */}
                            <div className="mb-8 font-handwritten flex items-baseline gap-1">
                                <span className={cn(
                                    "text-5xl font-bold",
                                    (tier.color === 'navy' || tier.color === 'coral') ? "text-white" : "text-navy dark:text-white"
                                )}>
                                    {tier.price}
                                </span>
                                <span className={cn(
                                    "text-xl font-medium",
                                    (tier.color === 'navy' || tier.color === 'coral') ? "text-white/60" : "text-navy/50 dark:text-zinc-400"
                                )}>
                                    {tier.unit || "DA"}
                                </span>
                            </div>

                            <div className="space-y-4 mb-10">
                                {tier.features.map((feature) => (
                                    <div
                                        key={feature}
                                        className="flex items-start gap-3"
                                    >
                                        <div
                                            className={cn(
                                                "w-5 h-5 mt-1 rounded-full border-2 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform",
                                                (tier.color === 'navy' || tier.color === 'coral') ? "border-navy bg-white" : "border-navy bg-white"
                                            )}
                                        >
                                            <Check className={cn(
                                                "w-3 h-3 text-navy"
                                            )} />
                                        </div>
                                        <span className={cn(
                                            "font-handwritten text-lg leading-tight",
                                            (tier.color === 'navy' || tier.color === 'coral') ? "text-white" : "text-navy dark:text-white"
                                        )}>
                                            {feature}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-auto">
                                <InteractiveHoverButton
                                    text="Démarrer mon projet"
                                    variant={tier.popular ? "coral" : "navy"}
                                    className="w-full h-14 text-xl"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Doodles/Background elements REMOVED per user request */}
            <div className="absolute inset-0 pointer-events-none opacity-20">
                {/* Background doodles removed */}
            </div>
        </div>
    );
}

export { CreativePricing, type PricingTier }
