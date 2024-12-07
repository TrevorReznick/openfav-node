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


