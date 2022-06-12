"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _iyzipay = _interopRequireDefault(require("iyzipay"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _config = _interopRequireDefault(require("../../../config.js"));

require("dotenv/config");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const envPath = _config.default !== null && _config.default !== void 0 && _config.default.production ? "./env/.prod" : "./env/.dev";

_dotenv.default.config({
  path: envPath
}); // Iyzipay configuration


const iyzipay = new _iyzipay.default({
  apiKey: process.env.API_KEY,
  secretKey: process.env.SECRET_KEY,
  uri: process.env.URL
});
var _default = iyzipay;
exports.default = _default;