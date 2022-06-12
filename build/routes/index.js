"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _test = _interopRequireDefault(require("./test.js"));

var _users = _interopRequireDefault(require("./users.js"));

var _cards = _interopRequireDefault(require("./cards.js"));

var _installment = _interopRequireDefault(require("./installment.js"));

var _payments = _interopRequireDefault(require("./payments.js"));

var _paymentsThreeds = _interopRequireDefault(require("./payments-threeds.js"));

var _checkout = _interopRequireDefault(require("./checkout.js"));

var _cancelPayments = _interopRequireDefault(require("./cancel-payments.js"));

var _refundPayments = _interopRequireDefault(require("./refund-payments.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = [_test.default, _users.default, _cards.default, _installment.default, _payments.default, _paymentsThreeds.default, _checkout.default, _cancelPayments.default, _refundPayments.default];
exports.default = _default;