"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initializePayment = exports.complatePayment = void 0;

var _iyzipay = _interopRequireDefault(require("../connection/iyzipay.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const initializePayment = (data, callback) => {
  return new Promise((resolve, reject) => {
    _iyzipay.default.threedsInitialize.create(data, (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
};

exports.initializePayment = initializePayment;

const complatePayment = (data, callback) => {
  return new Promise((resolve, reject) => {
    _iyzipay.default.threedsPayment.create(data, (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
};

exports.complatePayment = complatePayment;