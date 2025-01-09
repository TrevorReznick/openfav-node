import express from 'express'
//import { Request, Response} from 'express'
import { MainController as main} from '../controllers'
import { RedisController as redis } from '../controllers/redis'
import { upload, uploadImage } from '../controllers/storage'
import {SubController as sub} from '../controllers/my_controller'
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
//router.post('/screenshot', captureScreenshot)

/* @@ new routes @@ */
router.get('/test-redis', redis.home)
router.post('/tokens', redis.setTokens)
router.get('/tokens/access/:accessToken', redis.getAccessToken)
router.get('/tokens/refresh/:refreshToken', redis.getRefreshToken)
router.post('/test-controller', sub.home)
/*
router.post('/test-gradio', sub.testGradio)
router.post('/test-gradioV0', gradio.generateImage)
router.post('/test-gradioV1', gradio1.generateImage)
*/


export default router





