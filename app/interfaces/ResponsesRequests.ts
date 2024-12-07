import {MessageType} from '../types/types'
import Response from 'express'

/* @@ request interfaces @@ */

export interface RequestById {
    params: {
        id: number
    }
}

export interface RequestMail {    
    body: {
        email: string,        
        subject: string,        
        text: string,
        name: string
    }
}

export interface RequestPrompt {
    body: MessageType
}

export interface Response {
    send: (body: any) => void
    status: (code: number) => Response
}

export interface RequestEvent<
	Params extends Partial<
        Record<string, string>> = Partial<Record<string, string>>,
        RouteId extends string | null = string | null
    > {}

