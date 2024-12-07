"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.do_mail = exports.__email = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const nodemailer = require("nodemailer");
const MailerModel_1 = require("../interfaces/MailerModel");
dotenv_1.default.config();
const __email = new MailerModel_1.MailMessage({
    _to: 'enzonav@yahoo.it',
    _from: 'double.facessss@gmail.com',
    _subject: 'Test Message',
    _text: 'Hi, if you read this message it means that the mailer of application runs!'
});
exports.__email = __email;
const do_mail = (_email) => __awaiter(void 0, void 0, void 0, function* () {
    yield wrapedSendMail(_email); /* my_obj */
    //console.log(obj)
});
exports.do_mail = do_mail;
const wrapedSendMail = (obj) => __awaiter(void 0, void 0, void 0, function* () {
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
        });
        //let email = mail(to, subject, text)
        transporter.sendMail(obj, function (error, info) {
            console.log(obj);
            if (error) {
                console.log("error is " + error);
                resolve(false); // or use rejcet(false) but then you will have to handle errors
            }
            else {
                console.log('Email sent: ' + info.response);
                resolve(true);
            }
        });
    });
});
const sendmail = () => __awaiter(void 0, void 0, void 0, function* () {
    let resp = yield wrapedSendMail(__email);
    return resp;
});
