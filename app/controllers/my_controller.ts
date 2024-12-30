import { Response} from '../interfaces/ResponsesRequests'
import { GradioClientLite } from "gradio-client-lite"


export class SubController {

    static async home(req: any, res: Response) {

        console.log('hello from controller')

        const msg: any = req.body

        console.log('controller body request', msg)

        try {
            //let message = await doChat(msg)
            let message = msg
            console.log(message)
            res.send(message)
        } catch(e) {
            res.status(500).send(e)
        }
    }

}