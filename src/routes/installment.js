import {Types} from 'mongoose';
import moment from 'moment';
import Session from '../middlewares/Session.js';
import nanoid from '../utils/nanoid.js';
import * as Installments from '../services/iyzico/methods/installments.js';
import ApiError from '../error/ApiError.js';
import Carts from '../db/carts.js';
const {ObjectId} = Types;

export default (router) => {
    //installment by price
    router.post('/installments', Session, async (req, res) => {
        const {binNumber,price} = req.body;
        if(!binNumber || !price) {
            throw new ApiError("Bin number and price is required", 400, "missingParamaters");
        }
        const result = await Installments.checkInstallment({
            locale: req.user.locale,
            conversationId: nanoid(),
            binNumber: binNumber,
            price: price,
        });
        res.json(result);
    })
    //installment by basket price
    router.post('/installments/:cartId', Session, async (req, res) => {
        const {binNumber} = req.body;
        const {cartId} = req.params;
        if(!cartId) {
            throw new ApiError("Card id is required", 400, "missingParamaters");
        }
        const cart = await Carts.findOne({
            _id: ObjectId(cartId),
        }).populate("products",{
            _id: 1,
            price: 1,
        })
        const price = cart.products.map(product => product.price).reduce((a,b) => a+b,0);
        if(!binNumber || !price) {
            throw new ApiError("Bin number and price is required", 400, "missingParamaters");
        }
        const result = await Installments.checkInstallment({
            locale: req.user.locale,
            conversationId: nanoid(),
            binNumber: binNumber,
            price: price,
        });
        res.json(cart);
    })
}