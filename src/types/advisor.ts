export type AdvisoryCallType = 'intro' | 'review' | 'planning';

export type Advisor = {
  id: string;
  name: string;
  credentials: string[];
  experienceYrs: number;
  specialisations: string[];
  bio: string;
  sebiRegNo: string;
};

export type AdvisorySlot = {
  id: string;
  isoDateTime: string;
  durationMins: number;
  type: AdvisoryCallType;
};

export type BookingStatus = 'none' | 'confirmed';

export type AdvisoryInsight = {
  id: string;
  title: string;
  body: string;
  date: string;
};
