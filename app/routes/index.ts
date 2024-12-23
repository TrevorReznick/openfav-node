import express from 'express'
//import { Request, Response} from 'express'
import { MainController as main} from '../controllers'
import { RedisController as redis } from '../controllers/redis'
import { upload, uploadImage } from '../controllers/storage'
import { captureScreenshot } from '../controllers/doScreenshot'

const router = express.Router()

router.get('/', main.home)
router.get('/test-api', main.testApi)
router.get('/test-mail', main.testMailer)
router.post('/send-email', main.sendMail as any)
router.post('/upload', upload.single('image'), uploadImage)
router.post('/screenshot', captureScreenshot)

/* @@ new routes @@ */
router.get('/test-redis', redis.home)


export default router





