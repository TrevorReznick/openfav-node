/* @@ Client Compatible Types @@ */
// Tipi compatibili con il client OpenFav per mantenere la struttura complessa

// ============ USER SESSION (CLIENT COMPATIBLE) ============
export interface UserSession {
    id: string | null
    email: string | null
    fullName: string | null
    createdAt: Date | null
    lastLogin: Date | null
    isAuthenticated: boolean
    provider: string | null
    tokens: {
        accessToken: string | null
        refreshToken: string | null
        expiresAt: number
    }
    metadata: {
        provider?: string | null
        avatarUrl?: string | null
        githubUsername?: string | null
    }
    user_metadata?: any | null
    app_metadata?: any | null
}

// ============ DISCOVERY PAGE TYPES (CLIENT COMPATIBLE) ============

export interface PageFeature {
  title: string;
  description: string;
  iconName?: string;
  enabled?: boolean;
}

export interface PageSection {
  title: string;
  description?: string;
  content?: string;
  enabled?: boolean;
  align?: 'left' | 'center' | 'right';
}

export interface PageCta {
  text: string;
  icon?: string;
  enabled?: boolean;
  redirectUrl?: string;
}

export interface PageFooter {
  text?: string;
  enabled?: boolean;
  githubUrl?: string;
}

export type PageSource = 'fs' | 'redis' | 'local' | 'virtual';

export interface PageRecord {
  id: string;              
  path: string;            
  title?: string;
  template: string;        
  policy: string;          
  source: PageSource;
  data: unknown;           
}

export interface DebugInfo {
  normalizedPath: string;
  id: string;
  found: boolean;
  source?: PageSource;
  template?: string;
  policy?: string;
}

export interface PagePolicy {
  visibility: {
    inNavbar: boolean;
    inLists: boolean;
    inSearch: boolean;
    inExplorer?: boolean;
  };
  access: {
    isActive: boolean;
    isPublic: boolean;
    requiresAuth: boolean;
    allowDirectAccess: boolean;
  };
  interaction: {
    isEnabled: boolean;
    allowClick: boolean;
  };
  rendering: {
    showFooter: boolean;
    showHeader: boolean;
    showThemeToggle: boolean;
  };
}

export type PageRole = 'page' | 'component';
export type PageType = 'astro' | 'react';

export interface PageMeta {
  id?: string;
  role?: PageRole;
  type?: PageType;
  category?: string;

  title: string;
  subtitle?: string;
  description?: string;
  icon?: string;

  policyName?: string;
  policy?: Partial<PagePolicy>;
  template?: string;

  isActive?: boolean;
  isVisible?: boolean;
  isEnabled?: boolean;
  isPublic?: boolean;
  protected?: boolean;
  showInNavbar?: boolean;
  showInMenu?: boolean;
  showFooter?: boolean;

  features?: PageFeature[];
  sections?: PageSection[];
  cta?: PageCta;
  footer?: PageFooter;
  props?: Record<string, any>;

  order?: number;
}

export interface Page extends PageMeta {
  id: string;
  url: string | null;
  path: string;
  category: string;
  type: PageType;
  role: PageRole;

  isActive: boolean;
  isVisible: boolean;
  isEnabled: boolean;
  isPublic: boolean;
  protected: boolean;
  showInNavbar: boolean;
  showInMenu: boolean;
  showFooter: boolean;

  disabled?: boolean;
  
  // Campi aggiuntivi per compatibilità
  content?: string;
  createdAt?: Date;
  updatedAt?: Date;
  userId?: string;
}

// ============ AI PAGE SESSION DATA (CLIENT COMPATIBLE) ============
export interface PageSessionData {
    pageId: string;
    userId: string;
    page: Page;  // Ora usa il tipo Page completo del client
    generatedAt: string;
    prompt: string;
    metadata?: {
        model: string;
        attempt: number;
        tokens: any;
        cached: boolean;
        generated_at: string;
    };
    expiresAt?: number;
}

// ============ API RESPONSE TYPES (CLIENT COMPATIBLE) ============
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    id?: string;
    active?: boolean;
}

export interface RedisResponse extends ApiResponse {
    session?: UserSession;
}

export interface PageSessionResponse extends ApiResponse {
    data?: PageSessionData;
}

// ============ LEGACY COMPATIBILITY ============
// Manteniamo i tipi vecchi per backward compatibility
export interface LegacyPage {
    id: string;
    title: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    [key: string]: any;
}

export interface LegacyUserSession {
    id: string
    email: string
    fullName: string  
    createdAt: Date  
    lastLogin: Date  
    isAuthenticated: boolean  
    provider: "email" | "github"  
    tokens: {
        accessToken: string | null
        refreshToken: string | null
        expiresAt: number  
    }
    metadata: {
        provider?: string | null
        avatarUrl?: string  
        githubUsername?: string  
    }
}

// ============ TYPE GUARDS ============
export function isClientCompatiblePage(page: any): page is Page {
    return page && 
           typeof page.id === 'string' &&
           typeof page.title === 'string' &&
           typeof page.path === 'string' &&
           typeof page.category === 'string' &&
           typeof page.type === 'string' &&
           typeof page.role === 'string';
}

export function isClientCompatibleUserSession(session: any): session is UserSession {
    return session &&
           (typeof session.id === 'string' || session.id === null) &&
           (typeof session.email === 'string' || session.email === null) &&
           (typeof session.fullName === 'string' || session.fullName === null) &&
           typeof session.isAuthenticated === 'boolean';
}

// ============ ADAPTERS ============
export class TypeAdapter {
    static toLegacyPage(page: Page): LegacyPage {
        return {
            id: page.id,
            title: page.title,
            content: page.content || '',
            createdAt: page.createdAt || new Date(),
            updatedAt: page.updatedAt || new Date(),
            userId: page.userId || '',
            ...page.props // Mappa proprietà aggiuntive
        };
    }

    static fromLegacyPage(legacyPage: LegacyPage): Page {
        return {
            id: legacyPage.id,
            title: legacyPage.title,
            url: null,
            path: '',
            category: 'ai-generated',
            type: 'react' as PageType,
            role: 'page' as PageRole,
            isActive: true,
            isVisible: true,
            isEnabled: true,
            isPublic: true,
            protected: false,
            showInNavbar: false,
            showInMenu: false,
            showFooter: true,
            createdAt: legacyPage.createdAt,
            updatedAt: legacyPage.updatedAt,
            userId: legacyPage.userId,
            content: legacyPage.content,
            props: {}
        };
    }

    static toLegacyUserSession(session: UserSession): LegacyUserSession | null {
        if (!session.id || !session.email || !session.fullName) {
            return null; // Non può convertire sessioni con campi null
        }

        return {
            id: session.id,
            email: session.email,
            fullName: session.fullName,
            createdAt: session.createdAt || new Date(),
            lastLogin: session.lastLogin || new Date(),
            isAuthenticated: session.isAuthenticated,
            provider: (session.provider as "email" | "github") || "email",
            tokens: session.tokens,
            metadata: {
                provider: session.metadata.provider || undefined,
                avatarUrl: session.metadata.avatarUrl || undefined,
                githubUsername: session.metadata.githubUsername || undefined
            }
        };
    }
}
