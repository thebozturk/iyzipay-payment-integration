import mongoose from "mongoose";
import nanoid from "../utils/nanoid.js";

const {Schema} = mongoose;
const {ObjectId} = Schema.Types;

const ItemTransactionsSchema = new Schema({
    uid:{
        type: String,
        default: nanoid(),
        unique: true,
        required: true
    },
    itemId:{
        type: ObjectId,
        required: true
    },
    paymentTransactionId:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    paidPrice:{
        type: Number,
        required: true
    }
})

const PaymentsSuccessSchema = new Schema({
    uid:{
        type: String,
        default: nanoid(),
        unique: true,
        required: true
    },
    status:{
        type: String,
        required: true,
        enum: ['success']
    },
    cartId:{
        type: ObjectId,
        ref: "Carts",
        required: true
    },
    conversationId:{
        type: String,
        required: true
    },
    currency:{
        type: String,
        required: true,
        enum: ['TRY', 'USD', 'EUR']
    },
    paymentId:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    paidPrice:{
        type: Number,
        required: true
    },
    itemTransactions:{
        type: [ItemTransactionsSchema],
    },
    log:{
        type:Schema.Types.Mixed,
        required: true
    }
},{
    _id:true,
    collection: "payments-success",
    timestamps: true,
    toJSON: {
        transform: (doc, ret) => {
            delete ret.__v
            return {
                ...ret
            }
        }
    }
})

const PaymentsSuccess = mongoose.model("PaymentsSuccess", PaymentsSuccessSchema);

export default PaymentsSuccess;