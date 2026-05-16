export type DocStatus = 'not-uploaded' | 'uploaded' | 'verified';

export type DocAccepts = 'image' | 'pdf' | 'image-or-pdf';

export interface DocSpec {
  id: string;
  label: string;
  required: boolean;
  helper?: string;
  accepts: DocAccepts;
}

export interface SubmittedDoc {
  specId: string;
  status: DocStatus;
  fileName?: string;
  uploadedAt?: string;
}
