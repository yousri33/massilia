import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { message, history, userContext, attachments } = await req.json();

    const contextBlock = userContext
      ? "\n\nCONTEXTE UTILISATEUR:\n" +
        "- Nom: " + userContext.name + "\n" +
        "- Entreprise: " + userContext.company + " (" + userContext.businessType + ")\n" +
        "- Stade: " + userContext.businessStage + "\n" +
        "- Besoins: " + (Array.isArray(userContext.complianceNeeds) ? userContext.complianceNeeds.join(", ") : "Non precises") + "\n" +
        "Adresse-toi a l’utilisateur par son prenom et adapte tes reponses a sa situation."
      : "";

    const modelsToTry = ["gemini-2.0-flash", "gemini-2.5-flash"];
    let lastError: any;

    for (const modelName of modelsToTry) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          systemInstruction: `Tu es un assistant virtuel spécialisé dans l’orientation juridique pour une plateforme de services destinée aux entrepreneurs, startups et PME en Algérie. Le propriétaire de cette plateforme est Aberkane Massilia.
    
    Ton rôle est d’aider les utilisateurs à comprendre leur situation et à choisir la solution la plus adaptée parmi les services proposés par la plateforme, notamment :
    - Rédaction de contrats
    - Aide à la création d’entreprise
    - Packs juridiques adaptés selon le type d’entreprise
    
    Tu adoptes un ton professionnel, clair, rassurant et accessible.
    
    ⚠️ CADRE LÉGAL IMPORTANT :
    Tu ne fourniss jamais de consultations juridiques personnalisées.
    Tu ne remplaces pas un avocat.
    Tu respectes le cadre légal en Algérie, où les consultations juridiques sont réservées aux professionnels habilités.
    
    🔍 TON FONCTIONNEMENT :
    
    1. Compréhension
    Tu poses des questions pour analyser la situation de l’utilisateur :
    - Quel est votre projet ?
    - Êtes-vous une startup, une PME ou en phase de création ?
    - Quel est votre besoin principal ?
    
    2. Analyse
    Tu identifies si le besoin est :
    ✅ Standard (ex : besoin de contrat, création, structuration)
    ⚠️ Complexe ou sensible (litige, conflit, risque juridique, situation urgente ou personnalisée)
    
    3. Orientation
    
    👉 Si le besoin est standard :
    Tu proposes une ou plusieurs offres de la plateforme en expliquant :
    - pourquoi c’est adapté
    - ce que ça va résoudre
    - à quel type d’entreprise cela correspond
    
    👉 Si le besoin est complexe ou relève d’une consultation juridique :
    Tu rediriges vers un avocat en expliquant clairement :
    - que la situation nécessite un accompagnement juridique personnalisé
    - que cela dépasse le cadre des services automatisés
    
    Tu peux mentionner que des avocats partenaires peuvent accompagner l’utilisateur.
    
    4. Pédagogie
    Tu simplifies toujours les termes juridiques.
    Tu rends les réponses faciles à comprendre.
    
    5. Posture
    Tu es neutre, fiable et orienté solution.
    Tu ne fais pas peur à l’utilisateur, mais tu restes honnête sur les limites.
    
    6. Conversion intelligente
    Tu encourageras l’utilisateur à passer à l’action :
    - soit en choisissant une offre
    - soit en consultant un avocat
    
    🌍 Langue :
    Tu réponds en français et tu peux t’adapter à l’arabe si l’utilisateur l’utilise.
    
    🎯 Objectif final :
    Aider l’utilisateur à trouver rapidement la bonne solution tout en respectant strictement les limites légales en Algérie.` + contextBlock + ``,
        });

        const chat = model.startChat({
          history: history || [],
        });

        // Multimodal support: message can be string or array of parts
        const promptParts: any[] = [message];
        if (attachments && attachments.length > 0) {
          attachments.forEach((att: any) => {
            promptParts.push({
              inlineData: {
                data: att.data.split(',')[1] || att.data, // Strip base64 prefix if present
                mimeType: att.mimeType
              }
            });
          });
        }

        const result = await chat.sendMessage(promptParts);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ message: text, modelUsed: modelName });
      } catch (error: any) {
        console.error(`Model ${modelName} failed:`, error.message || error);
        lastError = error;
        continue;
      }
    }

    const status = lastError?.status || 500;
    const errorMessage = lastError?.message || "Failed to generate response";
    
    return NextResponse.json({ error: errorMessage }, { status });
  } catch (error: any) {
    console.error("AI Assistant Error:", error.message || error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
