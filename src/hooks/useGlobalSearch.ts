import { useMemo } from 'react';
import { unifiedApps, unifiedExtensions, guideCategories } from '../data';

export type SearchResultType = 'app' | 'extension' | 'guide';

export interface SearchResult {
  id: string;
  name: string;
  description: string;
  type: SearchResultType;
  keywords?: string[];
  [key: string]: any;
}

export function useGlobalSearch(query: string): SearchResult[] {
  return useMemo(() => {
    if (!query || query.trim().length === 0) {
      return [];
    }

    const normalizedQuery = query.toLowerCase().trim();
    const results: SearchResult[] = [];

    unifiedApps.forEach((app: any) => {
      const matchesName = app.name?.toLowerCase().includes(normalizedQuery);
      const matchesDescription = app.description?.toLowerCase().includes(normalizedQuery);
      const matchesKeywords = app.keywords?.some((kw: string) =>
        kw.toLowerCase().includes(normalizedQuery)
      );
      const matchesContentTypes = app.contentTypes?.some((ct: string) =>
        ct.toLowerCase().includes(normalizedQuery)
      );

      if (matchesName || matchesDescription || matchesKeywords || matchesContentTypes) {
        results.push({ ...app, type: 'app' as SearchResultType });
      }
    });

    unifiedExtensions.forEach((ext: any) => {
      const matchesName = ext.name?.toLowerCase().includes(normalizedQuery);
      const matchesInfo = ext.info?.toLowerCase().includes(normalizedQuery);
      const matchesKeywords = ext.keywords?.some((kw: string) =>
        kw.toLowerCase().includes(normalizedQuery)
      );
      const matchesTypes = ext.types?.some((type: string) =>
        type.toLowerCase().includes(normalizedQuery)
      );

      if (matchesName || matchesInfo || matchesKeywords || matchesTypes) {
        results.push({
          ...ext,
          type: 'extension' as SearchResultType,
          description: ext.info
        });
      }
    });

    guideCategories.forEach((category: any) => {
      category.guides?.forEach((guide: any) => {
        const matchesTitle = guide.title?.toLowerCase().includes(normalizedQuery);
        const matchesKeywords = guide.keywords?.some((kw: string) =>
          kw.toLowerCase().includes(normalizedQuery)
        );
        const matchesCategoryTitle = category.title?.toLowerCase().includes(normalizedQuery);
        const matchesCategoryDescription = category.description?.toLowerCase().includes(normalizedQuery);

        if (matchesTitle || matchesKeywords || matchesCategoryTitle || matchesCategoryDescription) {
          results.push({
            ...guide,
            type: 'guide' as SearchResultType,
            name: guide.title,
            description: category.description,
            categoryTitle: category.title,
            categoryColor: category.color
          });
        }
      });
    });

    return results;
  }, [query]);
}
