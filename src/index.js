import 'express-async-errors'
import dotenv from 'dotenv'
import config from './config.js'
import express from 'express'
import logger from 'morgan'
import https from 'https'
import fs from 'fs'
import path from 'path'
import helmet from 'helmet'
import cors from 'cors'
import GenericErrorHandler from './middlewares/GenericErrorHandler.js'
import ApiError from './error/ApiError.js'
import DBModels from './db/index.js'
import mongoose from 'mongoose'
const __dirname = path.resolve();


/* Checking if the config.production variable is set to true. If it is, it will load the .prod file in
the env folder. If it is not, it will load the .dev file in the env folder. */
const envPath = config?.production ? "./env/.prod" : "./env/.dev"
dotenv.config({ path: envPath })


//DB connection
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('DB connected successfully.')
}).catch(err => {
    console.log(err)
})

const app = express()

app.use(logger(process.env.logger))
app.use(helmet())
app.use(cors())

app.use('/',(req,res) => {
    throw new ApiError('This is a test error', 500, 'test')
    res.json({
        message: 'Hello World'
    })
})

/* A middleware that will catch any error that is thrown in the application. */
app.use(GenericErrorHandler)

/* Setting the maximum size of the request body to 1mb. */
app.use(express.json({
    limit: '1mb'
}))

/* Parsing the request body and making it available in the req.body object. */
app.use(express.urlencoded({
    extended: true
}))

/* Checking if the HTTPS_ENABLED environment variable is set to true. If it is, it will create a HTTPS
server using the key and cert files in the certs folder. If it is not, it will create a HTTP server. */
if(process.env.HTTPS_ENABLED === 'true') {
    const key = fs.readFileSync(path.join(__dirname, './src/certs/key.pem'), 'utf8').toString()
    const cert = fs.readFileSync(path.join(__dirname, './src/certs/cert.pem'), 'utf8').toString()
    https.createServer({
        key: key,
        cert: cert
    }, app).listen(process.env.PORT, () => {
        console.log(`Server started on port ${process.env.PORT}`)
    })
}else {
    app.listen(process.env.PORT, () => {
        console.log(`Server running on port ${process.env.PORT}`)
    })
}

