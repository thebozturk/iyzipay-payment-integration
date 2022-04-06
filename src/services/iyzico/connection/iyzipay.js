import iyzipay from 'iyzipay';
import {} from 'dotenv/config'

// Iyzipay configuration
const iyzipay = new Iyzipay({
    apiKey: process.env.API_KEY,
    secretKey: process.env.SECRET_KEY,
    url: process.env.URL,
})

export default iyzipay;
