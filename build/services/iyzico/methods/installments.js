"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkInstallment = void 0;

var _iyzipay = _interopRequireDefault(require("../connection/iyzipay.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const checkInstallment = data => {
  return new Promise((resolve, reject) => {
    _iyzipay.default.installmentInfo.retrieve(data, (err, res) => {
      if (err) reject(err);
      resolve(res);
    });
  });
};

exports.checkInstallment = checkInstallment;