"use strict";
Object.defineProperty(exports, "__esModule", { value: true })

exports.MailMessage = void 0

var MailMessage = /** @class */ (function () {
    function MailMessage(msg) {
        this._to = msg.to;
        this._from = msg.from;
        this._subject = msg.subject;
        this._text = msg.text;
    }
    MailMessage.prototype.msg = function () {
        return {
            'to': this._to,
            'from': this._from,
            'subject': this._subject,
            'text': this._text
        };
    };
    return MailMessage
}())

exports.MailMessage = MailMessage
