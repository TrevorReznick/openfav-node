/* @@ types @@ */
export type MessageType = {
    role: string;
    message: string;
}


export type PromptMsg = {
    body: {
        content: string
    }
}


export type OpenAIModel = {
    name: string;
    id: string;
    available: boolean;
}

export interface UserSession {

    id: string
    email: string
    fullName: string  // Mappato da user_metadata.preferred_username
    createdAt: Date  // Convertito da user.created_at
    lastLogin: Date  // Convertito da user.last_sign_in_at
    isAuthenticated: boolean  // Deriva da access_token != null
    provider: "email" | "github"  // Da app_metadata.provider
    tokens: {
        accessToken: string | null
        refreshToken: string | null
        expiresAt: number  // Timestamp in ms
    }
    metadata: {
        provider?: string | null
        avatarUrl?: string  // Da user_metadata.avatar_url
        githubUsername?: string  // Esempio di campo derivato
    }
}

// Tipi per pagine AI
export interface Page {
    id: string;
    title: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    // Altri campi specifici della pagina
    [key: string]: any;
}

export interface PageSessionData {
    pageId: string;
    userId: string;
    page: Page;
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


