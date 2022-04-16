"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUserCard = exports.deleteUserCard = exports.createUserCard = void 0;

var _iyzipay = _interopRequireDefault(require("../connection/iyzipay.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const createUserCard = async data => {
  return new Promise((resolve, reject) => {
    _iyzipay.default.card.create(data, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

exports.createUserCard = createUserCard;

const getUserCard = async data => {
  return new Promise((resolve, reject) => {
    _iyzipay.default.cardList.retrieve(data, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

exports.getUserCard = getUserCard;

const deleteUserCard = async data => {
  return new Promise((resolve, reject) => {
    _iyzipay.default.card.delete(data, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

exports.deleteUserCard = deleteUserCard;