import { cn } from "@/lib/utils"
import { TestimonialCard, TestimonialAuthor } from "@/components/ui/testimonial-card"

interface TestimonialsSectionProps {
  title: string
  description: string
  testimonials: Array<{
    author: TestimonialAuthor
    text: string
    href?: string
  }>
  className?: string
}

export function TestimonialsSection({ 
  title,
  description,
  testimonials,
  className 
}: TestimonialsSectionProps) {
  return (
    <section className={cn(
      "bg-background text-navy overflow-hidden",
      "py-24 sm:py-32 px-0",
      className
    )}>
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 text-center sm:gap-12">
        {/* Brand Badge */}
        <div className="flex justify-center mb-4">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border-2 border-navy/10 bg-background shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-navy animate-pulse" />
            <span className="text-[10px] font-bold text-navy uppercase tracking-widest leading-none">
              Témoignages
            </span>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 px-4 sm:gap-6 mb-8">
          <h2 className="max-w-[820px] font-serif font-bold text-4xl sm:text-5xl lg:text-6xl leading-[1.1] tracking-tight text-navy">
            {title}
          </h2>
          <p className="text-md max-w-[600px] font-medium text-navy/60 sm:text-lg leading-relaxed italic">
            {description}
          </p>
        </div>

        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
          <div className="group flex overflow-hidden p-2 [--gap:1.5rem] [gap:var(--gap)] flex-row [--duration:50s]">
            <div className="flex shrink-0 justify-around [gap:var(--gap)] animate-marquee flex-row group-hover:[animation-play-state:paused]">
              {[...Array(4)].map((_, setIndex) => (
                testimonials.map((testimonial, i) => (
                  <TestimonialCard 
                    key={`${setIndex}-${i}`}
                    {...testimonial}
                  />
                ))
              ))}
            </div>
          </div>

          <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-1/3 bg-gradient-to-r from-background sm:block" />
          <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/3 bg-gradient-to-l from-background sm:block" />
        </div>
      </div>
    </section>
  )
}
