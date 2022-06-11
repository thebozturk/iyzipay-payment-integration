import Iyzipay from "iyzipay";
import moment from "moment";
import Carts from "../db/carts.js";
import Users from "../db/users.js";
import ApiError from "../error/ApiError.js";
import Session from "../middlewares/Session.js";
import * as PaymentsThreeDS from "../services/iyzico/methods/threeds-payments.js"
import * as Cards from "../services/iyzico/methods/cards.js"
import nanoid from "../utils/nanoid.js";
import { CompletePayment } from "../utils/payment.js";
import * as Payments from "../services/iyzico/methods/payments.js";


export default (router)=>{
    router.post('/threeds/payments/complete', async (req, res, next)=>{
        if(!req.body.paymentId){
            throw new ApiError("paymentId is required",400,"paymentIdRequired");
        }
        if(req.body.status !== 'success'){
            throw new ApiError("Payment cant be started because initialization is failed",400,"initializationFailed");
        }
        const data = {
            locale: "tr",
            conversationId: nanoid(),
            paymentId: req.body.paymentId,
            conversationData: req.body.conversationData
        }
        const result = await PaymentsThreeDS.complatePayment(data);
        await CompletePayment(result)
        res.status(200).json(result);
    })
    //COMPLATE PAYMENT -- 3D SECURE
    router.post("/threeds/payments/:cartId/with-new-card", Session, async (req, res) => {
        const {card} = req.body;
        if(!card){
            throw new ApiError("Card is required", 400,"cardRequired");
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
        card.registerCard = "0"
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
            paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
            callbackUrl: `${process.env.END_POINT}/threeds/payments/complete`,
            paymentCard: card,
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
        let result = await PaymentsThreeDS.initializePayment(data)
        const html = Buffer.from(result?.threeDsHtmlContent, "base64").toString();
        res.json(result)
    })
    //CREATE PAYMENT -- 3D SECURE AND SAVE CARD
    router.post("/threeds/payments/:cartId/with-new-card/register-card", Session, async (req, res) => {
        const {card} = req.body;
        if(!card){
            throw new ApiError("Card is required", 400,"cardRequired");
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
        if(req.user.cardUserKey) {
            card.userKey = req.user.cardUserKey;
        }
        card.registerCard = "0"
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
            paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
            callbackUrl: `${process.env.END_POINT}/threeds/payments/complete`,
            paymentCard: card,
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
        let result = await PaymentsThreeDS.initializePayment(data)
        const html = Buffer.from(result?.threeDsHtmlContent, "base64").toString();
        res.json(result)
    })
    //CREATE PAYMENT BY REGİSTERED CARD WITH CARD INDEX
    router.post("/threeds/payments/:cartId/:cardIndex/with-registered-card-index", Session, async (req, res) => {
        const {cardIndex} = req.params;
        if(!cardIndex){
            throw new ApiError("cardIndex is required", 400,"cardIndexRequired");
        }
        if(!req.user.cardUserKey) {
            throw new ApiError("Card user key is required", 400,"cardUserKeyRequired");
        }
        const cards = await Cards.getUserCard({
            locale:req.user.locale,
            conversationId: nanoid(),
            cardUserKey: req.user.cardUserKey,
        });
        const index = parseInt(cardIndex);
        if(index >= cards.cardDetails.length){
            throw new ApiError("Card doesnt exist", 400,"cardIndexNotFound");
        }
        const {cardToken} = cards.cardDetails[index];
        const card = {cardToken, cardUserKey: req.user.cardUserKey};
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
        if(req.user.cardUserKey) {
            card.userKey = req.user.cardUserKey;
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
            paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
            callbackUrl: `${process.env.END_POINT}/threeds/payments/complete`,
            paymentCard: card,
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
        let result = await PaymentsThreeDS.initializePayment(data)
        const html = Buffer.from(result?.threeDsHtmlContent, "base64").toString();
        res.json(result)
    })
    //CREATE PAYMENT BY REGİSTERED CARD WITH CARD TOKEN
    router.post("/threeds/payments/:cartId/with-registered-card-token", Session, async (req, res) => {
        const {cardToken} = req.body;
        if(!cardToken){
            throw new ApiError("cardToken is required", 400,"cardTokenRequired");
        }
        if(!req.user.cardUserKey) {
            throw new ApiError("Card user key is required", 400,"cardUserKeyRequired");
        }

        const card = {cardToken, cardUserKey: req.user.cardUserKey};
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
        if(req.user.cardUserKey) {
            card.userKey = req.user.cardUserKey;
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
            paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
            callbackUrl: `${process.env.END_POINT}/threeds/payments/complete`,
            paymentCard: card,
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
        let result = await PaymentsThreeDS.initializePayment(data)
        const html = Buffer.from(result?.threeDsHtmlContent, "base64").toString();
        res.json(result)
    })

}