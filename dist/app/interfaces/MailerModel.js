"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrasporterConfig = exports.MailMessage = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class MailMessage {
    constructor(msg) {
        this.to = msg._to;
        this.from = msg._from;
        this.subject = msg._subject;
        this.text = msg._text;
        this.name = msg._name || 'DefaultName'; // Utilizza un valore di default se _name non è fornito
    }
}
exports.MailMessage = MailMessage;
class TrasporterConfig {
    constructor(config) {
        this.service = config._service;
        this.user = config.auth._user;
        this.pass = config.auth._pass;
        this.logger = config._logger;
        this.debug = config._debug;
    }
}
exports.TrasporterConfig = TrasporterConfig;
