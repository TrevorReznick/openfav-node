import express from 'express'
//import { Request, Response} from 'express'
import { MainController as main } from '../controllers'
import { upload, uploadImage } from '../controllers/storage'
import { SubController as sub } from '../controllers/my_controller'
import { RedisController as redis } from '../controllers/upstash_redis'
import { RedisMockController as redisMock } from '../controllers/redis_mock'
/*
import {gradioController as gradio} from '../controllers/my_controllerV0'
import {gradioController as gradio1} from '../controllers/my_controllerV2'
*/


const router = express.Router()

router.get('/', main.home)
router.get('/test-api', main.testApi)
router.get('/test-mail', main.testMailer)
router.post('/send-email', main.sendMail as any)
router.post('/upload', upload.single('image'), uploadImage)
router.post('/set-session', redis.saveUserSession)
router.get('/session/:userId', redis.getUserSession)

/* @@ new routes @@ */
router.get('/test-redis', redis.home)

// Test methods per pagine AI (Upstash Redis)
router.post('/test/set', redis.testSet)
router.get('/test/get', redis.testGet)
router.delete('/test/delete', redis.testDelete)

// Test methods per pagine AI (Mock Redis)
router.post('/test/mock/set', redisMock.testSet)
router.get('/test/mock/get', redisMock.testGet)
router.delete('/test/mock/delete', redisMock.testDelete)
router.get('/test/mock/list', redisMock.testList)
router.delete('/test/mock/clear', redisMock.testClear)

router.post('/test-controller', sub.home)
/*
router.post('/screenshot', captureScreenshot)
router.post('/tokens', redis.setTokens)
router.get('/tokens/access/:accessToken', redis.getAccessToken)
router.get('/tokens/refresh/:refreshToken', redis.getRefreshToken)
router.post('/test-gradio', sub.testGradio)
router.post('/test-gradioV0', gradio.generateImage)
router.post('/test-gradioV1', gradio1.generateImage)
*/
export default router





