import express, { Express, Request, Response } from 'express'
import cors = require('cors')
import dotenv from 'dotenv' 
import router from './app/routes/index'
const sseRoutes = require('./app/routes/sse')

import {MainController as main} from './app/controllers/index'


/* test emails classes */
//import {__email, do_mail} from './app/scripts/mailer'

dotenv.config()

/* @@ init express @@ */
const app: Express = express()

/* @@ init cors */
const corsOptions = {
  origin: '*'
}

app.use(cors(corsOptions))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const port = process.env.PORT || 3000

app.use('/api', router)
app.use('/images', express.static('/app/images'))
app.get("/", main.home) //welcome message

// Route SSE
app.use('/stream', sseRoutes)


/* @@ init app listen @@ */
app.listen(3000, '0.0.0.0', () => {
  console.log(`[server]: Server is running at http://localhost:${port}`)
})

//do_mail(__email)







