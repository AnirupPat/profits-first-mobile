import type { DocSpec } from '@/types/documents';

export const DOCUMENT_CATALOG: DocSpec[] = [
  { id: 'aadhar-front', label: 'Aadhar — front', required: true, accepts: 'image' },
  { id: 'aadhar-back', label: 'Aadhar — back', required: true, accepts: 'image' },
  { id: 'pan-card', label: 'PAN card', required: true, accepts: 'image-or-pdf' },
  {
    id: 'signature',
    label: 'Signature',
    required: true,
    helper: 'Sign on white paper, then snap a clean photo.',
    accepts: 'image',
  },
  {
    id: 'bank-statement-6m',
    label: 'Bank statement',
    required: false,
    helper: 'Last 6 months — PDF or CSV.',
    accepts: 'pdf',
  },
  {
    id: 'salary-slips-3m',
    label: 'Salary slips',
    required: false,
    helper: 'Last 3 months — salaried investors.',
    accepts: 'pdf',
  },
  {
    id: 'itr-2y',
    label: 'ITR (last 2 years)',
    required: false,
    helper: 'For self-employed investors.',
    accepts: 'pdf',
  },
  { id: 'form-16', label: 'Form 16', required: false, accepts: 'pdf' },
  {
    id: 'cas-cdsl-nsdl',
    label: 'CAS (CDSL/NSDL)',
    required: false,
    helper: 'Consolidated Account Statement — auto-imports holdings.',
    accepts: 'pdf',
  },
  {
    id: 'cancelled-cheque',
    label: 'Cancelled cheque',
    required: false,
    helper: 'Speeds up future SIP setup.',
    accepts: 'image',
  },
];

export function isDocRequired(spec: DocSpec): boolean {
  return spec.required;
}
