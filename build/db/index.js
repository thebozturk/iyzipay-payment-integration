"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _users = _interopRequireDefault(require("./users.js"));

var _products = _interopRequireDefault(require("./products.js"));

var _carts = _interopRequireDefault(require("./carts.js"));

var _paymentSuccess = _interopRequireDefault(require("./payment-success.js"));

var _paymentFailed = _interopRequireDefault(require("./payment-failed.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = [_users.default, _products.default, _carts.default, _paymentSuccess.default, _paymentFailed.default];
exports.default = _default;