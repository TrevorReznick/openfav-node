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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainController = void 0;
//import Response from 'express';
const mailer_1 = require("../scripts/mailer");
const MailerModel_1 = require("../interfaces/MailerModel");
const chatGpt_1 = require("../scripts/chatGpt");
class MainController {
    static home(req, res) {
        try {
            const message = 'Welcome to node-server application';
            res.send(message);
        }
        catch (err) {
            res.status(500).send(err);
        }
    }
    static sendMail(req, res) {
        console.log('Request Body:', req.body);
        const msg = new MailerModel_1.MailMessage({
            _to: req.body.email,
            _from: 'double.facessss@gmail.com',
            _subject: req.body.subject,
            _text: req.body.text,
            _name: req.body.name
        });
        try {
            (0, mailer_1.do_mail)(msg);
            const message = 'Message sent successully! Check your email.';
            res.send(message);
        }
        catch (err) {
            res.status(500).send(err);
        }
    }
    /* @@ test requests @@ */
    static testApi(req, res) {
        try {
            const message = 'Hello from api';
            res.send(message);
        }
        catch (err) {
            res.status(500).send(err);
        }
    }
    static testMailer(req, res) {
        try {
            (0, mailer_1.do_mail)(mailer_1.__email);
            const message = 'Message sent successully! Check your email.';
            res.send(message);
        }
        catch (err) {
            res.status(500).send(err);
        }
    }
    static doGptChat(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const msg = req.body;
            try {
                let message = yield (0, chatGpt_1.doChat)(msg);
                console.log(message);
                res.send(message);
            }
            catch (e) {
                res.status(500).send(e);
            }
        });
    }
}
exports.MainController = MainController;
