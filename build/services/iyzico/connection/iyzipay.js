"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _iyzipay = _interopRequireDefault(require("iyzipay"));

require("dotenv/config");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Iyzipay configuration
const iyzipay = new _iyzipay.default({
  apiKey: process.env.API_KEY,
  secretKey: process.env.SECRET_KEY,
  uri: process.env.URL
});
var _default = iyzipay;
exports.default = _default;