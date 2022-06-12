"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _iyzipay = _interopRequireDefault(require("iyzipay"));

var _ApiError = _interopRequireDefault(require("../error/ApiError.js"));

var _Session = _interopRequireDefault(require("../middlewares/Session.js"));

var RefundPayments = _interopRequireWildcard(require("../services/iyzico/methods/refund-payments.js"));

var _nanoid = _interopRequireDefault(require("../utils/nanoid.js"));

var _paymentSuccess = _interopRequireDefault(require("../db/payment-success.js"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const reasonEnum = ["double_payment", "buyer_request", "fraud", "other"];

var _default = router => {
  //REFUND WHOLE PAYMENT
  router.post("/payments/:paymentTransactionId/refund", _Session.default, async (req, res, next) => {
    var _req$body;

    const {
      paymentTransactionId
    } = req.params;
    const reasonObject = {};
    const {
      reason,
      description
    } = req.body;
    if (!paymentTransactionId) throw new _ApiError.default("paymentTransactionId is required", 400, "paymentTransactionIdRequired");

    if (reason && description) {
      if (!reasonEnum.includes(reason)) {
        throw new _ApiError.default("Reason is not valid", 400, "reasonNotValid");
      }

      reasonObject.reason = description;
      reasonObject.description = description;
    }

    const payment = await _paymentSuccess.default.findOne({
      "itemTransactions.paymentTransactionId": paymentTransactionId
    });
    const currentItemTransaction = payment.itemTransactions.find((itemTransaction, index) => {
      return itemTransaction.paymentTransactionId === paymentTransactionId;
    });
    const result = await RefundPayments.refundPayment({
      locale: req.user.locale,
      paymentTransactionId: currentItemTransaction.paymentTransactionId,
      conversationId: (0, _nanoid.default)(),
      price: ((_req$body = req.body) === null || _req$body === void 0 ? void 0 : _req$body.refundPrice) || currentItemTransaction.paidPrice,
      currency: _iyzipay.default.CURRENCY.TRY,
      ip: req.user.ip,
      ...reasonObject
    });
    res.json(result);
  });
};

exports.default = _default;