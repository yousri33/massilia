import type { DiagnosticAnswers, MassiliaUser, Recommendation } from './types';

export function computeComplianceScore(answers: DiagnosticAnswers): number {
  let score = 0;

  // Legal structure defined → +25
  if (answers.legalStructure !== 'None' && answers.legalStructure !== 'Unsure') {
    score += 25;
  }

  // Business stage maturity → up to +20
  if (answers.businessStage === 'established') score += 20;
  else if (answers.businessStage === 'growing') score += 12;
  else if (answers.businessStage === 'early') score += 6;

  // Has contracts → +20
  if (answers.complianceNeeds.includes('contracts')) score += 20;

  // Has trademark protection → +10
  if (answers.complianceNeeds.includes('trademark')) score += 10;

  // Has DPO / Loi 18-07 → +15
  if (answers.complianceNeeds.includes('loi_18_07')) score += 15;



  return Math.min(100, score);
}

export function generateRecommendations(
  user: MassiliaUser,
  answers: DiagnosticAnswers,
): Recommendation[] {
  const recs: Recommendation[] = [];

  // Legal structure missing
  if (answers.legalStructure === 'None' || answers.legalStructure === 'Unsure') {
    recs.push({
      id: 'legal-structure',
      title: 'Choisir votre structure juridique',
      description:
        'SARL, EURL, SPA… chaque structure a des implications juridiques et sociales différentes. Notre équipe vous guide vers le meilleur choix pour ' +
        user.company +
        '.',
      priority: 'haute',
      serviceLink: '/creation',
      icon: 'Building2',
    });
  }

  // No contracts
  if (!answers.complianceNeeds.includes('contracts')) {
    recs.push({
      id: 'contracts',
      title: 'Sécuriser vos contrats commerciaux',
      description:
        'Des contrats clairs protègent votre activité face aux litiges clients, fournisseurs et partenaires. Accédez à +200 modèles adaptés au droit algérien.',
      priority: 'haute',
      serviceLink: '/juridique',
      icon: 'FileSignature',
    });
  }

  // No DPO / Loi 18-07
  if (!answers.complianceNeeds.includes('loi_18_07')) {
    recs.push({
      id: 'dpo',
      title: 'Nommer un DPO & conformité Loi 18-07',
      description:
        "La loi 18-07 impose aux entreprises traitant des données personnelles de désigner un DPO. Évitez les sanctions avec notre module de conformité.",
      priority: answers.businessStage === 'established' ? 'haute' : 'moyenne',
      serviceLink: '/espace-client',
      icon: 'ShieldCheck',
    });
  }

  // No trademark
  if (!answers.complianceNeeds.includes('trademark')) {
    recs.push({
      id: 'trademark',
      title: 'Protéger votre marque & propriété intellectuelle',
      description:
        "Déposez votre marque à l'INAPI avant qu'un concurrent ne le fasse. Nous gérons toutes les formalités pour vous.",
      priority: 'moyenne',
      serviceLink: '/juridique',
      icon: 'Award',
    });
  }



  return recs;
}
