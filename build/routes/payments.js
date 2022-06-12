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

var Payments = _interopRequireWildcard(require("../services/iyzico/methods/payments.js"));

var Cards = _interopRequireWildcard(require("../services/iyzico/methods/cards.js"));

var _nanoid = _interopRequireDefault(require("../utils/nanoid.js"));

var _payment = require("../utils/payment.js");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = router => {
  // Create a new payment with new card and not save card
  router.post("/payments/:cartId/with-new-card", _Session.default, async (req, res) => {
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
      paymentCard: card,
      buyer: {
        id: String(cart.user._id),
        name: cart.user.name,
        surname: cart.user.surname,
        gsmNumber: cart.user.phoneNumber,
        email: cart.user.email,
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
    let result = await Payments.createPayment(data);
    await (0, _payment.CompletePayment)(result);
    res.json(result);
  }); // Create a new payment with new card and save card

  router.post("/payments/:cartId/with-new-card/register-card", _Session.default, async (req, res) => {
    var _req$params3, _req$params4, _req$user, _req$user3;

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

    if ((_req$user = req.user) !== null && _req$user !== void 0 && _req$user.cardUserKey) {
      var _req$user2;

      card.cardUserKey = (_req$user2 = req.user) === null || _req$user2 === void 0 ? void 0 : _req$user2.cardUserKey;
    }

    card.registerCard = "1";
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
      paymentCard: card,
      buyer: {
        id: String(cart.user._id),
        name: cart.user.name,
        surname: cart.user.surname,
        gsmNumber: cart.user.phoneNumber,
        email: cart.user.email,
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
    let result = await Payments.createPayment(data);

    if (!((_req$user3 = req.user) !== null && _req$user3 !== void 0 && _req$user3.cardUserKey)) {
      var _req$user4;

      const user = await _users.default.findOne({
        _id: (_req$user4 = req.user) === null || _req$user4 === void 0 ? void 0 : _req$user4._id
      });
      user.cardUserKey = result.cardUserKey;
      await user.save();
    }

    await (0, _payment.CompletePayment)(result);
    res.json(result);
  }); // Create a new payment with registered card

  router.post("/payments/:cartId/:cardIndex/with-registered-card-index", _Session.default, async (req, res) => {
    var _req$user5, _req$params5, _req$params6, _req$user6;

    let {
      cartIndex
    } = req.params;

    if (!cartIndex) {
      throw new _ApiError.default("Cart index is required", 400, "cartIndexRequired");
    }

    if (!((_req$user5 = req.user) !== null && _req$user5 !== void 0 && _req$user5.cardUserKey)) {
      throw new _ApiError.default("No registered card available", 400, "cardUserKeyRequired");
    }

    const cards = await Cards.getUserCard({
      locale: req.user.locale,
      cardUserKey: req.user.cardUserKey,
      conversationId: (0, _nanoid.default)()
    });
    const index = parseInt(cartIndex);

    if (index >= cards.cardDetails.length) {
      throw new _ApiError.default("Card does not exist", 400, "cartIndexNotFound");
    }

    const {
      cardToken
    } = cards.cardDetails[index];

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

    const card = {
      cardToken: cardToken,
      cardUserKey: (_req$user6 = req.user) === null || _req$user6 === void 0 ? void 0 : _req$user6.cardUserKey
    };
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
    let result = await Payments.createPayment(data);
    await (0, _payment.CompletePayment)(result);
    res.json(result);
  }); //Create a new payment with card token

  router.post("/payments/:cartId/with-registered-card-token", _Session.default, async (req, res) => {
    var _req$user7, _req$params7, _req$params8, _req$user8;

    let {
      cardToken
    } = req.body;

    if (!cardToken) {
      throw new _ApiError.default("Cart token is required", 400, "cartTokenRequired");
    }

    if (!((_req$user7 = req.user) !== null && _req$user7 !== void 0 && _req$user7.cardUserKey)) {
      throw new _ApiError.default("No registered card available", 400, "cardUserKeyRequired");
    }

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

    const card = {
      cardToken: cardToken,
      cardUserKey: (_req$user8 = req.user) === null || _req$user8 === void 0 ? void 0 : _req$user8.cardUserKey
    };
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
      paymentCard: card,
      buyer: {
        id: String(cart.user._id),
        name: cart.user.name,
        surname: cart.user.surname,
        gsmNumber: cart.user.phoneNumber,
        email: cart.user.email,
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
    let result = await Payments.createPayment(data);
    await (0, _payment.CompletePayment)(result);
    res.json(result);
  });
};

exports.default = _default;