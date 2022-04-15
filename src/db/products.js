import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import nanoid from "../utils/nanoid.js";

const {Schema} = mongoose;
const {ObjectId} = Schema.Types;

const ProductsSchema = new Schema({
    uid:{
        type: String,
        default: nanoid(),
        unique: true,
        required: true
    },
    name:{
        type:String,
        required: true
    },
    images:{
        type: [String],
        required: true
    },
    categories:{
        type: [String],
    },
    brand:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    currency:{
        type: String,
        required: true,
        default: "TRY",
        enum: ["TRY", "USD", "EUR"]
    },
    stock:{
        type: Number,
        required: true,
        default: 1
    },
    itemType:{
        type: String,
        required: true,
        default:'PHYSCIAL',
        enum: ['PHYSCIAL', 'VIRTUAL']
    }
},{
    _id:true,
    collection: "products",
    timestamps: true,
    toJSON: { 
        transform: (doc, ret) => {
            delete ret.__v
            return {
                ...ret
            }
        }
    }
});

const Products = mongoose.model("Products", ProductsSchema);