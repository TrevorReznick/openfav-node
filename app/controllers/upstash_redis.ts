import { Request, Response } from 'express'
import { UserSession } from '../types/types'
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

    static getUserSessionOld = async (req: Request, res: Response) => {
        try {
            // Estrai l'ID utente dai parametri della richiesta
            const { user_id: userId } = req.params

            // Verifica che l'ID utente sia presente
            if (!userId) {
                return res.status(400).send({ message: 'User ID is required' });
            }

            // Connetti a Redis
            await redisConnect()

            // Costruisci la chiave per la sessione utente
            const key = `${SESSION_PREFIX}${userId}`;

            // Recupera i dati della sessione da Redis
            const sessionData = await getRedisValue(key);

            // Se non ci sono dati, restituisci un errore 404
            if (!sessionData) {
                return res.status(404).send({ message: 'User session not found' });
            }

            // Verifica che i dati siano in formato stringa (JSON serializzato)
            if (typeof sessionData === 'string') {
                try {
                    // Prova a deserializzare i dati JSON
                    const session = JSON.parse(sessionData) as UserSession;

                    // Restituisci la sessione con codice 200
                    console.log(`User session retrieved with key: ${key}`);
                    return res.status(200).send(session);
                } catch (parseError) {
                    // Gestisci errori di parsing JSON
                    console.error('Error parsing session data:', parseError);
                    return res.status(500).send({ message: 'Invalid session data format' });
                }
            }

            // Se i dati non sono in formato stringa, restituisci un errore
            return res.status(500).send({ message: 'Invalid session data format' });

        } catch (error) {
            // Gestisci eventuali errori generici
            console.error('Error retrieving user session:', error);
            return res.status(500).send({ message: 'Failed to retrieve user session' });

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
    }
}
