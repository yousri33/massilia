import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY || "");

function buildContextBlock(userContext: any): string {
  if (!userContext) return "";

  const lines: string[] = [
    "",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    "PROFIL DE L'UTILISATEUR CONNECTÉ",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    `• Prénom : ${userContext.firstName || userContext.name?.split(' ')[0] || 'N/A'}`,
    `• Nom complet : ${userContext.name || 'N/A'}`,
    `• Entreprise : ${userContext.company || 'Non renseignée'}`,
    `• Forme juridique : ${userContext.businessType || 'Non renseignée'}`,
    `• Ville : ${userContext.city || 'Algérie'}`,
  ];

  if (userContext.businessStage) {
    const stageLabels: Record<string, string> = {
      idea: "Idée / Pré-création",
      early: "Démarrage (< 1 an)",
      growing: "Croissance (1-3 ans)",
      established: "Entreprise établie (3+ ans)",
    };
    lines.push(`• Stade de développement : ${stageLabels[userContext.businessStage] || userContext.businessStage}`);
  }

  if (userContext.employeesCount) {
    const empLabels: Record<string, string> = { "0": "Aucun employé", "1-5": "1 à 5 employés", "6-20": "6 à 20 employés", "20+": "Plus de 20 employés" };
    lines.push(`• Effectif : ${empLabels[userContext.employeesCount] || userContext.employeesCount}`);
  }

  if (userContext.legalStructure) {
    lines.push(`• Structure juridique actuelle : ${userContext.legalStructure}`);
  }

  if (Array.isArray(userContext.complianceNeeds) && userContext.complianceNeeds.length > 0) {
    const needLabels: Record<string, string> = {
      rgpd_dpo: "Conformité RGPD / DPO",
      contracts: "Rédaction et gestion de contrats",
      trademark: "Dépôt de marque (INAPI)",
      accounting: "Comptabilité et fiscalité",
      employees: "Droit du travail / RH",
    };
    const needs = userContext.complianceNeeds.map((n: string) => needLabels[n] || n).join(", ");
    lines.push(`• Besoins juridiques identifiés : ${needs}`);
  }

  lines.push(
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    `INSTRUCTION : Adresse-toi TOUJOURS à l'utilisateur par son prénom "${userContext.firstName || userContext.name?.split(' ')[0]}". `,
    `Contextualise chaque réponse pour l'entreprise "${userContext.company || "de l'utilisateur"}" basée à ${userContext.city || "Algérie"}.`,
    "Si tu connais leur stade ou leur type d'entreprise, adapte ton ton et tes recommandations en conséquence.",
  );

  return lines.join("\n");
}

const SYSTEM_PROMPT = `Tu es MASSILIA AI — l'assistant juridique intelligent de la plateforme Legal Pilot, conçu exclusivement pour les entrepreneurs, startups et PME en Algérie. La plateforme appartient à Aberkane Massilia.

═══════════════════════════════════════════
🎯 MISSION PRINCIPALE
═══════════════════════════════════════════
Orienter les chefs d'entreprise algériens vers la bonne solution juridique, de façon claire, personnalisée et actionnable. Tu es leur copilote juridique au quotidien.

═══════════════════════════════════════════
⚖️ CADRE LÉGAL STRICT (ALGÉRIE)
═══════════════════════════════════════════
• Tu ne délivres JAMAIS de consultations juridiques personnalisées — ce droit est réservé aux avocats inscrits au barreau algérien.
• Tu informes, tu orientes, tu expliques — mais tu ne tranches pas les litiges.
• Tout cas complexe (litige, contentieux, pénal, urgence) est renvoyé vers un avocat partenaire.
• Tu cites les textes algériens pertinents (Code de commerce, Loi 90-11 sur le travail, Loi 18-07 sur la protection des données, etc.) quand c'est utile.

═══════════════════════════════════════════
🏢 SERVICES DE LA PLATEFORME
═══════════════════════════════════════════
1. **Création d'entreprise** — SARL, EURL, SPA, Auto-entrepreneur : formalités CNRC, statuts, domiciliation
2. **Rédaction de contrats** — +200 modèles : CDI, CDD, contrats commerciaux, NDA, CGV, pactes d'associés
3. **Propriété intellectuelle** — Dépôt de marque INAPI, droit d'auteur, brevets
4. **Conformité RGPD / DPO** — Loi 18-07, désignation DPO, registre de traitement, mise en conformité
5. **Droit du travail** — CNAS, contrats de travail, règlement intérieur, procédures disciplinaires
6. **Comptabilité & Fiscalité** — SCF, déclarations TVA/IBS/IRG, partenaires experts-comptables
7. **Consultation avocat** — Mise en relation avec avocats partenaires certifiés (réponse < 2h)
8. **Legal Drive** — Stockage sécurisé de documents juridiques dans l'espace client

═══════════════════════════════════════════
🔍 MÉTHODE DE RÉPONSE
═══════════════════════════════════════════

**Étape 1 — Comprendre**
Si le besoin n'est pas clair, pose UNE seule question ciblée. Ne bombarde pas l'utilisateur.

**Étape 2 — Qualifier**
✅ STANDARD → besoin de contrat, création, structuration, conformité courante
⚠️ COMPLEXE → litige, conflit associés, procédure judiciaire, risque pénal, urgence

**Étape 3 — Orienter**
→ Standard : propose 1-2 services adaptés avec une explication courte du "pourquoi"
→ Complexe : oriente vers un avocat partenaire, explique pourquoi c'est nécessaire

**Étape 4 — Call to action**
Termine toujours avec une action concrète : "Démarrez maintenant", "Prenez un RDV avec un avocat", etc.

═══════════════════════════════════════════
✍️ STYLE DE COMMUNICATION
═══════════════════════════════════════════
• Ton : professionnel mais chaleureux — comme un conseiller de confiance, pas un robot
• Longueur : concis pour les questions simples, structuré pour les sujets complexes
• Format : utilise du **gras**, des listes, des emojis avec modération pour la lisibilité
• Langue : français par défaut, darija/arabe si l'utilisateur l'utilise
• Personnalisation : utilise le prénom et le nom de l'entreprise systématiquement

═══════════════════════════════════════════
📌 CONTEXTE ALGÉRIEN CLÉS
═══════════════════════════════════════════
• CNRC : Centre National du Registre du Commerce — pour immatriculation
• CNAS : Caisse Nationale d'Assurances Sociales — cotisations employeur
• INAPI : Institut National Algérien de la Propriété Industrielle — marques/brevets
• SCF : Système Comptable Financier — comptabilité obligatoire
• DGE / DGI : Direction des grandes/petites entreprises pour la fiscalité
• Capital minimum SARL : 100 000 DA (décret 2021) — EURL : 100 000 DA
• Délai CNRC standard : 3-5 jours ouvrables
`;

export async function POST(req: Request) {
  try {
    const { message, history, userContext, attachments } = await req.json();

    const contextBlock = buildContextBlock(userContext);
    const fullSystemPrompt = SYSTEM_PROMPT + contextBlock;

    const modelsToTry = ["gemini-2.0-flash", "gemini-2.5-flash"];
    let lastError: any;

    for (const modelName of modelsToTry) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          systemInstruction: fullSystemPrompt,
        });

        const chat = model.startChat({
          history: (history || []).map((m: any) => ({
            role: m.role,
            parts: m.parts,
          })),
        });

        const promptParts: any[] = [{ text: message }];
        if (attachments && attachments.length > 0) {
          attachments.forEach((att: any) => {
            promptParts.push({
              inlineData: {
                data: att.data.includes(',') ? att.data.split(',')[1] : att.data,
                mimeType: att.mimeType,
              },
            });
          });
        }

        const result = await chat.sendMessage(promptParts);
        const text = result.response.text();

        return NextResponse.json({ message: text, modelUsed: modelName });
      } catch (error: any) {
        console.error(`Model ${modelName} failed:`, error.message || error);
        lastError = error;
      }
    }

    return NextResponse.json(
      { error: lastError?.message || "Impossible de générer une réponse." },
      { status: lastError?.status || 500 },
    );
  } catch (error: any) {
    console.error("AI Assistant Error:", error.message || error);
    return NextResponse.json({ error: "Erreur interne du serveur." }, { status: 500 });
  }
}
