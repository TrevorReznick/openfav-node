import { Model } from '../models/index'
//import Response from 'express';
import {__email as msg, do_mail as mailer} from '../scripts/mailer'
import { MailMessage } from '../interfaces/MailerModel'
import { generateImage, getImage } from '../scripts/imageGenerator'
import { doChat } from '../scripts/chatGpt'
import { MessageType, PromptMsg} from '../types/types'
import { RequestById,  RequestMail, RequestPrompt, Response} from '../interfaces/ResponsesRequests'


export class MainController {

    static home(req: RequestById, res: Response) {
        try{
            const message = 'Welcome to node-server application'
            res.send(message)
        } catch(err) {
            res.status(500).send(err)
        }
    }
    static async getAllUsers(req: RequestById, res: Response) {
        try {
            const users = await Model.queryAll()
            res.send(users)
        } catch (err) {
            res.status(500).send(err)
        }
    }
    static async getById(req: RequestById, res: Response) {
        const id = req.params.id
        if(!req.params.id){
            return res.status(400).send('Id parameter is required')
        } else {
            const user = await Model.queryById(id)
            .catch(err => {
                res.status(500).send(err)
            })
            if(!user){
                return res.status(404).send('User not found')
            }
            else res.send(user)
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
    /* @@ huggingface transformers @@ */

    static doImage(req: RequestPrompt, res: Response) {

        try {
            generateImage(`
                a cat dressed as witch for halloweeen
            `)
            const message = 'Image was created successully! Check in your public path'
            res.send(message)
        } catch (e) {
            console.log(e)
        }

    }

    

    static getImage(req: RequestPrompt, res: Response) {
        try {
            //generateImage("photo of a great boat in a river")
            console.log('call img buffer')
            const image64base = getImage('photo of a great boat in a river')
            //const message = 'Image was created successully! Check in your public path'
            //console.log('send img 64base')
            //console.log(image64base)
            res.send(image64base)
        } catch (e) {
            console.log(e)
        }

    }

    /* @@ chat GPT @@ */

    static async testPost(req: any, res: Response) {
        res.send('hello from post!')        
    }


    static async doGptChat(req: any, res: Response) {

        const msg: any = req.body        

        try {
            let message = await doChat(msg)
            console.log(message)
            res.send(message)
        } catch(e) {
            res.status(500).send(e)
        }
    }

}


/*async getById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);  
      const user = await UserModel.getById(id);
      res.send(user);
    } catch (err) {
      res.status(500).send(err);
    }
 }
*/



/*
export const main = {

    test: async (req: any, res: any) => {

        try {  
            const nome = req.query.nome
            const cognome = req.query.cognome
            const email = req.query.email
            const data = await Model.test()    
            res.send(data)    
        } catch (err) {
            res.status(500).send(err);
        }

    }
}
*/

