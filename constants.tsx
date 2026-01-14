
import { MainService } from './types';

export const SERVICES: MainService[] = [
  {
    id: 'NPWP',
    title: 'NPWP',
    icon: 'fa-id-card',
    color: 'bg-blue-600',
    items: [
      { id: 'n1', title: '1. Pendaftaran WP Orang Pribadi' },
      { id: 'n2', title: '2. Pendaftaran WP Badan' },
      { id: 'n3', title: '3. Pendaftaran WP Instansi Pemerintah' },
      { id: 'n4', title: '4. Pendaftaran WP PMSE' },
      { id: 'n5', title: '5. Pendaftaran Objek PBB P5L' },
      { id: 'n6', title: '6. Perubahan Data WP' },
      { id: 'n7', title: '7. Perubahan Status WP' },
      { id: 'n8', title: '8. Penghapusan NPWP' },
    ]
  },
  {
    id: 'PKP',
    title: 'PKP',
    icon: 'fa-building',
    color: 'bg-emerald-600',
    items: [
      { id: 'pk1', title: '1. Permohonan Pengukuhan PKP' },
      { id: 'pk2', title: '2. Pencabutan PKP' },
    ]
  },
  {
    id: 'e-Billing',
    title: 'e-Billing',
    icon: 'fa-file-invoice-dollar',
    color: 'bg-orange-600',
    items: [
      { id: 'eb1', title: 'Pembuatan e-billing' },
    ]
  },
  {
    id: 'PBK',
    title: 'PBK',
    icon: 'fa-exchange-alt',
    color: 'bg-purple-600',
    items: [
      { id: 'pbk1', title: 'Pemindahbukuan' },
    ]
  }
];
