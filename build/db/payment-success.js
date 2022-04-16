"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _nanoid = _interopRequireDefault(require("../utils/nanoid.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  Schema
} = _mongoose.default;
const {
  ObjectId
} = Schema.Types;
const ItemTransactionsSchema = new Schema({
  uid: {
    type: String,
    default: (0, _nanoid.default)(),
    unique: true,
    required: true
  },
  itemId: {
    type: ObjectId,
    required: true
  },
  paymentTransactionId: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  paidPrice: {
    type: Number,
    required: true
  }
});
const PaymentsSuccessSchema = new Schema({
  uid: {
    type: String,
    default: (0, _nanoid.default)(),
    unique: true,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['success']
  },
  cartId: {
    type: ObjectId,
    ref: "Carts",
    required: true
  },
  conversationId: {
    type: String,
    required: true
  },
  currency: {
    type: String,
    required: true,
    enum: ['TRY', 'USD', 'EUR']
  },
  paymentId: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  paidPrice: {
    type: Number,
    required: true
  },
  itemTransactions: {
    type: [ItemTransactionsSchema]
  },
  log: {
    type: Schema.Types.Mixed,
    required: true
  }
}, {
  _id: true,
  collection: "payments-success",
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      delete ret.__v;
      return { ...ret
      };
    }
  }
});

const PaymentsSuccess = _mongoose.default.model("PaymentsSuccess", PaymentsSuccessSchema);

var _default = PaymentsSuccess;
exports.default = _default;