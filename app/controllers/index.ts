//import Response from 'express';
import {__email as msg, do_mail as mailer} from '../scripts/mailer'
import { MailMessage } from '../interfaces/MailerModel'
import { RequestById,  RequestMail, Response} from '../interfaces/ResponsesRequests'


export class MainController {

    static home(req: RequestById, res: Response) {
        try{
            const message = 'Welcome to node-server application'
            res.send(message)
        } catch(err) {
            res.status(500).send(err)
        }
    }
    
    static sendMail(req: RequestMail, res: Response) {

        console.log('Request Body:', req.body)
        const msg = new MailMessage({
            _to: req.body.email,
            _from: 'double.facessss@gmail.com',
            _subject: req.body.subject,
            _text: req.body.text,
            _name: req.body.name
        })
        try{
            mailer(msg)
            const message = 'Message sent successully! Check your email.'
            res.send(message)
        } catch(err) {
            res.status(500).send(err)
        }
    }
    /* @@ test requests @@ */
    static testApi(req: RequestById, res: Response) {

        try{
            const message = 'Hello from api'
            res.send(message)
        } catch(err) {
            res.status(500).send(err)
        }
    }
    static testMailer(req: RequestById, res: Response) {
        
        try{
            mailer(msg)
            const message = 'Message sent successully! Check your email.'
            res.send(message)
        } catch(err) {
            res.status(500).send(err)
        }
    }    

}

