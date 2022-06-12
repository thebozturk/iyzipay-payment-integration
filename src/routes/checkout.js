import Iyzipay from "iyzipay";
import moment from "moment";
import Carts from "../db/carts.js";
import Users from "../db/users.js";
import ApiError from "../error/ApiError.js";
import Session from "../middlewares/Session.js";
import * as Checkout from "../services/iyzico/methods/checkout.js"
import * as Cards from "../services/iyzico/methods/cards.js"
import nanoid from "../utils/nanoid.js";
import { CompletePayment } from "../utils/payment.js";
import * as Payments from "../services/iyzico/methods/payments.js";
import * as PaymentsThreeDS from "../services/iyzico/methods/threeds-payments.js";

export default (router) => {
    //CHECKOUT FORM COMPLATE PAYMENT
    router.post("/checkout/complate/payment", async (req, res, next) => {
        let result = await Checkout.getFormPayment({
            locale:'tr',
            conversationId: nanoid(),
            token: req.body.token
        })
        await CompletePayment(result)
        res.json(result)
    })
    //CHECKOUT FORM INITIALIZE
    router.post("/checkout/:cartId", async (req, res, next) => {

        if(!req.user.cardUserKey) {
            throw new ApiError("Card user key is required", 400,"cardUserKeyRequired");
        }
        if(!req.params?.cartId){
            throw new ApiError("Cart id is required", 400,"cartIdRequired");
        }
        const cart = await Carts.findOne({_id: req.params?.cartId}).populate("buyer").populate("products");
        if(!cart){
            throw new ApiError("Cart not found", 404,"cartNotFound");
        }
        if(cart?.completed){
            throw new ApiError("Cart is completed", 400,"cartCompleted");
        }
        const paidPrice = cart.products.map(product => product.price).reduce((a, b) => a + b, 0);
        const data = {
            locale:req.user.locale,
            conversationId: nanoid(),
            price: paidPrice,
            paidPrice: paidPrice,
            currency: Iyzipay.CURRENCY.TRY,
            installments: "1",
            basketId: cart._id,
            paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
            enabledInstallments: [1,2,3,6,9],
            paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
            callbackUrl: `${process.env.END_POINT}/checkout/complate/payment`,
            ...req.user?.cardUserKey && {
                cardUserKey: req.user.cardUserKey
            },
            buyer:{
                id:String(cart.user._id),
                name: cart.user.name,
                surname: cart.user.surname,
                email: cart.user.email,
                gsmNumber: cart.user.phoneNumber,
                identityNumber: cart.user.identityNumber,
                lastLoginDate: moment(req.user.updatedAt).format("YYYY-MM-DD HH:mm:ss"),
                registrationDate: moment(req.user.createdAt).format("YYYY-MM-DD HH:mm:ss"),
                registrationAddress: cart.user.address,
                ip: req.user.ip,
                city: cart.user.city,
                country: cart.user.country,
                zipCode: cart.user.zipCode,
            },
            shippingAddress:{
                contactName: cart.user.name+" "+cart.user.surname,
                city: cart.user.city,
                country: cart.user.country,
                address: cart.user.address,
                zipCode: cart.user.zipCode,
            },
            billingAddress:{
                contactName: cart.user.name+" "+cart.user.surname,
                city: cart.user.city,
                country: cart.user.country,
                address: cart.user.address,
                zipCode: cart.user.zipCode,
            },
            basketItems: cart.products.map(product, index => {
                return {
                    id: String(product._id),
                    name: product.name,
                    category1: product.category[0],
                    category2: product.category[1],
                    itemType: Iyzipay.BASKET_ITEM_TYPE[product.itemType],
                    price: product.price,
                }
            }),
        }
        let result = await Checkout.initialize(data)
        const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Pay</title>
        <meta charset="UTF-8"/>
        \`${result?.checkoutFormContent}\`
        </head>
        </html>
        `
        res.send(html)
    })
}