import express from 'express'
//import { Request, Response} from 'express'
import { MainController as main} from '../controllers'
import { RedisController as redis } from '../controllers/redis'

const router = express.Router()

router.get('/', main.home)
router.get('/test-api', main.testApi)
router.get('/test-mail', main.testMailer)
router.post('/send-email', main.sendMail as any)

/* @@ new routes @@ */
router.get('/test-redis', redis.home)


export default router





