import Iyzipay from "iyzipay";
import moment from "moment";
import Carts from "../db/carts.js";
import Users from "../db/users.js";
import ApiError from "../error/ApiError.js";
import Session from "../middlewares/Session.js";
import * as Payments from "../services/iyzico/methods/payments.js"
import * as Cards from "../services/iyzico/methods/cards.js"
import nanoid from "../utils/nanoid.js";
import { CompletePayment } from "../utils/payment.js";

export default (router) => {
    // Create a new payment with new card and not save card
    router.post("/payments/:cartId/with-new-card", Session, async (req, res) => {
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
            paymentCard: card,
            buyer:{
                id:String(cart.user._id),
                name: cart.user.name,
                surname: cart.user.surname,
                email: cart.user.email,
                gsmNumber: cart.user.phoneNumber,
                email: cart.user.email,
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
        let result = await Payments.createPayment(data)
        await CompletePayment(result)
        res.json(result)
    })

    // Create a new payment with new card and save card
    router.post("/payments/:cartId/with-new-card/register-card", Session, async (req, res) => {
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
        if(req.user?.cardUserKey){
            card.cardUserKey = req.user?.cardUserKey;
        }
        card.registerCard = "1"
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
            paymentCard: card,
            buyer:{
                id:String(cart.user._id),
                name: cart.user.name,
                surname: cart.user.surname,
                email: cart.user.email,
                gsmNumber: cart.user.phoneNumber,
                email: cart.user.email,
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
        let result = await Payments.createPayment(data)
        if(!req.user?.cardUserKey){
            const user = await Users.findOne({_id: req.user?._id});
            user.cardUserKey = result.cardUserKey;
            await user.save();
        }
        await CompletePayment(result)
        res.json(result)
    })

    // Create a new payment with registered card
    router.post("/payments/:cartId/:cardIndex/with-registered-card-index", Session, async (req, res) => {
        let {cartIndex} = req.params
        if(!cartIndex){
            throw new ApiError("Cart index is required", 400,"cartIndexRequired");
        }
        if(!req.user?.cardUserKey){
            throw new ApiError("No registered card available", 400,"cardUserKeyRequired");
        }
        const cards = await Cards.getUserCard({
            locale:req.user.locale,
            cardUserKey: req.user.cardUserKey,
            conversationId: nanoid(),
        })
        const index = parseInt(cartIndex)
        if(index >= cards.cardDetails.length){
            throw new ApiError("Card does not exist", 400,"cartIndexNotFound");
        }
        const {cardToken} = cards.cardDetails[index]
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
        const card = {
            cardToken: cardToken,
            cardUserKey: req.user?.cardUserKey,
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
            paymentCard: card,
            buyer:{
                id:String(cart.user._id),
                name: cart.user.name,
                surname: cart.user.surname,
                email: cart.user.email,
                gsmNumber: cart.user.phoneNumber,
                email: cart.user.email,
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
        let result = await Payments.createPayment(data)
        await CompletePayment(result)
        res.json(result)
    })

    //Create a new payment with card token
    router.post("/payments/:cartId/with-registered-card-token", Session, async (req, res) => {
        let {cardToken} = req.body
        if(!cardToken){
            throw new ApiError("Cart token is required", 400,"cartTokenRequired");
        }
        if(!req.user?.cardUserKey){
            throw new ApiError("No registered card available", 400,"cardUserKeyRequired");
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
        const card = {
            cardToken: cardToken,
            cardUserKey: req.user?.cardUserKey,
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
            paymentCard: card,
            buyer:{
                id:String(cart.user._id),
                name: cart.user.name,
                surname: cart.user.surname,
                email: cart.user.email,
                gsmNumber: cart.user.phoneNumber,
                email: cart.user.email,
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
        let result = await Payments.createPayment(data)
        await CompletePayment(result)
        res.json(result)
    })
}