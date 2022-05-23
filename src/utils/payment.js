import {Types} from mongoose
import PaymentSuccess from '../db/payment-success.js'
import PaymentFailed from '../db/payment-failed.js'
import Carts from '../db/carts.js'
const {ObjectId} = Types


export const CompletePayment = async (result => {
    if(result?.status === 'success'){
        await Carts.updateOne({_id: ObjectId(result?.basketId)}, {$set: {complated: true}})
        await PaymentSuccess.create({
            status: result?.status,
            cartId: result?.basketId,
            conversationId: result?.conversionId,
            currency: result?.currency,
            paymentId: result?.paymentId,
            price: result?.price,
            paidPrice: result?.paidPrice,
            itemTransactions: result?.itemTransactions.map(item => {
                return {
                    itemId: item?.itemId,
                    paymentTransactionId: item?.paymentTransactionId,
                    price: item?.price,
                    paidPrice: item?.paidPrice
                }
            }),
            log: result,
        })
    }else{
        await PaymentFailed.create({
            status: result?.status,
            errorCode: result?.errorCode,
            conversationId: result?.conversionId,
            errorMessage: result?.errorMessage,
            log:result
        })
    }
})