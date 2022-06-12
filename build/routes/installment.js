"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _moment = _interopRequireDefault(require("moment"));

var _Session = _interopRequireDefault(require("../middlewares/Session.js"));

var _nanoid = _interopRequireDefault(require("../utils/nanoid.js"));

var Installments = _interopRequireWildcard(require("../services/iyzico/methods/installments.js"));

var _ApiError = _interopRequireDefault(require("../error/ApiError.js"));

var _carts = _interopRequireDefault(require("../db/carts.js"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  ObjectId
} = _mongoose.default;

var _default = router => {
  //installment by price
  router.post('/installments', _Session.default, async (req, res) => {
    const {
      binNumber,
      price
    } = req.body;

    if (!binNumber || !price) {
      throw new _ApiError.default("Bin number and price is required", 400, "missingParamaters");
    }

    const result = await Installments.checkInstallment({
      locale: req.user.locale,
      conversationId: (0, _nanoid.default)(),
      binNumber: binNumber,
      price: price
    });
    res.json(result);
  }); //installment by basket price

  router.post('/installments/:cartId', _Session.default, async (req, res) => {
    const {
      binNumber
    } = req.body;
    const {
      cartId
    } = req.params;

    if (!cartId) {
      throw new _ApiError.default("Card id is required", 400, "missingParamaters");
    }

    const cart = await _carts.default.findOne({
      _id: ObjectId(cartId)
    }).populate("products", {
      _id: 1,
      price: 1
    });
    const price = cart.products.map(product => product.price).reduce((a, b) => a + b, 0);

    if (!binNumber || !price) {
      throw new _ApiError.default("Bin number and price is required", 400, "missingParamaters");
    }

    const result = await Installments.checkInstallment({
      locale: req.user.locale,
      conversationId: (0, _nanoid.default)(),
      binNumber: binNumber,
      price: price
    });
    res.json(cart);
  });
};

exports.default = _default;