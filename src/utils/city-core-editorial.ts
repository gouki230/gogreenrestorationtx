/** Reviewed hub and main-service copy; routes gate production use through the release manifest. */
export interface CityCoreEditorial {
  keyword: string;
  description: string;
  image: string;
  imageAlt?: string;
  intro: string;
  sections: { title: string; paragraphs: string[] }[];
  checklistTitle: string;
  checklist: string[];
  links: { href: string; label: string }[];
}
const modules = import.meta.glob('../data/city-core-editorial-*.json', { eager: true, import: 'default' });
export const cityCoreEditorial = Object.assign({}, ...Object.values(modules)) as Record<string, CityCoreEditorial>;
