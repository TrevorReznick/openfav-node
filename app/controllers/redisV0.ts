import { Request, Response } from 'express';
import { getRedisValue, setRedisValue, redisConnect, disconnectRedis } from '../services/redis'

export class RedisController {

    static home = async (req: Request, res: Response) => {

        try {

            await redisConnect()


            await setRedisValue('foo', 'bar')


            const result = await getRedisValue('foo')

            res.send(`Welcome to Openfav! Redis value: ${result}`)

            await redisConnect()

        } catch (error) {
            console.error('Error in RedisController:', error)
            res.status(500).send('Internal Server Error')
        }
    }
    // Add other controller methods here
}