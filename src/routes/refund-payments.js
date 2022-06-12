import Iyzipay from "iyzipay";
import ApiError from "../error/ApiError.js";
import Session from "../middlewares/Session.js";
import * as RefundPayments from "../services/iyzico/methods/refund-payments.js";
import nanoid from "../utils/nanoid.js";
import PaymentsSuccess from "../db/payment-success.js";


const reasonEnum = ["double_payment","buyer_request","fraud","other"]

export default (router) => {
    //REFUND WHOLE PAYMENT
    router.post("/payments/:paymentTransactionId/refund", Session, async (req, res, next) => {
        const { paymentTransactionId } = req.params;
        const reasonObject = {}
        const {reason,description} = req.body;
        if(!paymentTransactionId) throw new ApiError("paymentTransactionId is required", 400, "paymentTransactionIdRequired");
        if(reason && description){
            if(!reasonEnum.includes(reason)){
                throw new ApiError("Reason is not valid", 400,"reasonNotValid");
            }
            reasonObject.reason = description;
            reasonObject.description = description;
        }
        const payment = await PaymentsSuccess.findOne({
            "itemTransactions.paymentTransactionId": paymentTransactionId,
        });
        const currentItemTransaction = payment.itemTransactions.find((itemTransaction,index) => {
            return itemTransaction.paymentTransactionId === paymentTransactionId
        });
        const result = await RefundPayments.refundPayment({
            locale: req.user.locale,
            paymentTransactionId: currentItemTransaction.paymentTransactionId,
            conversationId: nanoid(),
            price: req.body?.refundPrice || currentItemTransaction.paidPrice,
            currency: Iyzipay.CURRENCY.TRY,
            ip:req.user.ip,
            ...reasonObject
        });
        res.json(result);
    })
}