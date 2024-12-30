"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors = require("cors");
const dotenv_1 = __importDefault(require("dotenv"));
const index_1 = __importDefault(require("./app/routes/index"));
const sseRoutes = require('./app/routes/sse');
const index_2 = require("./app/controllers/index");
/* test emails classes */
//import {__email, do_mail} from './app/scripts/mailer'
dotenv_1.default.config();
/* @@ init express @@ */
const app = (0, express_1.default)();
/* @@ init cors */
const corsOptions = {
    origin: '*'
};
app.use(cors(corsOptions));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
const port = process.env.PORT || 3000;
app.use('/api', index_1.default);
app.use('/images', express_1.default.static('/app/images'));
app.get("/", index_2.MainController.home); //welcome message
// Route SSE
app.use('/stream', sseRoutes);
/* @@ init app listen @@ */
app.listen(3000, '0.0.0.0', () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
//do_mail(__email)
