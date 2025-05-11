import { Redis } from '@upstash/redis'
import { UserSession } from '../types/types'

let client: Redis | null = null

export const redisConnect = async () => {
    if (!client) {
        client = new Redis({
            url: process.env.UPSTASH_REDIS_REST_URL,
            token: process.env.UPSTASH_REDIS_REST_TOKEN,
        })
        console.log('Upstash Redis client connected')
    }
}

export const setRedisValue = async (key: string, value: string) => {
    if (!client) {
        throw new Error('Redis client not connected');
    }
    await client.set(key, value)
}

export const getRedisValue = async (key: string) => {
    if (!client) {
        throw new Error('Redis client not connected');
    }
    return await client.get(key)
}

export const disconnectRedis = async () => {
    // Upstash Redis client doesn't require explicit disconnection
    // as it uses HTTP REST API under the hood
    client = null
    console.log('Upstash Redis client disconnected');
}
