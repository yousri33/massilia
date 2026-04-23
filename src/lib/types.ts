export type ComplianceNeed =
  | 'rgpd_dpo'
  | 'contracts'
  | 'trademark'
  | 'accounting'
  | 'employees'
  | 'none';

export type BusinessType =
  | 'SARL'
  | 'EURL'
  | 'SPA'
  | 'Auto-entrepreneur'
  | 'SNC'
  | 'Autre';

export type BusinessStage = 'idea' | 'early' | 'growing' | 'established';

export type LegalStructure =
  | 'SARL'
  | 'EURL'
  | 'SPA'
  | 'Auto-entrepreneur'
  | 'None'
  | 'Unsure';

export type EmployeesCount = '0' | '1-5' | '6-20' | '20+';

export interface DiagnosticAnswers {
  businessStage: BusinessStage;
  legalStructure: LegalStructure;
  employeesCount: EmployeesCount;
  complianceNeeds: ComplianceNeed[];
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  completedAt: string;
}

export interface MassiliaUser {
  id: string;
  name: string;
  email: string;
  company: string;
  businessType: BusinessType;
  city: string;
  createdAt: string;
  onboardingAnswers?: DiagnosticAnswers;
}

export interface AuthSession {
  user: MassiliaUser;
  loginAt: string;
}

export type FileCategory =
  | 'statuts'
  | 'contrat'
  | 'identite'
  | 'fiscal'
  | 'autre';

export type FileStatus = 'pending' | 'validated' | 'rejected';

export interface StoredFile {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadDate: string;
  status: FileStatus;
  base64?: string;
  category: FileCategory;
}

export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
  timestamp: string;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  priority: 'haute' | 'moyenne' | 'faible';
  serviceLink: string;
  icon: string;
}

export interface SignupPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  company: string;
  businessType: BusinessType;
  city: string;
}
