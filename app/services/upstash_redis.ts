import { Redis } from '@upstash/redis'

let client: Redis | null = null

export const redisConnect = async () => {
    if (!client) {
        const url = process.env.UPSTASH_REDIS_REST_URL
        const token = process.env.UPSTASH_REDIS_REST_TOKEN

        if (!url || !token) {
            throw new Error('Missing Upstash Redis configuration')
        }

        client = new Redis({
            url,
            token,
        })
        console.log('Upstash Redis client connected')
    }
}

export const setRedisValue = async (key: string, value: string, expirySeconds?: number) => {
    if (!client) {
        throw new Error('Redis client not connected');
    }
    if (expirySeconds) {
        await client.set(key, value, { ex: expirySeconds })
        return
    }

    await client.set(key, value)
}

export const getRedisValue = async (key: string) => {
    if (!client) {
        throw new Error('Redis client not connected');
    }
    return await client.get(key)
}

export const deleteRedisValue = async (key: string) => {
    if (!client) {
        throw new Error('Redis client not connected');
    }
    return await client.del(key)
}

export const disconnectRedis = async () => {
    // Upstash Redis client doesn't require explicit disconnection
    // as it uses HTTP REST API under the hood
    client = null
    console.log('Upstash Redis client disconnected');
}
