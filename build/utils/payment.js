"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CompletePayment = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _paymentSuccess = _interopRequireDefault(require("../db/payment-success.js"));

var _paymentFailed = _interopRequireDefault(require("../db/payment-failed.js"));

var _carts = _interopRequireDefault(require("../db/carts.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  ObjectId
} = _mongoose.default;

const CompletePayment = async result => {
  if ((result === null || result === void 0 ? void 0 : result.status) === 'success') {
    await _carts.default.updateOne({
      _id: ObjectId(result === null || result === void 0 ? void 0 : result.basketId)
    }, {
      $set: {
        completed: true
      }
    });
    await _paymentSuccess.default.create({
      status: result === null || result === void 0 ? void 0 : result.status,
      cartId: result === null || result === void 0 ? void 0 : result.basketId,
      conversationId: result === null || result === void 0 ? void 0 : result.conversionId,
      currency: result === null || result === void 0 ? void 0 : result.currency,
      paymentId: result === null || result === void 0 ? void 0 : result.paymentId,
      price: result === null || result === void 0 ? void 0 : result.price,
      paidPrice: result === null || result === void 0 ? void 0 : result.paidPrice,
      itemTransactions: result === null || result === void 0 ? void 0 : result.itemTransactions.map(item => {
        return {
          itemId: item === null || item === void 0 ? void 0 : item.itemId,
          paymentTransactionId: item === null || item === void 0 ? void 0 : item.paymentTransactionId,
          price: item === null || item === void 0 ? void 0 : item.price,
          paidPrice: item === null || item === void 0 ? void 0 : item.paidPrice
        };
      }),
      log: result
    });
  } else {
    await _paymentFailed.default.create({
      status: result === null || result === void 0 ? void 0 : result.status,
      errorCode: result === null || result === void 0 ? void 0 : result.errorCode,
      conversationId: result === null || result === void 0 ? void 0 : result.conversionId,
      errorMessage: result === null || result === void 0 ? void 0 : result.errorMessage,
      log: result
    });
  }
};

exports.CompletePayment = CompletePayment;