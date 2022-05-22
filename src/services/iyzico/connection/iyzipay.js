import Iyzipay from 'iyzipay';
import dotenv from 'dotenv'
import config from '../../../config.js'
import {} from 'dotenv/config'

const envPath = config?.production ? "./env/.prod" : "./env/.dev"
dotenv.config({ path: envPath })
// Iyzipay configuration
const iyzipay = new Iyzipay({
    apiKey: process.env.API_KEY,
    secretKey: process.env.SECRET_KEY,
    uri: process.env.URL
});

export default iyzipay;
