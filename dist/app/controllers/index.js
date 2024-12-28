"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainController = void 0;
//import Response from 'express';
const mailer_1 = require("../scripts/mailer");
const MailerModel_1 = require("../interfaces/MailerModel");
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
}
exports.MainController = MainController;
