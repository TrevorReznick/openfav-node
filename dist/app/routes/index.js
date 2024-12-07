"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
//import { Request, Response} from 'express'
const controllers_1 = require("../controllers");
const router = express_1.default.Router();
router.get('/', controllers_1.MainController.home);
router.get('/test-api', controllers_1.MainController.testApi);
router.get('/test-mail', controllers_1.MainController.testMailer);
router.post('/send-email', controllers_1.MainController.sendMail);
/* @@ new routes @@ */
exports.default = router;
