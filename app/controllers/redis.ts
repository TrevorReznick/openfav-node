import { Request, Response } from 'express';
import { getRedisValue, setRedisValue, redisConnect, disconnectRedis} from '../services/redis'

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

  static setTokens = async (req: Request, res: Response) => {
    try {

      await redisConnect()
      const { accessToken, refreshToken, userId } = req.body
      if (!accessToken || !refreshToken || !userId) {
        return res.status(400).send('Access Token, Refresh Token, and User ID are required')
      }
      // Imposta i token in Redis con una scadenza (ad esempio, 3600 secondi per l'access token)
      await setRedisValue(`access_token_${accessToken}`, JSON.stringify({ userId }))
      await setRedisValue(`refresh_token_${refreshToken}`, JSON.stringify({ userId }))
  
      res.send(`Tokens set successfully for user ${userId}`)

    } catch (error) {
      console.log('Error setting tokens:', error)
      res.status(500).send('Internal Server Error')
    }
  }
  
  static getAccessToken = async (req: Request, res: Response) => {

    await redisConnect()

    try {
      const { accessToken } = req.params
  
      if (!accessToken) {
        return res.status(400).send('Access Token is required')
      }
  
      const accessTokenData = await getRedisValue(`access_token_${accessToken}`)
  
      if (!accessTokenData) {
        return res.status(404).send('Access Token not found')
      }
  
      res.send(JSON.parse(accessTokenData))
    } catch (error) {
      console.log('Error getting access token:', error)
      res.status(500).send('Internal Server Error')
    }
  }
  
  static getRefreshToken = async (req: Request, res: Response) => {

    try {
      const { refreshToken } = req.params

      if (!refreshToken) {
        return res.status(400).send('Refresh Token is required')
      }

      const refreshTokenData = await getRedisValue(`refresh_token_${refreshToken}`)

      if (!refreshTokenData) {
        return res.status(404).send('Refresh Token not found')
      }

      res.send(JSON.parse(refreshTokenData))
    } catch (error) {
      console.log('Error getting refresh token:', error)
      res.status(500).send('Internal Server Error')
    }
  }
}
