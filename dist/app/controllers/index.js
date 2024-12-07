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
const index_1 = require("../models/index");
//import Response from 'express';
const mailer_1 = require("../scripts/mailer");
const MailerModel_1 = require("../interfaces/MailerModel");
const imageGenerator_1 = require("../scripts/imageGenerator");
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
    static getAllUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield index_1.Model.queryAll();
                res.send(users);
            }
            catch (err) {
                res.status(500).send(err);
            }
        });
    }
    static getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            if (!req.params.id) {
                return res.status(400).send('Id parameter is required');
            }
            else {
                const user = yield index_1.Model.queryById(id)
                    .catch(err => {
                    res.status(500).send(err);
                });
                if (!user) {
                    return res.status(404).send('User not found');
                }
                else
                    res.send(user);
            }
        });
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
    /* @@ huggingface transformers @@ */
    static doImage(req, res) {
        try {
            (0, imageGenerator_1.generateImage)(`
                a cat dressed as witch for halloweeen
            `);
            const message = 'Image was created successully! Check in your public path';
            res.send(message);
        }
        catch (e) {
            console.log(e);
        }
    }
    static getImage(req, res) {
        try {
            //generateImage("photo of a great boat in a river")
            console.log('call img buffer');
            const image64base = (0, imageGenerator_1.getImage)('photo of a great boat in a river');
            //const message = 'Image was created successully! Check in your public path'
            //console.log('send img 64base')
            //console.log(image64base)
            res.send(image64base);
        }
        catch (e) {
            console.log(e);
        }
    }
    /* @@ chat GPT @@ */
    static testPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.send('hello from post!');
        });
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
