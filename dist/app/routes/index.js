"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
//import { Request, Response} from 'express'
const controllers_1 = require("../controllers");
//import { RedisController as redis } from '../controllers/redis'
const storage_1 = require("../controllers/storage");
const my_controller_1 = require("../controllers/my_controller");
const upstash_redis_1 = require("../controllers/upstash_redis");
/*
import {gradioController as gradio} from '../controllers/my_controllerV0'
import {gradioController as gradio1} from '../controllers/my_controllerV2'
*/
const router = express_1.default.Router();
router.get('/', controllers_1.MainController.home);
router.get('/test-api', controllers_1.MainController.testApi);
router.get('/test-mail', controllers_1.MainController.testMailer);
router.post('/send-email', controllers_1.MainController.sendMail);
router.post('/upload', storage_1.upload.single('image'), storage_1.uploadImage);
//router.post('/screenshot', captureScreenshot)
/* @@ new routes @@ */
router.get('/test-redis', upstash_redis_1.RedisController.home);
router.post('/tokens', upstash_redis_1.RedisController.setTokens);
router.get('/tokens/access/:accessToken', upstash_redis_1.RedisController.getAccessToken);
router.get('/tokens/refresh/:refreshToken', upstash_redis_1.RedisController.getRefreshToken);
router.post('/test-controller', my_controller_1.SubController.home);
/*
router.post('/test-gradio', sub.testGradio)
router.post('/test-gradioV0', gradio.generateImage)
router.post('/test-gradioV1', gradio1.generateImage)
*/
exports.default = router;
