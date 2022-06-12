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

var Checkout = _interopRequireWildcard(require("../services/iyzico/methods/checkout.js"));

var Cards = _interopRequireWildcard(require("../services/iyzico/methods/cards.js"));

var _nanoid = _interopRequireDefault(require("../utils/nanoid.js"));

var _payment = require("../utils/payment.js");

var Payments = _interopRequireWildcard(require("../services/iyzico/methods/payments.js"));

var PaymentsThreeDS = _interopRequireWildcard(require("../services/iyzico/methods/threeds-payments.js"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = router => {
  //CHECKOUT FORM COMPLATE PAYMENT
  router.post("/checkout/complate/payment", async (req, res, next) => {
    let result = await Checkout.getFormPayment({
      locale: 'tr',
      conversationId: (0, _nanoid.default)(),
      token: req.body.token
    });
    await (0, _payment.CompletePayment)(result);
    res.json(result);
  }); //CHECKOUT FORM INITIALIZE

  router.post("/checkout/:cartId", async (req, res, next) => {
    var _req$params, _req$params2, _req$user;

    if (!req.user.cardUserKey) {
      throw new _ApiError.default("Card user key is required", 400, "cardUserKeyRequired");
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
      enabledInstallments: [1, 2, 3, 6, 9],
      paymentGroup: _iyzipay.default.PAYMENT_GROUP.PRODUCT,
      callbackUrl: `${process.env.END_POINT}/checkout/complate/payment`,
      ...(((_req$user = req.user) === null || _req$user === void 0 ? void 0 : _req$user.cardUserKey) && {
        cardUserKey: req.user.cardUserKey
      }),
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
    let result = await Checkout.initialize(data);
    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Pay</title>
        <meta charset="UTF-8"/>
        \`${result === null || result === void 0 ? void 0 : result.checkoutFormContent}\`
        </head>
        </html>
        `;
    res.send(html);
  });
};

exports.default = _default;