"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
//import { Request, Response} from 'express'
const controllers_1 = require("../controllers");
const redis_1 = require("../controllers/redis");
const storage_1 = require("../controllers/storage");
const my_controller_1 = require("../controllers/my_controller");
const router = express_1.default.Router();
router.get('/', controllers_1.MainController.home);
router.get('/test-api', controllers_1.MainController.testApi);
router.get('/test-mail', controllers_1.MainController.testMailer);
router.post('/send-email', controllers_1.MainController.sendMail);
router.post('/upload', storage_1.upload.single('image'), storage_1.uploadImage);
//router.post('/screenshot', captureScreenshot)
/* @@ new routes @@ */
router.get('/test-redis', redis_1.RedisController.home);
router.post('/do-chat', my_controller_1.SubController.doGptChat);
exports.default = router;
