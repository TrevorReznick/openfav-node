import dotenv from 'dotenv'
import nodemailer = require('nodemailer')
import Mail = require('nodemailer/lib/mailer')
import {MailMessage, TrasporterConfig} from '../interfaces/MailerModel'

dotenv.config()

const __email = new MailMessage({
    _to: 'enzonav@yahoo.it',
    _from: 'double.facessss@gmail.com',
    _subject: 'Test Message',
    _text: 'Hi, if you read this message it means that the mailer of application runs!'
})

const do_mail = async (_email: object) => {
  await wrapedSendMail(_email)/* my_obj */
  //console.log(obj)
}

const wrapedSendMail = async (obj: object) => {
  //console.log(email)
  return new Promise((resolve, reject) => {
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_AUTH_USER,
        pass: process.env.MAIL_AUTH_PASSWORD
      },
      logger: true,
      debug: false
    })
    //let email = mail(to, subject, text)
    transporter.sendMail(obj, function(error, info){
      console.log(obj)
      if (error) {
        console.log("error is " + error)        
        resolve(false); // or use rejcet(false) but then you will have to handle errors
      } else {
        console.log('Email sent: ' + info.response)
        resolve(true)
      }
    })
  })
}

const sendmail = async () =>  {
  let resp = await wrapedSendMail(__email)
  return resp
}

export {__email, do_mail}
