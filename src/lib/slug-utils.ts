import { 
  getServiceBySlug, 
  getOfferBySlug, 
  getProjectBySlug, 
  getBlogBySlug 
} from "@/actions";

export type ContentType = 'service' | 'offer' | 'project' | 'blog';

export interface SlugMappingResult {
  targetSlug: string | null;
  contentType: ContentType;
  isHierarchical?: boolean;
  parentSlug?: string;
}

/**
 * Maps a slug from one language to another for the same content
 */
export async function getSlugInTargetLanguage(
  currentSlug: string,
  currentLanguage: string,
  targetLanguage: string,
  contentType: ContentType,
  parentSlug?: string
): Promise<SlugMappingResult> {
  const currentLang = currentLanguage as "hr" | "en";
  const targetLang = targetLanguage as "hr" | "en";
  try {
    let content;
    
    switch (contentType) {
      case 'service':
        content = await getServiceBySlug(currentSlug, currentLang);
        break;
      case 'offer':
        content = await getOfferBySlug(currentSlug, currentLang);
        break;
      case 'project':
        content = await getProjectBySlug(currentSlug, currentLang);
        break;
      case 'blog':
        content = await getBlogBySlug(currentSlug, currentLang);
        break;
      default:
        return { targetSlug: null, contentType };
    }

    if (!content) {
      return { targetSlug: null, contentType };
    }

    // Find the translation for the target language
    const targetTranslation = content.translations.find(
      (translation: { languageCode: string; slug: string }) => translation.languageCode === targetLang
    );

    if (!targetTranslation) {
      return { targetSlug: null, contentType };
    }

    const result: SlugMappingResult = {
      targetSlug: targetTranslation.slug,
      contentType
    };

    // For hierarchical services, we need to get the parent slug too
    if (contentType === 'service' && 'parentServiceId' in content && content.parentServiceId && parentSlug) {
      const parentContent = await getServiceBySlug(parentSlug, currentLang);
      if (parentContent) {
        const parentTargetTranslation = parentContent.translations.find(
          (translation: { languageCode: string; slug: string }) => translation.languageCode === targetLang
        );
        if (parentTargetTranslation) {
          result.isHierarchical = true;
          result.parentSlug = parentTargetTranslation.slug;
        }
      }
    }

    return result;
  } catch (error) {
    console.error(`Error mapping slug from ${currentLanguage} to ${targetLanguage}:`, error);
    return { targetSlug: null, contentType };
  }
}

/**
 * Detects content type and extracts slugs from a pathname
 */
export function parsePathname(pathname: string): {
  contentType: ContentType | null;
  slugs: string[];
  isStatic: boolean;
} {
  // Remove leading slash and split
  const segments = pathname.replace(/^\//, '').split('/');
  
  // Check if first segment is 'en' (English locale prefix)
  // Croatian has no prefix, so we check if it starts with 'en'
  const hasLocalePrefix = segments[0] === 'en';
  const pathSegments = hasLocalePrefix ? segments.slice(1) : segments;
  
  if (pathSegments.length === 0) {
    return { contentType: null, slugs: [], isStatic: true };
  }

  const firstSegment = pathSegments[0];
  
  // Map localized paths to content types
  const pathMappings: Record<string, ContentType> = {
    'services': 'service',
    'usluge': 'service',
    'offers': 'offer',
    'ponude': 'offer',
    'projects': 'project',
    'projekti': 'project',
    'blog': 'blog'
  };

  const contentType = pathMappings[firstSegment];
  
  if (!contentType) {
    // Static page (contact, about, etc.)
    return { contentType: null, slugs: [], isStatic: true };
  }

  // Extract slugs (everything after the content type segment)
  const slugs = pathSegments.slice(1);
  
  return { 
    contentType, 
    slugs, 
    isStatic: false 
  };
}

/**
 * Builds the target URL for a given content type and slugs
 */
export function buildTargetUrl(
  contentType: ContentType,
  targetLanguage: string,
  slugs: string[]
): string {
  const pathMappings: Record<ContentType, Record<string, string>> = {
    service: {
      'en': 'services',
      'hr': 'usluge'
    },
    offer: {
      'en': 'offers',
      'hr': 'ponude'
    },
    project: {
      'en': 'projects',
      'hr': 'projekti'
    },
    blog: {
      'en': 'blog',
      'hr': 'blog'
    }
  };

  const basePath = pathMappings[contentType][targetLanguage];
  if (!basePath) {
    return '/';
  }

  return `/${basePath}${slugs.length > 0 ? '/' + slugs.join('/') : ''}`;
}