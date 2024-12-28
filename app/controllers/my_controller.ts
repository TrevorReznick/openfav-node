import { doChat } from '../scripts/chatGpt'
import { RequestById,  RequestMail, Response} from '../interfaces/ResponsesRequests'


export class SubController {

    static async doGptChat(req: any, res: Response) {

        console.log('hello from controller')

        const msg: any = req.body

        console.log('controller body request', msg)

        try {
            let message = await doChat(msg)
            console.log(message)
            res.send(message)
        } catch(e) {
            res.status(500).send(e)
        }
    }

}