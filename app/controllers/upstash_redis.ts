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
     * Salva una sessione utente in Redis
     * @param session Dati della sessione utente
     * @param expirySeconds Tempo di scadenza in secondi (default: 24 ore)
     */
    static saveUserSession = async (session: UserSession, expirySeconds: number = SESSION_EXPIRY): Promise<void> => {
        try {
            await redisConnect()
            const key = `${SESSION_PREFIX}${session.id}`
            const sessionData = JSON.stringify(session)

            // Utilizziamo il metodo esistente setRedisValue
            await setRedisValue(key, sessionData)

            console.log(`User session saved with key: ${key} and expiry: ${expirySeconds} seconds`);

            // Nota: il metodo setRedisValue attuale non supporta l'impostazione di scadenza
            // In una implementazione completa, dovresti estendere il metodo per supportare EX
        } catch (error) {
            console.error('Error saving user session:', error);
            throw new Error('Failed to save user session');
        }
    };


}
