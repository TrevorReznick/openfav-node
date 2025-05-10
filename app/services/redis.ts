import { createClient } from 'redis'
import type { RedisClientType } from 'redis'

let client: RedisClientType


export const redisConnect = async () => {
    
    if (!client) {
        client = createClient({
            username: process.env.REDIS_USERNAME,
            password: process.env.REDIS_PASSWORD,
            socket: {
                host: process.env.REDIS_SOCKET_HOST,
                port: 11789
            }
        })

        client.on('error', err => console.log('Redis Client Error', err));

        await client.connect()
        console.log('Redis client connected')
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
};

export const disconnectRedis = async () => {
    if (client) {
        await client.quit();
        console.log('Redis client disconnected');
    }
}

/*
export const setRedisValue = async (key, value, expiration = 3600) => {
  return new Promise((resolve, reject) => {
    client.setex(key, expiration, value, (err, reply) => {
      if (err) {
        reject(err);
      } else {
        resolve(reply);
      }
    });
  });
};

export const getRedisValue = async (key) => {
  return new Promise((resolve, reject) => {
    client.get(key, (err, reply) => {
      if (err) {
        reject(err);
      } else {
        resolve(reply);
      }
    });
  });
};
*/