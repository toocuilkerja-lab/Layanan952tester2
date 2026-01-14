
export type ServiceCategory = 'NPWP' | 'PKP' | 'e-Billing' | 'PBK';

export interface SubService {
  id: string;
  title: string;
  description?: string;
}

export interface MainService {
  id: ServiceCategory;
  title: string;
  icon: string;
  color: string;
  items: SubService[];
}

export type AppTab = 'Beranda' | 'Tutorial' | 'Chat' | 'Profil';

export interface QueueInfo {
  id: string;
  label: string;
  description: string;
  current: string;
  last: string;
  color: string;
}

// Added View enum to fix error: Module '"../types"' has no exported member 'View'
export enum View {
  DASHBOARD = 'DASHBOARD',
  ASSISTANT = 'ASSISTANT',
  SETTINGS = 'SETTINGS',
}

// Added Message interface to fix error: Module '"../types"' has no exported member 'Message'
export interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}
