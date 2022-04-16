"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initializePaymentThreeDSWithRegister = exports.initializePaymentThreeDS = void 0;

var _iyzipay = _interopRequireDefault(require("iyzipay"));

var Cards = _interopRequireWildcard(require("./methods/cards.js"));

var _nanoid = _interopRequireDefault(require("../../utils/nanoid.js"));

var Logs = _interopRequireWildcard(require("../../utils/logs.js"));

var Payments = _interopRequireWildcard(require("./methods/payments.js"));

var Installments = _interopRequireWildcard(require("./methods/installments.js"));

var PaymentsThreeDS = _interopRequireWildcard(require("./methods/threeds-payments.js"));

var CancelPayments = _interopRequireWildcard(require("./methods/cancel-payments.js"));

var Checkout = _interopRequireWildcard(require("./methods/checkout.js"));

var RefundPayments = _interopRequireWildcard(require("./methods/refund-payments.js"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//Create card and user
const createUserAndCards = () => {
  Cards.createUserCard({
    locale: _iyzipay.default.LOCALE.TR,
    //The id to be used when communicating with Iyzipay
    conversationId: (0, _nanoid.default)(),
    email: "bugrahan@email.com",
    externalId: (0, _nanoid.default)(),
    // test card details from iyzipay
    card: {
      cardAlias: "My Credit Card",
      cardHolderName: "John Doe",
      cardNumber: "5528790000000008",
      expireMonth: "12",
      expireYear: "2030",
      cvc: "123",
      registerCard: 0
    }
  }).then(res => {
    console.log(res);
    Logs.logFile("Create cards user and card", res);
  }).catch(err => {
    console.log(err);
    Logs.logFile("Create cards user and card", err);
  });
}; // createUserAndCards()


const createACardForAUser = () => {
  Cards.createUserCard({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    email: "bugrahan@email.com",
    externalId: (0, _nanoid.default)(),
    cardUserKey: "WD8Z6Acu/IhVkLtQCoBlfLUy99Q=",
    card: {
      cardAlias: "My Credit Card",
      cardHolderName: "John Doe",
      cardNumber: "5528790000000008",
      expireMonth: "12",
      expireYear: "2030",
      cvc: "123",
      registerCard: 0
    }
  }).then(res => {
    console.log(res);
    Logs.logFile("Create second card for a user", res);
  }).catch(err => {
    console.log(err);
    Logs.logFile("Create second card for a user", err);
  });
}; // createACardForAUser()
// read a user's cards


const readCardsOfAUser = () => {
  Cards.getUserCard({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    cardUserKey: "WD8Z6Acu/IhVkLtQCoBlfLUy99Q="
  }).then(res => {
    console.log(res);
    Logs.logFile("Read Cards Of A User", res);
  }).catch(err => {
    console.log(err);
    Logs.logFile("Read Cards Of A User", err);
  });
};

readCardsOfAUser(); //delete a user's card

const deleteCardOfAUser = () => {
  Cards.deleteUserCard({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    cardUserKey: "WD8Z6Acu/IhVkLtQCoBlfLUy99Q=",
    cardToken: "e9L7NHbzMhyrbOWqv4gW+STbLao="
  }).then(res => {
    console.log(res);
    Logs.logFile("Delete Cards Of A User", res);
  }).catch(err => {
    console.log(err);
    Logs.logFile("Delete Cards Of A User", err);
  });
}; // deleteCardOfAUser()
//INSTALLMENTS
// create a installment plan


const checkInstallment = () => {
  Installments.checkInstallment({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    binNumber: "552879",
    price: 100
  }).then(res => {
    console.log(res);
    Logs.logFile("Create Installment Plan", res);
  }).catch(err => {
    console.log(err);
    Logs.logFile("Create Installment Plan", err);
  });
}; // checkInstallment()
//NORMAL PAYMENTS
// create a payment without a card and save card


const createPayment = () => {
  return Payments.createPayment({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    price: 100.0,
    paidPrice: 100.0,
    installment: 1,
    currency: "Iyzipay.CURRENCY.TRY",
    basketId: (0, _nanoid.default)(),
    paymentChannel: "Iyzipay.PAYMENT_CHANNEL.WEB",
    paymentGroup: "Iyzipay.PAYMENT_GROUP.LISTING",
    paymentCard: {
      cardHolderName: "John Doe",
      cardNumber: "5528790000000008",
      expireMonth: "12",
      expireYear: "2030",
      cvc: "123",
      registerCard: 0
    },
    buyer: {
      id: (0, _nanoid.default)(),
      name: "John",
      surname: "Doe",
      identityNumber: "74300864791",
      email: "john@email.com",
      gsmNumber: "+905350000000",
      registrationAddress: "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1",
      city: "Istanbul",
      country: "Turkey",
      zipCode: "34732",
      lastLoginDate: "2015-10-05 12:43:35",
      registrationDate: "2013-04-21 15:12:09",
      ip: "13.53.34.223"
    },
    billingAddress: {
      address: "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1",
      zipCode: "34742",
      contactName: "Jane Doe",
      city: "Istanbul",
      country: "Turkey",
      phone: "+905350000000"
    },
    shippingAddress: {
      address: "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1",
      zipCode: "34742",
      contactName: "Jane Doe",
      city: "Istanbul",
      country: "Turkey",
      phone: "+905350000000"
    },
    basketItems: [{
      id: (0, _nanoid.default)(),
      name: "Binocular",
      category1: "Collectibles",
      category2: "Accessories",
      itemType: "Iyzipay.BASKET_ITEM_TYPE.PHYSICAL",
      price: 50.0
    }, {
      id: (0, _nanoid.default)(),
      name: "Game code",
      category1: "Game",
      category2: "Online Game Items",
      itemType: "Iyzipay.BASKET_ITEM_TYPE.VIRTUAL",
      price: 50.0
    }]
  }).then(res => {
    console.log(res);
    Logs.logFile("Create Payment", res);
  }).catch(err => {
    console.log(err);
    Logs.logFile("Create Payment", err);
  });
}; // createPayment()


const createPaymentAndSaveCard = () => {
  return Payments.createPayment({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    price: 100.0,
    paidPrice: 100.0,
    installment: 1,
    currency: "TRY",
    basketId: (0, _nanoid.default)(),
    paymentChannel: "WEB",
    paymentGroup: "LISTING",
    callbackUrl: "https://localhost/api/payment/3ds/complete",
    paymentCard: {
      cardUserKey: "WD8Z6Acu/IhVkLtQCoBlfLUy99Q=",
      cardToken: "eMe8zFprq8IKY2vLCiPLnUsXELo="
    },
    buyer: {
      id: (0, _nanoid.default)(),
      name: "John",
      surname: "Doe",
      identityNumber: "74300864791",
      email: "john@email.com",
      gsmNumber: "+905350000000",
      registrationAddress: "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1",
      city: "Istanbul",
      country: "Turkey",
      zipCode: "34732",
      lastLoginDate: "2015-10-05 12:43:35",
      registrationDate: "2013-04-21 15:12:09",
      ip: "13.53.34.223"
    },
    billingAddress: {
      address: "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1",
      zipCode: "34742",
      contactName: "Jane Doe",
      city: "Istanbul",
      country: "Turkey",
      phone: "+905350000000"
    },
    shippingAddress: {
      address: "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1",
      zipCode: "34742",
      contactName: "Jane Doe",
      city: "Istanbul",
      country: "Turkey",
      phone: "+905350000000"
    },
    basketItems: [{
      id: (0, _nanoid.default)(),
      name: "Binocular",
      category1: "Collectibles",
      category2: "Accessories",
      itemType: "PHYSICAL",
      price: 50.0
    }, {
      id: (0, _nanoid.default)(),
      name: "Game code",
      category1: "Game",
      category2: "Online Game Items",
      itemType: "VIRTUAL",
      price: 50.0
    }]
  }).then(res => {
    console.log(res);
    Logs.logFile("Create Payment and save card", res);
  }).catch(err => {
    console.log(err);
    Logs.logFile("Create Payment and save card", err);
  });
}; // createPaymentAndSaveCard()


const createPaymentWithSavedCard = () => {
  return Payments.createPayment({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    price: 100.0,
    paidPrice: 100.0,
    installment: 1,
    currency: "TRY",
    basketId: (0, _nanoid.default)(),
    paymentChannel: "WEB",
    paymentGroup: "LISTING",
    callbackUrl: "https://localhost/api/payment/3ds/complete",
    paymentCard: {
      cardUserKey: "WD8Z6Acu/IhVkLtQCoBlfLUy99Q=",
      cardToken: "eMe8zFprq8IKY2vLCiPLnUsXELo="
    },
    buyer: {
      id: (0, _nanoid.default)(),
      name: "John",
      surname: "Doe",
      identityNumber: "74300864791",
      email: "john@email.com",
      gsmNumber: "+905350000000",
      registrationAddress: "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1",
      city: "Istanbul",
      country: "Turkey",
      zipCode: "34732",
      lastLoginDate: "2015-10-05 12:43:35",
      registrationDate: "2013-04-21 15:12:09",
      ip: "13.53.34.223"
    },
    billingAddress: {
      address: "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1",
      zipCode: "34742",
      contactName: "Jane Doe",
      city: "Istanbul",
      country: "Turkey",
      phone: "+905350000000"
    },
    shippingAddress: {
      address: "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1",
      zipCode: "34742",
      contactName: "Jane Doe",
      city: "Istanbul",
      country: "Turkey",
      phone: "+905350000000"
    },
    basketItems: [{
      id: (0, _nanoid.default)(),
      name: "Binocular",
      category1: "Collectibles",
      category2: "Accessories",
      itemType: "PHYSICAL",
      price: 50.0
    }, {
      id: (0, _nanoid.default)(),
      name: "Game code",
      category1: "Game",
      category2: "Online Game Items",
      itemType: "VIRTUAL",
      price: 50.0
    }]
  }).then(res => {
    console.log(res);
    Logs.logFile("Create Payment with saved card", res);
  }).catch(err => {
    console.log(err);
    Logs.logFile("Create Payment with saved card", err);
  });
}; // createPaymentWithSavedCard()
//3D Secure Payments


const initializePaymentThreeDS = () => {
  PaymentsThreeDS.initializePayment({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    price: 100.0,
    paidPrice: 100.0,
    installment: 1,
    currency: "TRY",
    basketId: (0, _nanoid.default)(),
    paymentChannel: "WEB",
    paymentGroup: "LISTING",
    callbackUrl: "https://localhost/api/payment/3ds/complete",
    paymentCard: {
      cardUserKey: "WD8Z6Acu/IhVkLtQCoBlfLUy99Q=",
      cardToken: "eMe8zFprq8IKY2vLCiPLnUsXELo="
    },
    buyer: {
      id: (0, _nanoid.default)(),
      name: "John",
      surname: "Doe",
      identityNumber: "74300864791",
      email: "john@email.com",
      gsmNumber: "+905350000000",
      registrationAddress: "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1",
      city: "Istanbul",
      country: "Turkey",
      zipCode: "34732",
      lastLoginDate: "2015-10-05 12:43:35",
      registrationDate: "2013-04-21 15:12:09",
      ip: "13.53.34.223"
    },
    billingAddress: {
      address: "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1",
      zipCode: "34742",
      contactName: "Jane Doe",
      city: "Istanbul",
      country: "Turkey",
      phone: "+905350000000"
    },
    shippingAddress: {
      address: "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1",
      zipCode: "34742",
      contactName: "Jane Doe",
      city: "Istanbul",
      country: "Turkey",
      phone: "+905350000000"
    },
    basketItems: [{
      id: (0, _nanoid.default)(),
      name: "Binocular",
      category1: "Collectibles",
      category2: "Accessories",
      itemType: "PHYSICAL",
      price: 50.0
    }, {
      id: (0, _nanoid.default)(),
      name: "Game code",
      category1: "Game",
      category2: "Online Game Items",
      itemType: "VIRTUAL",
      price: 50.0
    }]
  }).then(res => {
    console.log(res);
    Logs.logFile("Create Payment with 3d payments", res);
  }).catch(err => {
    console.log(err);
    Logs.logFile("Create Payment with 3d payments", err);
  });
}; // initializePaymentThreeDS()
//Complate payment


exports.initializePaymentThreeDS = initializePaymentThreeDS;

const completeThreeDSPayment = () => {
  PaymentsThreeDS.completePayment({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    paymentId: "1",
    conversationId: "conversation data"
  }).then(res => {
    console.log(res);
    Logs.logFile("Complete 3d payments", res);
  }).catch(err => {
    console.log(err);
    Logs.logFile("Complete 3d payments", err);
  });
}; // completeThreeDSPayment()


const initializePaymentThreeDSWithRegister = () => {
  PaymentsThreeDS.initializePayment({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    price: 100.0,
    paidPrice: 100.0,
    installment: 1,
    currency: "TRY",
    basketId: (0, _nanoid.default)(),
    paymentChannel: "WEB",
    paymentGroup: "LISTING",
    callbackUrl: "https://localhost/api/payment/3ds/complete",
    paymentCard: {
      cardUserKey: "WD8Z6Acu/IhVkLtQCoBlfLUy99Q=",
      cardToken: "e9L7NHbzMhyrbOWqv4gW+STbLao="
    },
    buyer: {
      id: (0, _nanoid.default)(),
      name: "John",
      surname: "Doe",
      identityNumber: "74300864791",
      email: "john@email.com",
      gsmNumber: "+905350000000",
      registrationAddress: "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1",
      city: "Istanbul",
      country: "Turkey",
      zipCode: "34732",
      lastLoginDate: "2015-10-05 12:43:35",
      registrationDate: "2013-04-21 15:12:09",
      ip: "13.53.34.223"
    },
    billingAddress: {
      address: "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1",
      zipCode: "34742",
      contactName: "Jane Doe",
      city: "Istanbul",
      country: "Turkey",
      phone: "+905350000000"
    },
    shippingAddress: {
      address: "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1",
      zipCode: "34742",
      contactName: "Jane Doe",
      city: "Istanbul",
      country: "Turkey",
      phone: "+905350000000"
    },
    basketItems: [{
      id: (0, _nanoid.default)(),
      name: "Binocular",
      category1: "Collectibles",
      category2: "Accessories",
      itemType: "PHYSICAL",
      price: 50.0
    }, {
      id: (0, _nanoid.default)(),
      name: "Game code",
      category1: "Game",
      category2: "Online Game Items",
      itemType: "VIRTUAL",
      price: 50.0
    }]
  }).then(res => {
    console.log(res);
    Logs.logFile("Create 3d Payment with registired card", res);
  }).catch(err => {
    console.log(err);
    Logs.logFile("Create 3d Payment with registired card", err);
  });
};

exports.initializePaymentThreeDSWithRegister = initializePaymentThreeDSWithRegister;
initializePaymentThreeDSWithRegister();

const initializeThreedsPaymentWithNewCardAndRegisterCard = () => {
  PaymentsThreeDS.initializePayment({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    price: 100.0,
    paidPrice: 100.0,
    installment: 1,
    currency: "TRY",
    basketId: (0, _nanoid.default)(),
    paymentChannel: "WEB",
    paymentGroup: "LISTING",
    callbackUrl: "https://localhost/api/payment/3ds/complete",
    paymentCard: {
      cardUserKey: "WD8Z6Acu/IhVkLtQCoBlfLUy99Q=",
      cardToken: "e9L7NHbzMhyrbOWqv4gW+STbLao="
    },
    buyer: {
      id: (0, _nanoid.default)(),
      name: "John",
      surname: "Doe",
      identityNumber: "74300864791",
      email: "john@email.com",
      gsmNumber: "+905350000000",
      registrationAddress: "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1",
      city: "Istanbul",
      country: "Turkey",
      zipCode: "34732",
      lastLoginDate: "2015-10-05 12:43:35",
      registrationDate: "2013-04-21 15:12:09",
      ip: "13.53.34.223"
    },
    billingAddress: {
      address: "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1",
      zipCode: "34742",
      contactName: "Jane Doe",
      city: "Istanbul",
      country: "Turkey",
      phone: "+905350000000"
    },
    shippingAddress: {
      address: "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1",
      zipCode: "34742",
      contactName: "Jane Doe",
      city: "Istanbul",
      country: "Turkey",
      phone: "+905350000000"
    },
    basketItems: [{
      id: (0, _nanoid.default)(),
      name: "Binocular",
      category1: "Collectibles",
      category2: "Accessories",
      itemType: "PHYSICAL",
      price: 50.0
    }, {
      id: (0, _nanoid.default)(),
      name: "Game code",
      category1: "Game",
      category2: "Online Game Items",
      itemType: "VIRTUAL",
      price: 50.0
    }]
  }).then(res => {
    console.log(res);
    Logs.logFile("Create 3d Payment with registired card", res);
  }).catch(err => {
    console.log(err);
    Logs.logFile("Create 3d Payment with registired card", err);
  });
}; // initializeThreedsPaymentWithNewCardAndRegisterCard()


const initializeCheckoutForm = () => {
  Checkout.initialize({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    price: 100.0,
    paidPrice: 100.0,
    installment: 1,
    currency: "TRY",
    basketId: (0, _nanoid.default)(),
    paymentChannel: "WEB",
    paymentGroup: "LISTING",
    callbackUrl: "https://localhost/api/payment/3ds/complete/payment",
    cardUserKey: "WD8Z6Acu/IhVkLtQCoBlfLUy99Q=",
    cardToken: "e9L7NHbzMhyrbOWqv4gW+STbLao=",
    buyer: {
      id: (0, _nanoid.default)(),
      name: "John",
      surname: "Doe",
      identityNumber: "74300864791",
      email: "john@email.com",
      gsmNumber: "+905350000000",
      registrationAddress: "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1",
      city: "Istanbul",
      country: "Turkey",
      zipCode: "34732",
      lastLoginDate: "2015-10-05 12:43:35",
      registrationDate: "2013-04-21 15:12:09",
      ip: "13.53.34.223"
    },
    billingAddress: {
      address: "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1",
      zipCode: "34742",
      contactName: "Jane Doe",
      city: "Istanbul",
      country: "Turkey",
      phone: "+905350000000"
    },
    shippingAddress: {
      address: "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1",
      zipCode: "34742",
      contactName: "Jane Doe",
      city: "Istanbul",
      country: "Turkey",
      phone: "+905350000000"
    },
    basketItems: [{
      id: (0, _nanoid.default)(),
      name: "Binocular",
      category1: "Collectibles",
      category2: "Accessories",
      itemType: "PHYSICAL",
      price: 50.0
    }, {
      id: (0, _nanoid.default)(),
      name: "Game code",
      category1: "Game",
      category2: "Online Game Items",
      itemType: "VIRTUAL",
      price: 50.0
    }]
  }).then(res => {
    console.log(res);
    Logs.logFile("checkout-form-payments", res);
  }).catch(err => {
    console.log(err);
    Logs.logFile("checkout-form-payments", err);
  });
}; // initializeCheckoutForm()


const getFormPayment = () => {
  Checkout.getFormPayment({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    token: ''
  }).then(res => {
    console.log(res);
    Logs.logFile("get-form-payment", res);
  }).catch(err => {
    console.log(err);
    Logs.logFile("checkout-form-payments", err);
  });
}; // getFormPayment()
//CANCEL PAYMENTS


const cancelPayment = () => {
  CancelPayments.cancelPayment({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    paymentId: '1',
    ip: '85.34.78.112',
    reason: 'REFUND.REASON.BUYER_REQUEST'
  }).then(res => {
    console.log(res);
    Logs.logFile("cancel-payment", res);
  }).catch(err => {
    console.log(err);
    Logs.logFile("cancel-payment", err);
  });
}; // cancelPayment()
//Refund Payments


const refundPayments = () => {
  RefundPayments.refundPayments({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    paymentTransaction: '18283356',
    price: 100.0,
    currency: 'TRY',
    paymentId: '1',
    ip: '85.34.78.112'
  }).then(res => {
    console.log(res);
    Logs.logFile("refund-payment", res);
  }).catch(err => {
    console.log(err);
    Logs.logFile("refund-payment", err);
  });
}; // refundPayments()


const refundPaymentWithReason = () => {
  RefundPayments.refundPaymentWithReason({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    paymentTransaction: '18283356',
    price: 100.0,
    currency: 'TRY',
    paymentId: '1',
    ip: '',
    reason: 'REFUND.REASON.BUYER_REQUEST'
  }).then(res => {
    console.log(res);
    Logs.logFile("refund-payment-with-reason", res);
  }).catch(err => {
    console.log(err);
    Logs.logFile("refund-payment-with-reason", err);
  });
};

refundPaymentWithReason();