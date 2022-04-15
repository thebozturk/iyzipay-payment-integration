"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initialize = exports.getFormPayment = void 0;

var _iyzipay = _interopRequireDefault(require("../connection/iyzipay.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const initialize = data => {
  return new Promise((resolve, reject) => {
    _iyzipay.default.checkoutFormInitialize.create(data, (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
};

exports.initialize = initialize;

const getFormPayment = data => {
  return new Promise((resolve, reject) => {
    _iyzipay.default.checkoutFormInitialize.retrieve(data, (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
};

exports.getFormPayment = getFormPayment;