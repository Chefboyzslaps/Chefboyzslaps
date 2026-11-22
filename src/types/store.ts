export type LicenseId = "basic" | "premium" | "trackout" | "exclusive";

export interface LicenseOption {
  id: LicenseId;
  name: string;
  price: number | null;
  summary: string;
  includes: string[];
  available: boolean;
}

export interface Beat {
  id: string;
  slug: string;
  title: string;
  description: string;
  bpm: number;
  key: string;
  genre: string;
  moods: string[];
  tags: string[];
  artwork: string;
  previewAudio?: string;
  featured: boolean;
  published: boolean;
  collectionIds: string[];
  createdAt: string;
  licenses: LicenseOption[];
}

export interface BeatCollection {
  id: string;
  slug: string;
  title: string;
  description: string;
  artwork: string;
  beatIds: string[];
}

export interface CartItem {
  beatId: string;
  licenseId: LicenseId;
}
