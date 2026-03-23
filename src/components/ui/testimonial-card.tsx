import { cn } from "@/lib/utils"
import { Avatar, AvatarImage } from "@/components/ui/avatar"

export interface TestimonialAuthor {
  name: string
  handle: string
  avatar: string
}

export interface TestimonialCardProps {
  author: TestimonialAuthor
  text: string
  href?: string
  className?: string
}

export function TestimonialCard({ 
  author,
  text,
  href,
  className
}: TestimonialCardProps) {
  const Card = href ? 'a' : 'div'
  
  return (
    <Card
      {...(href ? { href } : {})}
      className={cn(
        "flex flex-col rounded-[2rem] border border-navy/10",
        "bg-white/30 backdrop-blur-sm",
        "p-6 text-start",
        "hover:bg-white/50 hover:border-coral/20 hover:scale-[1.02]",
        "max-w-[320px] sm:max-w-[340px]",
        "transition-all duration-500 shadow-sm hover:shadow-xl hover:shadow-navy/5",
        className
      )}
    >
      <div className="flex items-center gap-4">
        <div className="relative">
          <Avatar className="h-14 w-14 border-2 border-background ring-2 ring-navy/5">
            <AvatarImage src={author.avatar} alt={author.name} />
          </Avatar>
          <div className="absolute -bottom-1 -right-1 bg-coral p-1 rounded-full shadow-lg">
             <div className="w-1.5 h-1.5 bg-white rounded-full" />
          </div>
        </div>
        <div className="flex flex-col items-start gap-0.5">
          <h3 className="text-base font-serif font-bold tracking-tight text-navy">
            {author.name}
          </h3>
          <p className="text-[10px] text-navy/40 font-black uppercase tracking-widest">
            {author.handle}
          </p>
        </div>
      </div>
      <p className="mt-5 text-sm font-medium leading-relaxed italic text-navy/80">
        &ldquo;{text}&rdquo;
      </p>
    </Card>
  )
}
