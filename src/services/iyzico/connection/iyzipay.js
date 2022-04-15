import Iyzipay from 'iyzipay';
import {} from 'dotenv/config'

// Iyzipay configuration
const iyzipay = new Iyzipay({
    apiKey: process.env.API_KEY,
    secretKey: process.env.SECRET_KEY,
    uri: process.env.URL
});

export default iyzipay;
