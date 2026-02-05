import { Request, Response } from 'express'

// Mock Redis storage
const mockRedisStore: Map<string, string> = new Map()

export class RedisMockController {

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

            // Salva il valore nel mock store
            mockRedisStore.set(key, value);
            
            console.log(`Mock test key-value saved: ${key}`);
            
            res.status(200).send({ 
                success: true, 
                id: key,
                active: true 
            });
        } catch (error) {
            console.error('Error in mock testSet:', error);
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

            // Recupera il valore dal mock store
            const value = mockRedisStore.get(key);
            
            console.log(`Mock test key-value retrieved: ${key}`);

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
            console.error('Error in mock testGet:', error);
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

            // Verifica che la chiave esista
            if (!mockRedisStore.has(key)) {
                res.status(404).send({ 
                    success: false, 
                    error: 'Key not found' 
                });
                return;
            }
            
            // Elimina il valore dal mock store
            mockRedisStore.delete(key);
            
            console.log(`Mock test key-value deleted: ${key}`);

            res.status(200).send({ 
                success: true, 
                id: key,
                active: true 
            });
        } catch (error) {
            console.error('Error in mock testDelete:', error);
            res.status(500).send({ 
                success: false, 
                error: 'Failed to delete key-value' 
            });
        }
    };

    /**
     * Test method - Mostra tutto il contenuto del mock store
     */
    static testList = async (req: Request, res: Response): Promise<void> => {
        try {
            const allEntries = Object.fromEntries(mockRedisStore);
            
            res.status(200).send({ 
                success: true,
                store: allEntries,
                count: mockRedisStore.size
            });
        } catch (error) {
            console.error('Error in mock testList:', error);
            res.status(500).send({ 
                success: false, 
                error: 'Failed to list store contents' 
            });
        }
    };

    /**
     * Test method - Pulisce tutto il mock store
     */
    static testClear = async (req: Request, res: Response): Promise<void> => {
        try {
            const countBefore = mockRedisStore.size;
            mockRedisStore.clear();
            
            res.status(200).send({ 
                success: true,
                message: `Cleared ${countBefore} entries from mock store`
            });
        } catch (error) {
            console.error('Error in mock testClear:', error);
            res.status(500).send({ 
                success: false, 
                error: 'Failed to clear store' 
            });
        }
    };
}