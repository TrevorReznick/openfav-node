import express from 'express'
//import { Request, Response} from 'express'
import { MainController as main} from '../controllers'

const router = express.Router()

router.get('/', main.home)
router.get('/test-db', main.getAllUsers)
router.get('/test-api', main.testApi)
router.get('/find-user/:id', main.getById)
router.get('/test-mail', main.testMailer)
router.post('/send-email', main.sendMail as any)
/* @@ new routes @@ */
router.post('/generate', main.doImage)
router.post('/get-img', main.getImage)
router.post('/chat', main.doGptChat)


/* test route params 
router.post('/send-email', (req, res) => {
  console.log('Request Body:', req.body);

  // Resto del codice del tuo gestore di route
})
*/

export default router

/*
export function test(req: Request, res: Response) {
  res.send('Testing Routes')
}
*/



