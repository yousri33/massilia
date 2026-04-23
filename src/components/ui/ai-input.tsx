"use client"

import React, { useState, useRef, useEffect, useCallback } from "react"
import { cx } from "class-variance-authority"
import { AnimatePresence, motion } from "motion/react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/useAuth"
import { getDiagnostic } from "@/lib/storage"
import { getAiHistory, appendAiMessage, clearAiHistory } from "@/lib/db"

interface OrbProps {
  dimension?: string
  className?: string
  tones?: {
    base?: string
    accent1?: string
    accent2?: string
    accent3?: string
  }
  spinDuration?: number
}

const ColorOrb: React.FC<OrbProps> = ({
  dimension = "192px",
  className,
  tones,
  spinDuration = 20,
}) => {
  const fallbackTones = {
    base: "oklch(22.64% 0 0)", // Dark for contrast
    accent1: "oklch(60.62% 0.165 24.12)", // Coral-like
    accent2: "oklch(45.13% 0.106 250.62)", // Navy-like
    accent3: "oklch(91.56% 0.083 89.26)", // Cream-like
  }

  const palette = { ...fallbackTones, ...tones }

  const dimValue = parseInt(dimension.replace("px", ""), 10)

  const blurStrength =
    dimValue < 50 ? Math.max(dimValue * 0.008, 1) : Math.max(dimValue * 0.015, 4)

  const contrastStrength =
    dimValue < 50 ? Math.max(dimValue * 0.004, 1.2) : Math.max(dimValue * 0.008, 1.5)

  const pixelDot = dimValue < 50 ? Math.max(dimValue * 0.004, 0.05) : Math.max(dimValue * 0.008, 0.1)

  const shadowRange = dimValue < 50 ? Math.max(dimValue * 0.004, 0.5) : Math.max(dimValue * 0.008, 2)

  const maskRadius =
    dimValue < 30 ? "0%" : dimValue < 50 ? "5%" : dimValue < 100 ? "15%" : "25%"

  const adjustedContrast =
    dimValue < 30 ? 1.1 : dimValue < 50 ? Math.max(contrastStrength * 1.2, 1.3) : contrastStrength

  return (
    <div
      className={cn("color-orb shrink-0", className)}
      style={{
        width: dimension,
        height: dimension,
        "--base": palette.base,
        "--accent1": palette.accent1,
        "--accent2": palette.accent2,
        "--accent3": palette.accent3,
        "--spin-duration": `${spinDuration}s`,
        "--blur": `${blurStrength}px`,
        "--contrast": adjustedContrast,
        "--dot": `${pixelDot}px`,
        "--shadow": `${shadowRange}px`,
        "--mask": maskRadius,
      } as React.CSSProperties}
    >
      <style jsx>{`
        @property --angle {
          syntax: "<angle>";
          inherits: false;
          initial-value: 0deg;
        }

        .color-orb {
          display: grid;
          grid-template-areas: "stack";
          overflow: hidden;
          border-radius: 50%;
          position: relative;
          transform: scale(1.1);
        }

        .color-orb::before,
        .color-orb::after {
          content: "";
          display: block;
          grid-area: stack;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          transform: translateZ(0);
        }

        .color-orb::before {
          background:
            conic-gradient(
              from calc(var(--angle) * 2) at 25% 70%,
              var(--accent3),
              transparent 20% 80%,
              var(--accent3)
            ),
            conic-gradient(
              from calc(var(--angle) * 2) at 45% 75%,
              var(--accent2),
              transparent 30% 60%,
              var(--accent2)
            ),
            conic-gradient(
              from calc(var(--angle) * -3) at 80% 20%,
              var(--accent1),
              transparent 40% 60%,
              var(--accent1)
            ),
            conic-gradient(
              from calc(var(--angle) * 2) at 15% 5%,
              var(--accent2),
              transparent 10% 90%,
              var(--accent2)
            ),
            conic-gradient(
              from calc(var(--angle) * 1) at 20% 80%,
              var(--accent1),
              transparent 10% 90%,
              var(--accent1)
            ),
            conic-gradient(
              from calc(var(--angle) * -2) at 85% 10%,
              var(--accent3),
              transparent 20% 80%,
              var(--accent3)
            );
          box-shadow: inset var(--base) 0 0 var(--shadow) calc(var(--shadow) * 0.2);
          filter: blur(var(--blur)) contrast(var(--contrast));
          animation: spin var(--spin-duration) linear infinite;
        }

        .color-orb::after {
          background-image: radial-gradient(
            circle at center,
            var(--base) var(--dot),
            transparent var(--dot)
          );
          background-size: calc(var(--dot) * 2) calc(var(--dot) * 2);
          backdrop-filter: blur(calc(var(--blur) * 2)) contrast(calc(var(--contrast) * 2));
          mix-blend-mode: overlay;
        }

        .color-orb[style*="--mask: 0%"]::after {
          mask-image: none;
        }

        .color-orb:not([style*="--mask: 0%"])::after {
          mask-image: radial-gradient(black var(--mask), transparent 75%);
        }

        @keyframes spin {
          to {
            --angle: 360deg;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .color-orb::before {
            animation: none;
          }
        }
      `}</style>
    </div>
  )
}

const Typewriter = ({ text, onComplete }: { text: string; onComplete?: () => void }) => {
  const [displayedText, setDisplayedText] = useState("")
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        // Fast typing: append multiple characters if possible for speed
        const chunk = text.slice(index, index + 3) 
        setDisplayedText((prev) => prev + chunk)
        setIndex((prev) => prev + 3)
      }, 5) // Very fast interval
      return () => clearTimeout(timeout)
    } else {
      onComplete?.()
    }
  }, [index, text, onComplete])

  return <ReactMarkdown remarkPlugins={[remarkGfm]}>{displayedText}</ReactMarkdown>
}

const QUICK_ACTIONS = [
  "Créer mon entreprise",
  "Documents requis",
  "Besoin DPO ?",
  "Tarifs et packs",
]

interface Message {
    role: "user" | "model"
    parts: { text: string }[]
}

export function MorphPanel() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const { user } = useAuth()
  const [showForm, setShowForm] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [msg, setMsg] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Load persisted AI history from Supabase on mount
  useEffect(() => {
    if (!user?.id) return
    getAiHistory(user.id).then(rows => {
      if (rows.length > 0) {
        setMessages(rows.map(r => ({ role: r.role, parts: [{ text: r.content }] })))
      }
    })
  }, [user?.id])

  const triggerClose = useCallback((e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setShowForm(false)
    textareaRef.current?.blur()
  }, [])

  const triggerOpen = useCallback(() => {
    setShowForm(true)
    setTimeout(() => {
      textareaRef.current?.focus()
    })
  }, [])

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isLoading])

  useEffect(() => {
    function clickOutsideHandler(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node) && showForm) {
        // Only close if it's truly a click outside
        // triggerClose()
      }
    }
    document.addEventListener("mousedown", clickOutsideHandler)
    return () => document.removeEventListener("mousedown", clickOutsideHandler)
  }, [showForm, triggerClose])

  const sendMessage = useCallback(async (text: string, currentMessages: Message[]) => {
    if (isLoading || !text.trim()) return

    const updatedMessages = [...currentMessages, { role: "user" as const, parts: [{ text }] }]
    setMessages(updatedMessages)
    setIsLoading(true)

    // Persist user message to Supabase
    if (user?.id) await appendAiMessage(user.id, "user", text)

    try {
      const diagnostic = getDiagnostic()
      // Always send full user context even without diagnostic
      const userContext = user ? {
        name: user.name,
        firstName: user.name.split(' ')[0],
        company: user.company,
        businessType: user.businessType,
        city: user.city,
        businessStage: diagnostic?.businessStage ?? null,
        complianceNeeds: diagnostic?.complianceNeeds ?? [],
        legalStructure: diagnostic?.legalStructure ?? null,
        employeesCount: diagnostic?.employeesCount ?? null,
      } : null

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: currentMessages.map(m => ({ role: m.role, parts: m.parts })),
          userContext,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || `Error ${res.status}`)

      const aiText = data.message
      setMessages(prev => [...prev, { role: "model", parts: [{ text: aiText }] }])

      // Persist AI response to Supabase
      if (user?.id) await appendAiMessage(user.id, "model", aiText)
    } catch (err: any) {
      console.error(err)
      const errText = `⚠️ **Erreur de connexion**\n\n${err.message === 'Failed to fetch' ? 'Le serveur est hors ligne.' : err.message}`
      setMessages(prev => [...prev, { role: "model", parts: [{ text: errText }] }])
    } finally {
      setIsLoading(false)
    }
  }, [isLoading, user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!msg.trim() || isLoading) return;
    const userMsg = msg;
    setMsg("");
    await sendMessage(userMsg, messages)
  }

  const handleKeys = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Escape") triggerClose()
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as any)
    }
  }

  const dynamicHeight = showForm 
    ? (isMobile ? "calc(90dvh - 32px)" : (messages.length > 0 ? 600 : 320)) 
    : 64;
  const dynamicWidth = showForm 
    ? (isMobile ? "calc(100vw - 32px)" : (messages.length > 0 ? 500 : 450)) 
    : 64;

  const borderRadius = showForm 
    ? (isMobile ? 32 : 28) 
    : 32;

  const positionX = showForm && isMobile ? "0px" : "auto";
  const bottom = showForm && isMobile ? "16px" : "24px";
  const right = showForm && isMobile ? "16px" : "24px";

  return (
    <div className={cn(
        "z-[99] pointer-events-auto",
        showForm && isMobile ? "fixed inset-0 flex items-end justify-center pb-4" : "fixed bottom-6 right-6"
    )}>
      <motion.div
        ref={wrapperRef}
        className={cx(
          "bg-navy relative flex flex-col items-center overflow-hidden border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.6)]",
          !showForm && "cursor-pointer hover:scale-110 active:scale-95 transition-transform"
        )}
        initial={false}
        animate={{
          width: dynamicWidth,
          height: dynamicHeight,
          borderRadius: borderRadius,
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 35,
        }}
        onClick={() => !showForm && triggerOpen()}
      >
        <AnimatePresence mode="wait">
          {!showForm ? (
            <motion.div
              key="orb-only"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="flex h-full w-full items-center justify-center"
            >
              <ColorOrb dimension="44px" tones={{ base: "oklch(95% 0 0)" }} />
            </motion.div>
          ) : (
            <div className="w-full h-full flex flex-col relative overflow-hidden">
              {/* Header */}
              <div className="flex justify-between items-center p-4 border-b border-white/5 bg-navy/50 backdrop-blur-sm z-10 shrink-0">
                <div className="flex items-center gap-3">
                  <ColorOrb dimension="24px" className={cn(isLoading && "animate-pulse")} tones={{ base: "oklch(95% 0 0)" }} />
                  <p className="text-white/70 font-black text-[10px] uppercase tracking-widest leading-none">
                    AI ASSISTANCE
                  </p>
                </div>
                <button 
                  type="button"
                  onClick={(e) => triggerClose(e)}
                  className="p-2 hover:bg-white/10 rounded-full transition-all group active:scale-90"
                >
                  <svg className="w-4 h-4 text-white/50 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Chat View */}
              <div 
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 space-y-5 scrollbar-thin scrollbar-thumb-white/10"
              >
                {messages.length === 0 && !isLoading && (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-5 px-6 animate-in fade-in zoom-in duration-700">
                    <div className="p-5 bg-white/5 rounded-full ring-8 ring-white/[0.02]">
                        <svg className="w-10 h-10 text-coral animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <div className="space-y-2">
                        <p className="text-white text-xl font-black tracking-tight">
                          {user ? `Bonjour, ${user.name.split(' ')[0]} !` : 'Bonjour !'}
                        </p>
                        <p className="text-white/80 text-sm font-bold">
                          {user?.company
                            ? `Assistant juridique pour ${user.company}`
                            : "Je suis l'assistant Legal Pilot."}
                        </p>
                    </div>
                    <p className="text-white/40 text-xs font-bold leading-relaxed max-w-[240px]">
                        Posez votre question pour obtenir une orientation juridique personnalisée en Algérie.
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {QUICK_ACTIONS.map((action) => (
                        <button
                          key={action}
                          type="button"
                          onClick={() => sendMessage(action, messages)}
                          disabled={isLoading}
                          className="px-3 py-1.5 bg-white/10 hover:bg-coral/70 text-white/70 hover:text-white text-xs font-black rounded-xl border border-white/10 transition-all"
                        >
                          {action}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {messages.map((m, i) => (
                  <div 
                    key={i} 
                    className={cn(
                        "flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300",
                        m.role === "user" ? "items-end" : "items-start"
                    )}
                  >
                    <div className={cn(
                        "max-w-[85%] rounded-[20px] p-4 text-sm font-medium leading-relaxed shadow-lg",
                        m.role === "user" 
                            ? "bg-coral text-white rounded-tr-none" 
                            : "bg-white/10 text-white/90 rounded-tl-none border border-white/5"
                    )}>
                        {m.role === "model" ? (
                            <div className="markdown-container">
                                {i === messages.length - 1 && m.role === "model" ? (
                                    <Typewriter text={m.parts[0].text} />
                                ) : (
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {m.parts[0].text}
                                    </ReactMarkdown>
                                )}
                            </div>
                        ) : (
                            m.parts[0].text
                        )}
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                   <div className="flex items-start gap-2 animate-in fade-in duration-300">
                      <div className="bg-white/10 p-4 rounded-[20px] rounded-tl-none border border-white/5 flex gap-1.5 items-center">
                         <div className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce [animation-delay:-0.3s]" />
                         <div className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce [animation-delay:-0.15s]" />
                         <div className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce" />
                      </div>
                   </div>
                )}
              </div>

              {/* Input Area */}
              <div className="p-4 bg-navy shrink-0 border-t border-white/5">
                <form 
                    onSubmit={handleSubmit}
                    className="relative flex items-center bg-white/5 rounded-2xl border border-white/10 focus-within:border-white/20 transition-all shadow-inner"
                >
                    <textarea
                        ref={textareaRef}
                        value={msg}
                        onChange={(e) => setMsg(e.target.value)}
                        onKeyDown={handleKeys}
                        placeholder="Écrivez votre message..."
                        className="w-full flex-1 min-h-[60px] max-h-[140px] bg-transparent text-white p-4 outline-none resize-none text-sm placeholder:text-white/20 scrollbar-none"
                        spellCheck={false}
                    />
                    <button
                        type="submit"
                        disabled={!msg.trim() || isLoading}
                        className={cn(
                            "mr-3 p-3 rounded-xl transition-all duration-300 active:scale-90",
                            msg.trim() ? "bg-coral text-white shadow-lg" : "bg-white/5 text-white/20"
                        )}
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </button>
                </form>
                <div className="mt-3 flex justify-between items-center px-1">
                   <p className="text-[8px] text-white/20 font-black uppercase tracking-widest">
                      Gemini 2.0 Flash — Aberkane Massilia
                   </p>
                   {messages.length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          setMessages([])
                          if (user?.id) clearAiHistory(user.id)
                        }}
                        className="text-[8px] text-coral/60 hover:text-coral font-black uppercase tracking-widest transition-colors"
                      >
                        Effacer l&apos;historique
                      </button>
                   )}
                </div>
              </div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
      
      {/* Markdown Styles */}
      <style jsx global>{`
        .markdown-container h1, .markdown-container h2, .markdown-container h3 {
          font-weight: 800;
          margin: 0.5em 0;
          color: #EF6C77; /* Coral */
        }
        .markdown-container p { margin-bottom: 0.8em; }
        .markdown-container ul { list-style: disc; padding-left: 1.2em; margin-bottom: 0.8em; }
        .markdown-container ol { list-style: decimal; padding-left: 1.2em; margin-bottom: 0.8em; }
        .markdown-container li { margin-bottom: 0.4em; }
        .markdown-container strong { color: #fff; font-weight: 900; }
        .markdown-container hr { border-color: rgba(255,255,255,0.05); margin: 1em 0; }
        .markdown-container code { background: rgba(255,255,255,0.1); padding: 0.1em 0.3em; rounded: 4px; font-family: monospace; font-size: 0.9em; }
      `}</style>
    </div>
  )
}

function KeyHint({ children, className }: { children: string; className?: string }) {
  return (
    <kbd
      className={cx(
        "text-white/50 flex h-4 items-center justify-center rounded-[4px] border border-white/10 px-[4px] font-sans text-[7px] font-black",
        className
      )}
    >
      {children}
    </kbd>
  )
}

export default MorphPanel
