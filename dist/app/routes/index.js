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
router.get('/test-db', controllers_1.MainController.getAllUsers);
router.get('/test-api', controllers_1.MainController.testApi);
router.get('/find-user/:id', controllers_1.MainController.getById);
router.get('/test-mail', controllers_1.MainController.testMailer);
router.post('/send-email', controllers_1.MainController.sendMail);
/* @@ new routes @@ */
router.post('/generate', controllers_1.MainController.doImage);
router.post('/get-img', controllers_1.MainController.getImage);
router.post('/chat', controllers_1.MainController.doGptChat);
/* test route params
router.post('/send-email', (req, res) => {
  console.log('Request Body:', req.body);

  // Resto del codice del tuo gestore di route
})
*/
exports.default = router;
/*
export function test(req: Request, res: Response) {
  res.send('Testing Routes')
}
*/
