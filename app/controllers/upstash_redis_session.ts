import { UserSession } from '../types/types';
import { redisConnect, setRedisValue, getRedisValue } from '../services/redis';

const SESSION_PREFIX = 'user_session_';
const SESSION_EXPIRY = 86400; // 24 ore in secondi

/**
 * Salva una sessione utente in Redis
 * @param session Dati della sessione utente
 * @param expirySeconds Tempo di scadenza in secondi (default: 24 ore)
 */
export const saveUserSession = async (session: UserSession, expirySeconds: number = SESSION_EXPIRY): Promise<void> => {
    try {
        await redisConnect();
        const key = `${SESSION_PREFIX}${session.id}`;
        const sessionData = JSON.stringify(session);

        // Utilizziamo il metodo esistente setRedisValue
        await setRedisValue(key, sessionData);

        // Nota: il metodo setRedisValue attuale non supporta l'impostazione di scadenza
        // In una implementazione completa, dovresti estendere il metodo per supportare EX
    } catch (error) {
        console.error('Error saving user session:', error);
        throw new Error('Failed to save user session');
    }
};

/**
 * Recupera una sessione utente da Redis
 * @param userId ID dell'utente
 * @returns La sessione utente o null se non trovata
 */
export const getUserSession = async (userId: string): Promise<UserSession | null> => {
    try {
        await redisConnect();
        const key = `${SESSION_PREFIX}${userId}`;
        const sessionData = await getRedisValue(key);

        if (!sessionData) {
            return null;
        }

        return JSON.parse(sessionData) as UserSession;
    } catch (error) {
        console.error('Error retrieving user session:', error);
        throw new Error('Failed to retrieve user session');
    }
};

/**
 * Aggiorna una sessione utente esistente
 * @param userId ID dell'utente
 * @param updateData Dati parziali da aggiornare
 * @returns La sessione aggiornata o null se non trovata
 */
export const updateUserSession = async (
    userId: string,
    updateData: Partial<UserSession>
): Promise<UserSession | null> => {
    try {
        const existingSession = await getUserSession(userId);

        if (!existingSession) {
            return null;
        }

        // Crea una nuova sessione combinando i dati esistenti con quelli aggiornati
        const updatedSession: UserSession = {
            ...existingSession,
            ...updateData,
        };

        // Salva la sessione aggiornata
        await saveUserSession(updatedSession);

        return updatedSession;
    } catch (error) {
        console.error('Error updating user session:', error);
        throw new Error('Failed to update user session');
    }
};

/**
 * Elimina una sessione utente
 * @param userId ID dell'utente
 */
export const deleteUserSession = async (userId: string): Promise<boolean> => {
    try {
        await redisConnect();
        const key = `${SESSION_PREFIX}${userId}`;

        // Nota: il servizio Redis attuale non ha un metodo di eliminazione
        // In una implementazione completa, dovresti aggiungere un metodo deleteRedisValue
        // Per ora, impostiamo il valore a una stringa vuota
        await setRedisValue(key, '');

        return true;
    } catch (error) {
        console.error('Error deleting user session:', error);
        throw new Error('Failed to delete user session');
    }
};
