"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cancelPayments = void 0;

var _iyzipay = _interopRequireDefault(require("../connection/iyzipay.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const cancelPayments = data => {
  return new Promise((resolve, reject) => {
    _iyzipay.default.cancel.create(data, (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
};

exports.cancelPayments = cancelPayments;