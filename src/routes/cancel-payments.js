import Types from 'mongoose';
import ApiError from "../error/ApiError.js";
import Session from "../middlewares/Session.js";
import * as CancelPayments from "../services/iyzico/methods/cancel-payments.js";
import nanoid from "../utils/nanoid.js";
import PaymentsSuccess from "../db/payment-success.js";

const {ObjectId} = Types;

const reasonEnum = ["double_payment","buyer_request","fraud","other"]

export default (router) => {
    //CANCEL WHOLE PAYMENT
    router.post("/payments/:paymentSuccessId/cancel", Session, async (req, res, next) => {
        const {reason, description} = req.body;
        const {paymentSuccessId} = req.params;
        const reasonObject = {}
        if(!paymentSuccessId){
            throw new ApiError("Payment success id is required", 400,"paymentSuccessIdRequired");
        }
        if(reason && description){
            if(!reasonEnum.includes(reason)){
                throw new ApiError("Reason is not valid", 400,"reasonNotValid");
            }
            reasonObject.reason = description;
            reasonObject.description = description;
        }
        const payment = await PaymentsSuccess.findOne({_id: paymentSuccessId});
        const result = await CancelPayments.cancelPayment({
            locale:req.user.locale,
            conversationId: nanoid(),
            paymentId: payment.paymentId,
            ip:req.user.ip,
            ...reasonObject
        })
        res.json(result)
    })
}