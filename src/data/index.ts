// ----- Common Types -----
export type ContentType = 'Manga' | 'Anime' | 'Light Novel';
export type Platform = 'Android' | 'iOS' | 'Windows' | 'Mac' | 'Linux' | 'Web';
export type CommunityPlatform = 'Discord' | 'GitHub' | 'Reddit' | 'Telegram' | 'Matrix';
export type WebsiteCategory = 'Manga' | 'Anime' | 'Light Novel' | 'Tracker' | 'Community';
export type GuideIcon = 'download' | 'settings' | 'book' | 'help';
export type FAQCategory = 'installation' | 'configuration' | 'extensions' | 'troubleshooting' | 'general';

// ----- Apps -----
export interface AppTutorial {
  title: string;
  type: 'video' | 'guide';
  url: string;
  description?: string;
}

export interface AppData {
  id: string;
  name: string;
  status?: string;
  description: string;
  contentTypes: readonly ContentType[];
  platforms: readonly Platform[];
  iconColor: string;
  logoUrl?: string;
  author?: string;
  keywords?: readonly string[];
  supportedExtensions: readonly string[]; // Extension IDs
  lastUpdated?: string; // ISO date string
  githubUrl?: string; // GitHub repository URL - owner/repo will be extracted when needed
  officialSite?: string;
  discordUrl?: string;
  tutorials?: readonly AppTutorial[];
}

// ----- Extensions -----
export interface ExtensionData {
  id: string;
  name: string;
  info?: string;
  logoUrl?: string;
  types: readonly ContentType[];
  region: string;
  accentColor: string;
  autoUrl: string;
  manualUrl: string;
  supportedApps: readonly string[]; // App IDs
  lastUpdated?: string;
  overview?: string;
  github?: string;
  website?: string;
  keywords?: readonly string[];
}

// ----- Communities -----
export interface CommunityData {
  id: string;
  name: string;
  description: string;
  members: string;
  link: string;
  color: string;
  platform: CommunityPlatform;
  keywords?: readonly string[];
  relatedAppIds?: readonly string[]; // Related app IDs
}

// ----- FAQs -----
export interface FAQData {
  id: string;
  question: string;
  answer: string;
  keywords?: readonly string[];
  category: FAQCategory;
  relatedAppIds?: readonly string[]; // Related app IDs
}

// ----- Guides -----
export interface GuideTopicData {
  id: string;
  title: string;
  slug: string;
  summary?: string;
  keywords?: readonly string[];
  relatedAppIds?: readonly string[]; // Related app IDs
  relatedExtensionIds?: readonly string[]; // Related extension IDs
}

export interface GuideCategoryData {
  id: string;
  title: string;
  description: string;
  color: string;
  icon: GuideIcon;
  guides: readonly GuideTopicData[];
}

// ----- Websites -----
export interface WebsiteData {
  id: string;
  name: string;
  url: string;
  description: string;
  category: WebsiteCategory;
  color: string;
  keywords?: readonly string[];
}

// ===========================================
// DATA IMPORTS
// ===========================================

import appsJson from './apps.json';
import extensionsJson from './extensions.json';
import faqsJson from './faqs.json';
import guidesJson from './guides.json';

// ----- Typed Data Exports -----
export const unifiedApps: AppData[] = appsJson as AppData[];
export const unifiedExtensions: ExtensionData[] = extensionsJson as ExtensionData[];
export const faqs: FAQData[] = faqsJson as FAQData[];
export const guideCategories: GuideCategoryData[] = guidesJson as GuideCategoryData[];

// ===========================================
// HELPER FUNCTIONS
// ===========================================

// ----- Apps -----
export function getAppById(appId: string): AppData | undefined {
  return unifiedApps.find(app => app.id === appId);
}

export function getAppsByPlatform(platform: Platform): AppData[] {
  return unifiedApps.filter(app => app.platforms.includes(platform));
}

export function getAppsByContentType(contentType: ContentType): AppData[] {
  return unifiedApps.filter(app => app.contentTypes.includes(contentType));
}

// ----- Extensions -----
export function getExtensionById(extensionId: string): ExtensionData | undefined {
  return unifiedExtensions.find(ext => ext.id === extensionId);
}

export function getAppExtensions(appId: string): ExtensionData[] {
  return unifiedExtensions.filter(ext => ext.supportedApps.includes(appId));
}

export function getExtensionApps(extensionId: string): AppData[] {
  const extension = unifiedExtensions.find(ext => ext.id === extensionId);
  if (!extension) return [];
  return unifiedApps.filter(app => extension.supportedApps.includes(app.id));
}

// ----- FAQs -----
export function getFAQById(faqId: string): FAQData | undefined {
  return faqs.find(f => f.id === faqId);
}

export function getFAQsByCategory(category: FAQCategory): FAQData[] {
  return faqs.filter(f => f.category === category);
}

export function getFAQsByApp(appId: string): FAQData[] {
  return faqs.filter(f => f.relatedAppIds?.includes(appId));
}

// ----- Guides -----
export function getGuideCategoryById(categoryId: string): GuideCategoryData | undefined {
  return guideCategories.find(gc => gc.id === categoryId);
}

export function getGuidesByApp(appId: string): GuideTopicData[] {
  const allGuides: GuideTopicData[] = [];
  guideCategories.forEach(category => {
    const relatedGuides = category.guides.filter(g => g.relatedAppIds?.includes(appId));
    allGuides.push(...relatedGuides);
  });
  return allGuides;
}

export function getGuidesByExtension(extensionId: string): GuideTopicData[] {
  const allGuides: GuideTopicData[] = [];
  guideCategories.forEach(category => {
    const relatedGuides = category.guides.filter(g => g.relatedExtensionIds?.includes(extensionId));
    allGuides.push(...relatedGuides);
  });
  return allGuides;
}

// ===========================================
// SEARCH HELPERS
// ===========================================

export function searchAll(query: string): {
  apps: AppData[];
  extensions: ExtensionData[];
  faqs: FAQData[];
  guides: GuideTopicData[];
} {
  const lowerQuery = query.toLowerCase();
  
  return {
    apps: unifiedApps.filter(app => 
      app.name.toLowerCase().includes(lowerQuery) ||
      app.description.toLowerCase().includes(lowerQuery) ||
      app.keywords?.some(k => k.toLowerCase().includes(lowerQuery))
    ),
    extensions: unifiedExtensions.filter(ext =>
      ext.name.toLowerCase().includes(lowerQuery) ||
      ext.info?.toLowerCase().includes(lowerQuery) ||
      ext.keywords?.some(k => k.toLowerCase().includes(lowerQuery))
    ),
    faqs: faqs.filter(f =>
      f.question.toLowerCase().includes(lowerQuery) ||
      f.answer.toLowerCase().includes(lowerQuery) ||
      f.keywords?.some(k => k.toLowerCase().includes(lowerQuery))
    ),
    guides: guideCategories.flatMap(gc => gc.guides).filter(g =>
      g.title.toLowerCase().includes(lowerQuery) ||
      g.keywords?.some(k => k.toLowerCase().includes(lowerQuery))
    )
  };
}
