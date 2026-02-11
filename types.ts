export enum UserRole {
  GUEST = 'GUEST',
  RESIDENT = 'RESIDENT', // Referral
  ARCHITECT = 'ARCHITECT', // Expert
  MINISTER = 'MINISTER', // Agent
  CHANCELLOR = 'CHANCELLOR' // Dr.White
}

export enum PageView {
  HOME = 'HOME',
  IMMIGRATION = 'IMMIGRATION', // Registration
  MINISTRY_OF_LAW = 'MINISTRY_OF_LAW', // Contracts
  CONSTITUTION = 'CONSTITUTION', // FAQ/Consultation (Formerly Library)
  PROFILE = 'PROFILE' // Contains Dossier, Treasury, and HQ
}

export type Language = 'ru' | 'olbanian';
export type Theme = 'light' | 'dark';

export interface ContractType {
  id: string;
  label: string;
  description: string;
  formUrl: string;
  viewUrl: string; // New field for viewing the contract
  icon: string;
  requiredDocs: string[];
}

export interface CitizenStats {
  promoCode: string;
  totalClients: number;
  totalEarnings: number;
  nextPayoutDate: string;
  status: 'Active' | 'Pending' | 'Green-Card Holder';
}

export interface Transaction {
  id: number;
  clientName: string;
  date: string;
  amount: number;
  payout: number;
  status: 'Paid' | 'Processing';
}

export interface CityNode {
  id: string;
  name: string;
  top: string;
  left: string;
  logo?: string;
  description?: string;
  link?: string;
  linkText?: string;
}

export interface InlineButton {
  text: string;
  type: 'url' | 'callback' | 'webapp';
  value: string;
}