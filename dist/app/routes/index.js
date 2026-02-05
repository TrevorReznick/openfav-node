"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
//import { Request, Response} from 'express'
const controllers_1 = require("../controllers");
const storage_1 = require("../controllers/storage");
const my_controller_1 = require("../controllers/my_controller");
const upstash_redis_1 = require("../controllers/upstash_redis");
const redis_mock_1 = require("../controllers/redis_mock");
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
router.post('/set-session', upstash_redis_1.RedisController.saveUserSession);
router.get('/session/:userId', upstash_redis_1.RedisController.getUserSession);
/* @@ new routes @@ */
router.get('/test-redis', upstash_redis_1.RedisController.home);
// Test methods per pagine AI (Upstash Redis)
router.post('/test/set', upstash_redis_1.RedisController.testSet);
router.get('/test/get', upstash_redis_1.RedisController.testGet);
router.delete('/test/delete', upstash_redis_1.RedisController.testDelete);
// Test methods per pagine AI (Mock Redis)
router.post('/test/mock/set', redis_mock_1.RedisMockController.testSet);
router.get('/test/mock/get', redis_mock_1.RedisMockController.testGet);
router.delete('/test/mock/delete', redis_mock_1.RedisMockController.testDelete);
router.get('/test/mock/list', redis_mock_1.RedisMockController.testList);
router.delete('/test/mock/clear', redis_mock_1.RedisMockController.testClear);
router.post('/test-controller', my_controller_1.SubController.home);
/*
router.post('/screenshot', captureScreenshot)
router.post('/tokens', redis.setTokens)
router.get('/tokens/access/:accessToken', redis.getAccessToken)
router.get('/tokens/refresh/:refreshToken', redis.getRefreshToken)
router.post('/test-gradio', sub.testGradio)
router.post('/test-gradioV0', gradio.generateImage)
router.post('/test-gradioV1', gradio1.generateImage)
*/
exports.default = router;
