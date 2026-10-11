import type { ImageMetadata } from 'astro';
import credits from '../data/photo-credits.json';

/** Every photo in src/assets/photos, by file name (lowercase). */
const files = import.meta.glob<{ default: ImageMetadata }>('../assets/photos/*.{jpg,jpeg,png,webp,avif}', { eager: true });
const byName = new Map(Object.entries(files).map(([path, mod]) => [path.split('/').pop()!.toLowerCase(), mod.default]));

export function findPhoto(name?: string | null): ImageMetadata | undefined {
  return name ? byName.get(name.toLowerCase()) : undefined;
}

export type PhotoCredit = { alt: string; title: string; author: string; license: string; licenseUrl: string; source: string };
const creditMap = (credits as { photos: Record<string, PhotoCredit> }).photos;

/** Credit info for a Wikimedia Commons photo (undefined for your own photos). */
export function photoCredit(name?: string | null): PhotoCredit | undefined {
  return name ? creditMap[name] : undefined;
}

/** Credits for each individually credited photo in use (Wikimedia Commons), for the About page. */
export function allCredits() {
  const seen = new Set<string>();
  return Object.entries(creditMap)
    .filter(([file, c]) => byName.has(file.toLowerCase()) && c.license !== 'Pexels License' && !seen.has(c.source) && seen.add(c.source))
    .map(([file, c]) => ({ file, ...c }));
}

/** One-line note covering the Pexels scene photos (attribution isn't required, but we list them). */
export function pexelsNote(): string | undefined {
  const used = Object.entries(creditMap).some(([file, c]) => byName.has(file.toLowerCase()) && c.license === 'Pexels License');
  return used ? (credits as { _pexels?: string })._pexels : undefined;
}
