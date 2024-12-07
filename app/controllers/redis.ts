import { Request, Response } from 'express';
import { getRedisValue, setRedisValue, redisConnect, disconnectRedis} from '../services/redis'

export class RedisController {

    static home = async (req: Request, res: Response) => {
        
        try {
            // Ensure Redis is connected
            await redisConnect()

            // Set a value in Redis
            await setRedisValue('foo', 'bar')

            // Get a value from Redis
            const result = await getRedisValue('foo')

            res.send(`Welcome to Openfav! Redis value: ${result}`)

            await redisConnect()
            
        } catch (error) {
            console.error('Error in MainController:', error)
            res.status(500).send('Internal Server Error')
        }
    }
    // Add other controller methods here
}