import { Request, Response } from 'express'
import { UserSession, PageSessionData, ApiResponse, PageSessionResponse, TypeAdapter } from '../types/types'
import { getRedisValue, setRedisValue, deleteRedisValue, redisConnect, disconnectRedis } from '../services/upstash_redis'

const SESSION_PREFIX = 'user_session_';
const AI_PAGES_PREFIX = 'ai_generated_pages:';
const SESSION_EXPIRY = 86400; // 24 ore in secondi

export class RedisController {

    static home = async (req: Request, res: Response) => {
        try {
            await redisConnect()
            await setRedisValue('foo', 'bar')
            const result = await getRedisValue('foo')
            res.send(`Welcome to Openfav! Redis value: ${result}`)
            // Nota: qui c'era una seconda chiamata a redisConnect() che probabilmente era un errore
            // Ho sostituito con disconnectRedis() che è più logico in questo contesto
            await disconnectRedis()
        } catch (error) {
            console.error('Error in RedisController:', error)
            res.status(500).send('Internal Server Error')
        }
    }

    /**
     * Recupera una sessione utente da Redis
     * @param userId ID dell'utente
     * @returns La sessione utente o null se non trovata
    */

    static getUserSession = async (req: Request, res: Response) => {
        try {
            // Estrai l'ID utente dai parametri della richiesta
            const { userId } = req.params;

            // Log per debug
            console.log('Request URL:', req.url);
            console.log('Extracted userId:', userId);

            // Verifica che l'ID utente sia presente e valido
            if (!userId || typeof userId !== 'string') {
                console.error('Invalid or missing User ID:', userId);
                return res.status(400).send({ message: 'Invalid or missing User ID' });
            }

            // Connetti a Redis - rimuovi la verifica errata
            await redisConnect();

            // Costruisci la chiave per la sessione utente
            const key = `${SESSION_PREFIX}${userId}`;
            console.log(`Attempting to retrieve session with key: ${key}`);

            // Recupera i dati della sessione da Redis
            const sessionData = await getRedisValue(key);

            // Log per ispezionare i dati grezzi
            console.log('Raw session data from Redis:', sessionData);

            // Se non ci sono dati, restituisci un errore 404
            if (!sessionData) {
                return res.status(404).send({ message: 'User session not found' });
            }

            // Gestisci sia stringhe che oggetti
            let session: UserSession;
            if (typeof sessionData === 'string') {
                try {
                    session = JSON.parse(sessionData) as UserSession;
                } catch (parseError) {
                    if (parseError instanceof Error) {
                        console.error('Error parsing session data:', parseError.message);
                    } else {
                        console.error('Error parsing session data:', parseError);
                    }
                    const errorMessage = parseError instanceof Error ? parseError.message : 'Unknown error';
                    return res.status(500).send({ message: `Invalid session data format: ${errorMessage}` });
                }
            } else if (typeof sessionData === 'object') {
                session = sessionData as UserSession;
            } else {
                console.error('Session data is neither a string nor an object:', sessionData);
                return res.status(500).send({ message: 'Invalid session data format' });
            }

            // Restituisci la sessione con codice 200
            console.log('Parsed session data:', session);
            return res.status(200).send(session);

        } catch (error) {
            // Gestisci eventuali errori generici
            if (error instanceof Error) {
                console.error('Error retrieving user session:', error.message);
            } else {
                console.error('Error retrieving user session:', error);
            }
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            return res.status(500).send({ message: `Failed to retrieve user session: ${errorMessage}` });

        } finally {
            // Assicurati di disconnettere da Redis
            await disconnectRedis();
        }
    };


    /**
     * Salva una sessione utente in Redis
     * Ora supporta sia tipi legacy che client-compatible
     */
    static saveUserSession = async (req: Request, res: Response, next: Function): Promise<Response | undefined> => {
        try {
            const { session, expirySeconds } = req.body;

            // Verifica che session sia presente e valido
            if (!session || !session.id) {
                return res.status(400).json({ 
                    success: false, 
                    error: 'Invalid session data - session.id is required' 
                } as ApiResponse);
            }

            await redisConnect();
            const key = `${SESSION_PREFIX}${session.id}`;
            
            // Converti la sessione in formato JSON compatibile
            const sessionData = JSON.stringify(session);

            // Utilizziamo il metodo esistente setRedisValue
            await setRedisValue(key, sessionData, expirySeconds || SESSION_EXPIRY);

            console.log(`User session saved with key: ${key} and expiry: ${expirySeconds || SESSION_EXPIRY} seconds`);
            await disconnectRedis();

            return res.status(200).json({ 
                success: true, 
                id: session.id,
                active: true,
                message: 'Session saved successfully'
            } as ApiResponse);

        } catch (error) {
            console.error('Error saving user session:', error);
            return next(error);
        }
    };

    /**
     * Test method - Salva un key-value in Redis (per pagine AI)
     * @param key Chiave da salvare
     * @param value Valore da salvare
     * @returns Promise<boolean> true se salvato con successo
     */
    static testSet = async (req: Request, res: Response): Promise<void> => {
        try {
            const { key, value } = req.body;

            // Verifica che key e value siano presenti
            if (!key || !value) {
                res.status(400).send({ 
                    success: false, 
                    error: 'Key and value are required' 
                });
                return;
            }

            await redisConnect();
            
            // Salva il valore in Redis
            await setRedisValue(key, value);
            
            console.log(`Test key-value saved: ${key}`);
            await disconnectRedis();

            res.status(200).send({ 
                success: true, 
                id: key,
                active: true 
            });
        } catch (error) {
            console.error('Error in testSet:', error);
            res.status(500).send({ 
                success: false, 
                error: 'Failed to save key-value' 
            });
        }
    };

    /**
     * Test method - Recupera un valore da Redis (per pagine AI)
     * @param key Chiave da recuperare
     * @returns Promise<string | null> valore recuperato o null se non trovato
     */
    static testGet = async (req: Request, res: Response): Promise<void> => {
        try {
            const { key } = req.query;

            // Verifica che key sia presente
            if (!key || typeof key !== 'string') {
                res.status(400).send({ 
                    success: false, 
                    error: 'Key is required' 
                });
                return;
            }

            await redisConnect();
            
            // Recupera il valore da Redis
            const value = await getRedisValue(key);
            
            console.log(`Test key-value retrieved: ${key}`);
            await disconnectRedis();

            if (value) {
                res.status(200).send({ 
                    value: value 
                });
            } else {
                res.status(404).send({ 
                    success: false, 
                    error: 'Key not found' 
                });
            }
        } catch (error) {
            console.error('Error in testGet:', error);
            res.status(500).send({ 
                success: false, 
                error: 'Failed to retrieve value' 
            });
        }
    };

    /**
     * Test method - Elimina un key-value da Redis (per pagine AI)
     * @param key Chiave da eliminare
     * @returns Promise<boolean> true se eliminato con successo
     */
    static testDelete = async (req: Request, res: Response): Promise<void> => {
        try {
            const { key } = req.query;

            // Verifica che key sia presente
            if (!key || typeof key !== 'string') {
                res.status(400).send({ 
                    success: false, 
                    error: 'Key is required' 
                });
                return;
            }

            await redisConnect();
            
            // Recupera prima il valore per confermare l'esistenza
            const currentValue = await getRedisValue(key);
            
            if (!currentValue) {
                await disconnectRedis();
                res.status(404).send({ 
                    success: false, 
                    error: 'Key not found' 
                });
                return;
            }
            
            await deleteRedisValue(key);
            
            console.log(`Test key-value deleted: ${key}`);
            await disconnectRedis();

            res.status(200).send({ 
                success: true, 
                id: key,
                active: true 
            });
        } catch (error) {
            console.error('Error in testDelete:', error);
            res.status(500).send({ 
                success: false, 
                error: 'Failed to delete key-value' 
            });
        }
    };

    /**
     * Salva una pagina AI generata in Redis
     * Ora supporta pagine complesse del client
     */
    static saveAIGeneratedPage = async (req: Request, res: Response): Promise<void> => {
        try {
            const { userId, pageData } = req.body;

            // Verifica che userId e pageData siano presenti
            if (!userId || !pageData) {
                res.status(400).json({ 
                    success: false, 
                    error: 'userId and pageData are required' 
                } as ApiResponse);
                return;
            }

            // Verifica che pageData contenga i campi necessari
            if (!pageData.pageId || !pageData.page || !pageData.prompt) {
                res.status(400).json({ 
                    success: false, 
                    error: 'pageData must contain pageId, page, and prompt' 
                } as ApiResponse);
                return;
            }

            await redisConnect();
            
            // Costruisci la chiave per la pagina AI
            const key = `${AI_PAGES_PREFIX}${userId}:${pageData.pageId}`;
            
            // Prepara i dati completi della pagina - supporta tipi client
            const completePageData: PageSessionData = {
                pageId: pageData.pageId,
                userId: userId,
                page: pageData.page, // Ora accetta pagine complesse del client
                generatedAt: new Date().toISOString(),
                prompt: pageData.prompt,
                metadata: pageData.metadata || {
                    model: 'gpt-4',
                    attempt: 1,
                    tokens: { prompt: 0, completion: 0, total: 0 },
                    cached: false,
                    generated_at: new Date().toISOString()
                },
                expiresAt: Date.now() + (SESSION_EXPIRY * 1000)
            };
            
            // Salva i dati in Redis
            await setRedisValue(key, JSON.stringify(completePageData), SESSION_EXPIRY);
            
            // Aggiorna l'indice delle pagine dell'utente
            const indexKey = `${AI_PAGES_PREFIX}${userId}`;
            const existingIndex = await getRedisValue(indexKey);
            
            let pageIds: string[] = [];
            if (existingIndex) {
                try {
                    // Prova JSON.parse diretto
                    pageIds = JSON.parse(existingIndex as string);
                    if (!Array.isArray(pageIds)) {
                        // Se non è array, potrebbe essere una stringa singola o array con virgolette
                        const cleaned = (existingIndex as string).replace(/['\[\]]/g, '').trim();
                        if (cleaned.includes(',')) {
                            pageIds = cleaned.split(',').map((id: string) => id.trim());
                        } else if (cleaned) {
                            pageIds = [cleaned];
                        } else {
                            pageIds = [];
                        }
                    }
                } catch (e) {
                    console.warn('Failed to parse existing index:', existingIndex);
                    pageIds = [];
                }
            }
            
            // Aggiungi il nuovo pageId se non esiste già
            if (!pageIds.includes(pageData.pageId)) {
                pageIds.push(pageData.pageId);
            }
            
            // Salva l'indice aggiornato
            await setRedisValue(indexKey, JSON.stringify(pageIds));
            console.log(`Updated pages index for user ${userId} with ${pageIds.length} pages`);
            
            console.log(`AI page saved with key: ${key}`);
            await disconnectRedis();

            res.status(200).json({ 
                success: true, 
                id: key,
                active: true,
                data: completePageData
            } as PageSessionResponse);

        } catch (error) {
            console.error('Error in saveAIGeneratedPage:', error);
            res.status(500).json({ 
                success: false, 
                error: 'Failed to save AI generated page' 
            } as ApiResponse);
        }
    };

    /**
     * Recupera una pagina AI generata da Redis
     * Ora supporta pagine complesse del client
     */
    static getAIGeneratedPage = async (req: Request, res: Response): Promise<void> => {
        try {
            const { userId, pageId } = req.query;

            // Verifica che userId e pageId siano presenti
            if (!userId || !pageId || typeof userId !== 'string' || typeof pageId !== 'string') {
                res.status(400).json({ 
                    success: false, 
                    error: 'userId and pageId are required as query parameters' 
                } as ApiResponse);
                return;
            }

            await redisConnect();
            
            // Costruisci la chiave per la pagina AI
            const key = `${AI_PAGES_PREFIX}${userId}:${pageId}`;
            
            // Recupera i dati da Redis
            const value = await getRedisValue(key);
            
            console.log(`AI page retrieved: ${key}`);
            await disconnectRedis();

            if (value && typeof value === 'string') {
                try {
                    const pageData = JSON.parse(value) as PageSessionData;
                    res.status(200).json({ 
                        success: true,
                        data: pageData
                    } as PageSessionResponse);
                } catch (parseError) {
                    res.status(500).json({ 
                        success: false, 
                        error: 'Invalid page data format' 
                    } as ApiResponse);
                }
            } else if (value) {
                try {
                    const pageData = value as PageSessionData;
                    res.status(200).json({ 
                        success: true,
                        data: pageData
                    } as PageSessionResponse);
                } catch (parseError) {
                    res.status(500).json({ 
                        success: false, 
                        error: 'Invalid page data format' 
                    } as ApiResponse);
                }
            } else {
                res.status(404).json({ 
                    success: false, 
                    error: 'AI generated page not found' 
                } as ApiResponse);
            }

        } catch (error) {
            console.error('Error in getAIGeneratedPage:', error);
            res.status(500).json({ 
                success: false, 
                error: 'Failed to retrieve AI generated page' 
            } as ApiResponse);
        }
    };

    /**
     * Elimina una pagina AI generata da Redis
     * @param userId ID dell'utente
     * @param pageId ID della pagina
     */
    static deleteAIGeneratedPage = async (req: Request, res: Response): Promise<void> => {
        try {
            const { userId, pageId } = req.query;

            // Verifica che userId e pageId siano presenti
            if (!userId || !pageId || typeof userId !== 'string' || typeof pageId !== 'string') {
                res.status(400).send({ 
                    success: false, 
                    error: 'userId and pageId are required as query parameters' 
                });
                return;
            }

            await redisConnect();
            
            // Costruisci la chiave per la pagina AI
            const key = `${AI_PAGES_PREFIX}${userId}:${pageId}`;
            
            // Verifica che la pagina esista
            const currentValue = await getRedisValue(key);
            
            if (!currentValue) {
                await disconnectRedis();
                res.status(404).send({ 
                    success: false, 
                    error: 'AI generated page not found' 
                });
                return;
            }
            
            await deleteRedisValue(key);
            
            // Rimuovi il pageId dall'indice utente, se presente
            const indexKey = `${AI_PAGES_PREFIX}${userId}`;
            const existingIndex = await getRedisValue(indexKey);
            if (existingIndex) {
                try {
                    const parsedIndex = JSON.parse(existingIndex as string);
                    const pageIds = Array.isArray(parsedIndex) ? parsedIndex : [parsedIndex];
                    const updatedPageIds = pageIds.filter((id: string) => id !== pageId);
                    await setRedisValue(indexKey, JSON.stringify(updatedPageIds));
                } catch (parseError) {
                    console.warn(`Failed to update AI pages index for user ${userId}:`, parseError);
                }
            }
            
            console.log(`AI page deleted: ${key}`);
            await disconnectRedis();

            res.status(200).send({ 
                success: true, 
                id: key,
                active: true 
            });
        } catch (error) {
            console.error('Error in deleteAIGeneratedPage:', error);
            res.status(500).send({ 
                success: false, 
                error: 'Failed to delete AI generated page' 
            });
        }
    };

    /**
     * Recupera tutte le pagine AI generate di un utente
     * @param userId ID dell'utente
     */
    static getUserAIGeneratedPages = async (req: Request, res: Response): Promise<void> => {
        try {
            const { userId } = req.params;

            // Verifica che userId sia presente
            if (!userId || typeof userId !== 'string') {
                res.status(400).send({ 
                    success: false, 
                    error: 'userId is required' 
                });
                return;
            }

            await redisConnect();
            
            // Prima recupera l'indice delle pagine dell'utente
            const indexKey = `${AI_PAGES_PREFIX}${userId}`;
            console.log(`Getting AI pages index for user: ${userId}, key: ${indexKey}`);
            
            const indexData = await getRedisValue(indexKey);
            
            if (!indexData) {
                console.log(`No index found for user: ${userId}`);
                await disconnectRedis();
                res.status(200).send({ 
                    success: true,
                    data: {
                        userId: userId,
                        pages: [],
                        count: 0,
                        message: 'No pages found for user'
                    }
                });
                return;
            }

            let pageIds: string[] = [];
            try {
                const parsed = JSON.parse(indexData as string);
                pageIds = Array.isArray(parsed) ? parsed : [parsed];
            } catch (e) {
                console.warn(`Failed to parse index data for user ${userId}:`, indexData);
                // Se il parsing fallisce, potrebbe essere un array con quotes singoli
                try {
                    // Rimuovi quotes singoli e dividi per virgola
                    const indexStr = typeof indexData === 'string' ? indexData : String(indexData);
                    const cleaned = indexStr.replace(/['\[\]]/g, '').trim();
                    if (cleaned.includes(',')) {
                        pageIds = cleaned.split(',').map((id: string) => id.trim());
                    } else if (cleaned) {
                        pageIds = [cleaned];
                    }
                } catch (e2) {
                    console.warn(`Failed to parse as simple array:`, e2);
                    pageIds = [String(indexData)];
                }
            }

            console.log(`Found ${pageIds.length} page IDs for user: ${userId}`);

            // Recupera i dettagli di ogni pagina
            const pages = [];
            for (const pageId of pageIds) {
                try {
                    // Usa il prefisso corretto per produzione
                    const pageKey = `${AI_PAGES_PREFIX}${userId}:${pageId}`;
                    
                    let pageData = await getRedisValue(pageKey);
                    
                    if (pageData) {
                        try {
                            const page = JSON.parse(pageData as string);
                            pages.push({
                                id: page.spec?.id || page.id || pageId,
                                title: page.spec?.title || page.title || 'Untitled Page',
                                subtitle: page.spec?.subtitle || page.subtitle,
                                description: page.spec?.description || page.description,
                                iconName: page.spec?.iconName || page.iconName,
                                template: page.spec?.template || page.template,
                                policy: page.spec?.policy || page.policy,
                                createdAt: page.spec?.createdAt || page.createdAt,
                                updatedAt: page.spec?.updatedAt || page.updatedAt,
                                prompt: page.prompt,
                                generatedAt: page.generatedAt
                            });
                        } catch (parseError) {
                            console.warn(`Failed to parse page ${pageId}:`, parseError);
                        }
                    }
                } catch (error) {
                    console.warn(`Failed to load page ${pageId}:`, error);
                }
            }

            await disconnectRedis();

            console.log(`Successfully retrieved ${pages.length} pages for user: ${userId}`);
            
            res.status(200).send({ 
                success: true,
                data: {
                    userId: userId,
                    pages: pages,
                    count: pages.length,
                    message: `Found ${pages.length} pages for user ${userId}`
                }
            });
        } catch (error) {
            console.error('Error in getUserAIGeneratedPages:', error);
            await disconnectRedis();
            res.status(500).send({ 
                success: false, 
                error: 'Failed to retrieve user AI generated pages' 
            });
        }
    };
}
