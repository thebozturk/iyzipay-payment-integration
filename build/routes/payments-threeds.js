"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _iyzipay = _interopRequireDefault(require("iyzipay"));

var _moment = _interopRequireDefault(require("moment"));

var _carts = _interopRequireDefault(require("../db/carts.js"));

var _users = _interopRequireDefault(require("../db/users.js"));

var _ApiError = _interopRequireDefault(require("../error/ApiError.js"));

var _Session = _interopRequireDefault(require("../middlewares/Session.js"));

var PaymentsThreeDS = _interopRequireWildcard(require("../services/iyzico/methods/threeds-payments.js"));

var Cards = _interopRequireWildcard(require("../services/iyzico/methods/cards.js"));

var _nanoid = _interopRequireDefault(require("../utils/nanoid.js"));

var _payment = require("../utils/payment.js");

var Payments = _interopRequireWildcard(require("../services/iyzico/methods/payments.js"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = router => {
  router.post('/threeds/payments/complete', async (req, res, next) => {
    if (!req.body.paymentId) {
      throw new _ApiError.default("paymentId is required", 400, "paymentIdRequired");
    }

    if (req.body.status !== 'success') {
      throw new _ApiError.default("Payment cant be started because initialization is failed", 400, "initializationFailed");
    }

    const data = {
      locale: "tr",
      conversationId: (0, _nanoid.default)(),
      paymentId: req.body.paymentId,
      conversationData: req.body.conversationData
    };
    const result = await PaymentsThreeDS.complatePayment(data);
    await (0, _payment.CompletePayment)(result);
    res.status(200).json(result);
  }); //COMPLATE PAYMENT -- 3D SECURE

  router.post("/threeds/payments/:cartId/with-new-card", _Session.default, async (req, res) => {
    var _req$params, _req$params2;

    const {
      card
    } = req.body;

    if (!card) {
      throw new _ApiError.default("Card is required", 400, "cardRequired");
    }

    if (!((_req$params = req.params) !== null && _req$params !== void 0 && _req$params.cartId)) {
      throw new _ApiError.default("Cart id is required", 400, "cartIdRequired");
    }

    const cart = await _carts.default.findOne({
      _id: (_req$params2 = req.params) === null || _req$params2 === void 0 ? void 0 : _req$params2.cartId
    }).populate("buyer").populate("products");

    if (!cart) {
      throw new _ApiError.default("Cart not found", 404, "cartNotFound");
    }

    if (cart !== null && cart !== void 0 && cart.completed) {
      throw new _ApiError.default("Cart is completed", 400, "cartCompleted");
    }

    card.registerCard = "0";
    const paidPrice = cart.products.map(product => product.price).reduce((a, b) => a + b, 0);
    const data = {
      locale: req.user.locale,
      conversationId: (0, _nanoid.default)(),
      price: paidPrice,
      paidPrice: paidPrice,
      currency: _iyzipay.default.CURRENCY.TRY,
      installments: "1",
      basketId: cart._id,
      paymentChannel: _iyzipay.default.PAYMENT_CHANNEL.WEB,
      paymentGroup: _iyzipay.default.PAYMENT_GROUP.PRODUCT,
      callbackUrl: `${process.env.END_POINT}/threeds/payments/complete`,
      paymentCard: card,
      buyer: {
        id: String(cart.user._id),
        name: cart.user.name,
        surname: cart.user.surname,
        email: cart.user.email,
        gsmNumber: cart.user.phoneNumber,
        identityNumber: cart.user.identityNumber,
        lastLoginDate: (0, _moment.default)(req.user.updatedAt).format("YYYY-MM-DD HH:mm:ss"),
        registrationDate: (0, _moment.default)(req.user.createdAt).format("YYYY-MM-DD HH:mm:ss"),
        registrationAddress: cart.user.address,
        ip: req.user.ip,
        city: cart.user.city,
        country: cart.user.country,
        zipCode: cart.user.zipCode
      },
      shippingAddress: {
        contactName: cart.user.name + " " + cart.user.surname,
        city: cart.user.city,
        country: cart.user.country,
        address: cart.user.address,
        zipCode: cart.user.zipCode
      },
      billingAddress: {
        contactName: cart.user.name + " " + cart.user.surname,
        city: cart.user.city,
        country: cart.user.country,
        address: cart.user.address,
        zipCode: cart.user.zipCode
      },
      basketItems: cart.products.map(product, index => {
        return {
          id: String(product._id),
          name: product.name,
          category1: product.category[0],
          category2: product.category[1],
          itemType: _iyzipay.default.BASKET_ITEM_TYPE[product.itemType],
          price: product.price
        };
      })
    };
    let result = await PaymentsThreeDS.initializePayment(data);
    const html = Buffer.from(result === null || result === void 0 ? void 0 : result.threeDsHtmlContent, "base64").toString();
    res.json(result);
  }); //CREATE PAYMENT -- 3D SECURE AND SAVE CARD

  router.post("/threeds/payments/:cartId/with-new-card/register-card", _Session.default, async (req, res) => {
    var _req$params3, _req$params4;

    const {
      card
    } = req.body;

    if (!card) {
      throw new _ApiError.default("Card is required", 400, "cardRequired");
    }

    if (!((_req$params3 = req.params) !== null && _req$params3 !== void 0 && _req$params3.cartId)) {
      throw new _ApiError.default("Cart id is required", 400, "cartIdRequired");
    }

    const cart = await _carts.default.findOne({
      _id: (_req$params4 = req.params) === null || _req$params4 === void 0 ? void 0 : _req$params4.cartId
    }).populate("buyer").populate("products");

    if (!cart) {
      throw new _ApiError.default("Cart not found", 404, "cartNotFound");
    }

    if (cart !== null && cart !== void 0 && cart.completed) {
      throw new _ApiError.default("Cart is completed", 400, "cartCompleted");
    }

    if (req.user.cardUserKey) {
      card.userKey = req.user.cardUserKey;
    }

    card.registerCard = "0";
    const paidPrice = cart.products.map(product => product.price).reduce((a, b) => a + b, 0);
    const data = {
      locale: req.user.locale,
      conversationId: (0, _nanoid.default)(),
      price: paidPrice,
      paidPrice: paidPrice,
      currency: _iyzipay.default.CURRENCY.TRY,
      installments: "1",
      basketId: cart._id,
      paymentChannel: _iyzipay.default.PAYMENT_CHANNEL.WEB,
      paymentGroup: _iyzipay.default.PAYMENT_GROUP.PRODUCT,
      callbackUrl: `${process.env.END_POINT}/threeds/payments/complete`,
      paymentCard: card,
      buyer: {
        id: String(cart.user._id),
        name: cart.user.name,
        surname: cart.user.surname,
        email: cart.user.email,
        gsmNumber: cart.user.phoneNumber,
        identityNumber: cart.user.identityNumber,
        lastLoginDate: (0, _moment.default)(req.user.updatedAt).format("YYYY-MM-DD HH:mm:ss"),
        registrationDate: (0, _moment.default)(req.user.createdAt).format("YYYY-MM-DD HH:mm:ss"),
        registrationAddress: cart.user.address,
        ip: req.user.ip,
        city: cart.user.city,
        country: cart.user.country,
        zipCode: cart.user.zipCode
      },
      shippingAddress: {
        contactName: cart.user.name + " " + cart.user.surname,
        city: cart.user.city,
        country: cart.user.country,
        address: cart.user.address,
        zipCode: cart.user.zipCode
      },
      billingAddress: {
        contactName: cart.user.name + " " + cart.user.surname,
        city: cart.user.city,
        country: cart.user.country,
        address: cart.user.address,
        zipCode: cart.user.zipCode
      },
      basketItems: cart.products.map(product, index => {
        return {
          id: String(product._id),
          name: product.name,
          category1: product.category[0],
          category2: product.category[1],
          itemType: _iyzipay.default.BASKET_ITEM_TYPE[product.itemType],
          price: product.price
        };
      })
    };
    let result = await PaymentsThreeDS.initializePayment(data);
    const html = Buffer.from(result === null || result === void 0 ? void 0 : result.threeDsHtmlContent, "base64").toString();
    res.json(result);
  }); //CREATE PAYMENT BY REGİSTERED CARD WITH CARD INDEX

  router.post("/threeds/payments/:cartId/:cardIndex/with-registered-card-index", _Session.default, async (req, res) => {
    var _req$params5, _req$params6;

    const {
      cardIndex
    } = req.params;

    if (!cardIndex) {
      throw new _ApiError.default("cardIndex is required", 400, "cardIndexRequired");
    }

    if (!req.user.cardUserKey) {
      throw new _ApiError.default("Card user key is required", 400, "cardUserKeyRequired");
    }

    const cards = await Cards.getUserCard({
      locale: req.user.locale,
      conversationId: (0, _nanoid.default)(),
      cardUserKey: req.user.cardUserKey
    });
    const index = parseInt(cardIndex);

    if (index >= cards.cardDetails.length) {
      throw new _ApiError.default("Card doesnt exist", 400, "cardIndexNotFound");
    }

    const {
      cardToken
    } = cards.cardDetails[index];
    const card = {
      cardToken,
      cardUserKey: req.user.cardUserKey
    };

    if (!((_req$params5 = req.params) !== null && _req$params5 !== void 0 && _req$params5.cartId)) {
      throw new _ApiError.default("Cart id is required", 400, "cartIdRequired");
    }

    const cart = await _carts.default.findOne({
      _id: (_req$params6 = req.params) === null || _req$params6 === void 0 ? void 0 : _req$params6.cartId
    }).populate("buyer").populate("products");

    if (!cart) {
      throw new _ApiError.default("Cart not found", 404, "cartNotFound");
    }

    if (cart !== null && cart !== void 0 && cart.completed) {
      throw new _ApiError.default("Cart is completed", 400, "cartCompleted");
    }

    if (req.user.cardUserKey) {
      card.userKey = req.user.cardUserKey;
    }

    const paidPrice = cart.products.map(product => product.price).reduce((a, b) => a + b, 0);
    const data = {
      locale: req.user.locale,
      conversationId: (0, _nanoid.default)(),
      price: paidPrice,
      paidPrice: paidPrice,
      currency: _iyzipay.default.CURRENCY.TRY,
      installments: "1",
      basketId: cart._id,
      paymentChannel: _iyzipay.default.PAYMENT_CHANNEL.WEB,
      paymentGroup: _iyzipay.default.PAYMENT_GROUP.PRODUCT,
      callbackUrl: `${process.env.END_POINT}/threeds/payments/complete`,
      paymentCard: card,
      buyer: {
        id: String(cart.user._id),
        name: cart.user.name,
        surname: cart.user.surname,
        email: cart.user.email,
        gsmNumber: cart.user.phoneNumber,
        identityNumber: cart.user.identityNumber,
        lastLoginDate: (0, _moment.default)(req.user.updatedAt).format("YYYY-MM-DD HH:mm:ss"),
        registrationDate: (0, _moment.default)(req.user.createdAt).format("YYYY-MM-DD HH:mm:ss"),
        registrationAddress: cart.user.address,
        ip: req.user.ip,
        city: cart.user.city,
        country: cart.user.country,
        zipCode: cart.user.zipCode
      },
      shippingAddress: {
        contactName: cart.user.name + " " + cart.user.surname,
        city: cart.user.city,
        country: cart.user.country,
        address: cart.user.address,
        zipCode: cart.user.zipCode
      },
      billingAddress: {
        contactName: cart.user.name + " " + cart.user.surname,
        city: cart.user.city,
        country: cart.user.country,
        address: cart.user.address,
        zipCode: cart.user.zipCode
      },
      basketItems: cart.products.map(product, index => {
        return {
          id: String(product._id),
          name: product.name,
          category1: product.category[0],
          category2: product.category[1],
          itemType: _iyzipay.default.BASKET_ITEM_TYPE[product.itemType],
          price: product.price
        };
      })
    };
    let result = await PaymentsThreeDS.initializePayment(data);
    const html = Buffer.from(result === null || result === void 0 ? void 0 : result.threeDsHtmlContent, "base64").toString();
    res.json(result);
  }); //CREATE PAYMENT BY REGİSTERED CARD WITH CARD TOKEN

  router.post("/threeds/payments/:cartId/with-registered-card-token", _Session.default, async (req, res) => {
    var _req$params7, _req$params8;

    const {
      cardToken
    } = req.body;

    if (!cardToken) {
      throw new _ApiError.default("cardToken is required", 400, "cardTokenRequired");
    }

    if (!req.user.cardUserKey) {
      throw new _ApiError.default("Card user key is required", 400, "cardUserKeyRequired");
    }

    const card = {
      cardToken,
      cardUserKey: req.user.cardUserKey
    };

    if (!((_req$params7 = req.params) !== null && _req$params7 !== void 0 && _req$params7.cartId)) {
      throw new _ApiError.default("Cart id is required", 400, "cartIdRequired");
    }

    const cart = await _carts.default.findOne({
      _id: (_req$params8 = req.params) === null || _req$params8 === void 0 ? void 0 : _req$params8.cartId
    }).populate("buyer").populate("products");

    if (!cart) {
      throw new _ApiError.default("Cart not found", 404, "cartNotFound");
    }

    if (cart !== null && cart !== void 0 && cart.completed) {
      throw new _ApiError.default("Cart is completed", 400, "cartCompleted");
    }

    if (req.user.cardUserKey) {
      card.userKey = req.user.cardUserKey;
    }

    const paidPrice = cart.products.map(product => product.price).reduce((a, b) => a + b, 0);
    const data = {
      locale: req.user.locale,
      conversationId: (0, _nanoid.default)(),
      price: paidPrice,
      paidPrice: paidPrice,
      currency: _iyzipay.default.CURRENCY.TRY,
      installments: "1",
      basketId: cart._id,
      paymentChannel: _iyzipay.default.PAYMENT_CHANNEL.WEB,
      paymentGroup: _iyzipay.default.PAYMENT_GROUP.PRODUCT,
      callbackUrl: `${process.env.END_POINT}/threeds/payments/complete`,
      paymentCard: card,
      buyer: {
        id: String(cart.user._id),
        name: cart.user.name,
        surname: cart.user.surname,
        email: cart.user.email,
        gsmNumber: cart.user.phoneNumber,
        identityNumber: cart.user.identityNumber,
        lastLoginDate: (0, _moment.default)(req.user.updatedAt).format("YYYY-MM-DD HH:mm:ss"),
        registrationDate: (0, _moment.default)(req.user.createdAt).format("YYYY-MM-DD HH:mm:ss"),
        registrationAddress: cart.user.address,
        ip: req.user.ip,
        city: cart.user.city,
        country: cart.user.country,
        zipCode: cart.user.zipCode
      },
      shippingAddress: {
        contactName: cart.user.name + " " + cart.user.surname,
        city: cart.user.city,
        country: cart.user.country,
        address: cart.user.address,
        zipCode: cart.user.zipCode
      },
      billingAddress: {
        contactName: cart.user.name + " " + cart.user.surname,
        city: cart.user.city,
        country: cart.user.country,
        address: cart.user.address,
        zipCode: cart.user.zipCode
      },
      basketItems: cart.products.map(product, index => {
        return {
          id: String(product._id),
          name: product.name,
          category1: product.category[0],
          category2: product.category[1],
          itemType: _iyzipay.default.BASKET_ITEM_TYPE[product.itemType],
          price: product.price
        };
      })
    };
    let result = await PaymentsThreeDS.initializePayment(data);
    const html = Buffer.from(result === null || result === void 0 ? void 0 : result.threeDsHtmlContent, "base64").toString();
    res.json(result);
  });
};

exports.default = _default;