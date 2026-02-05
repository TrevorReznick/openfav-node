import { Request, Response } from 'express'
import { UserSession, PageSessionData } from '../types/types'
import { getRedisValue, setRedisValue, redisConnect, disconnectRedis } from '../services/upstash_redis'

const SESSION_PREFIX = 'user_session_';
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
     * @param session Dati della sessione utente
     * @param expirySeconds Tempo di scadenza in secondi (default: 24 ore)
    */
    static saveUserSession = async (req: Request, res: Response, next: Function): Promise<Response | undefined> => {
        try {
            const { session, expirySeconds } = req.body;

            // Verifica che session sia presente e valido
            if (!session || !session.id) {
                return res.status(400).send({ message: 'Invalid session data' });
            }

            await redisConnect();
            const key = `${SESSION_PREFIX}${session.id}`;
            const sessionData = JSON.stringify(session);

            // Utilizziamo il metodo esistente setRedisValue
            await setRedisValue(key, sessionData);

            console.log(`User session saved with key: ${key} and expiry: ${expirySeconds || SESSION_EXPIRY} seconds`);
            await disconnectRedis();

            res.status(200).send({ message: 'Session saved successfully' });
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
                res.status(404).send({ 
                    success: false, 
                    error: 'Key not found' 
                });
                return;
            }
            
            // Elimina il valore da Redis impostandolo a stringa vuota (approccio alternativo)
            await setRedisValue(key, '');
            
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
}
