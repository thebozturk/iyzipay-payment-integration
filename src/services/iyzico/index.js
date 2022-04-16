import Iyzipay from "iyzipay";
import * as Cards from "./methods/cards.js";
import nanoid from "../../utils/nanoid.js";
import * as Logs from "../../utils/logs.js";
import * as Payments from "./methods/payments.js";
import * as Installments from "./methods/installments.js";
import * as PaymentsThreeDS from "./methods/threeds-payments.js";
import * as CancelPayments from "./methods/cancel-payments.js";
import * as Checkout from "./methods/checkout.js";
import * as RefundPayments from "./methods/refund-payments.js";

//Create card and user
const createUserAndCards = () => {
  Cards.createUserCard({
    locale: Iyzipay.LOCALE.TR,
    //The id to be used when communicating with Iyzipay
    conversationId: nanoid(),
    email: "bugrahan@email.com",
    externalId: nanoid(),
    // test card details from iyzipay
    card: {
      cardAlias: "My Credit Card",
      cardHolderName: "John Doe",
      cardNumber: "5528790000000008",
      expireMonth: "12",
      expireYear: "2030",
      cvc: "123",
      registerCard: 0,
    },
  })
    .then((res) => {
      console.log(res);
      Logs.logFile("Create cards user and card", res);
    })
    .catch((err) => {
      console.log(err);
      Logs.logFile("Create cards user and card", err);
    });
};

// createUserAndCards()

const createACardForAUser = () => {
  Cards.createUserCard({
    locale: Iyzipay.LOCALE.TR,
    conversationId: nanoid(),
    email: "bugrahan@email.com",
    externalId: nanoid(),
    cardUserKey: "WD8Z6Acu/IhVkLtQCoBlfLUy99Q=",
    card: {
      cardAlias: "My Credit Card",
      cardHolderName: "John Doe",
      cardNumber: "5528790000000008",
      expireMonth: "12",
      expireYear: "2030",
      cvc: "123",
      registerCard: 0,
    },
  })
    .then((res) => {
      console.log(res);
      Logs.logFile("Create second card for a user", res);
    })
    .catch((err) => {
      console.log(err);
      Logs.logFile("Create second card for a user", err);
    });
};

// createACardForAUser()

// read a user's cards
const readCardsOfAUser = () => {
  Cards.getUserCard({
    locale: Iyzipay.LOCALE.TR,
    conversationId: nanoid(),
    cardUserKey: "WD8Z6Acu/IhVkLtQCoBlfLUy99Q=",
  })
    .then((res) => {
      console.log(res);
      Logs.logFile("Read Cards Of A User", res);
    })
    .catch((err) => {
      console.log(err);
      Logs.logFile("Read Cards Of A User", err);
    });
};
readCardsOfAUser();

//delete a user's card
const deleteCardOfAUser = () => {
  Cards.deleteUserCard({
    locale: Iyzipay.LOCALE.TR,
    conversationId: nanoid(),
    cardUserKey: "WD8Z6Acu/IhVkLtQCoBlfLUy99Q=",
    cardToken: "e9L7NHbzMhyrbOWqv4gW+STbLao=",
  })
    .then((res) => {
      console.log(res);
      Logs.logFile("Delete Cards Of A User", res);
    })
    .catch((err) => {
      console.log(err);
      Logs.logFile("Delete Cards Of A User", err);
    });
};
// deleteCardOfAUser()

//INSTALLMENTS

// create a installment plan
const checkInstallment = () => {
  Installments.checkInstallment({
    locale: Iyzipay.LOCALE.TR,
    conversationId: nanoid(),
    binNumber: "552879",
    price: 100,
  })
    .then((res) => {
      console.log(res);
      Logs.logFile("Create Installment Plan", res);
    })
    .catch((err) => {
      console.log(err);
      Logs.logFile("Create Installment Plan", err);
    });
};

// checkInstallment()

//NORMAL PAYMENTS

// create a payment without a card and save card

const createPayment = () => {
  return Payments.createPayment({
    locale: Iyzipay.LOCALE.TR,
    conversationId: nanoid(),
    price: 100.0,
    paidPrice: 100.0,
    installment: 1,
    currency: "Iyzipay.CURRENCY.TRY",
    basketId: nanoid(),
    paymentChannel: "Iyzipay.PAYMENT_CHANNEL.WEB",
    paymentGroup: "Iyzipay.PAYMENT_GROUP.LISTING",
    paymentCard: {
      cardHolderName: "John Doe",
      cardNumber: "5528790000000008",
      expireMonth: "12",
      expireYear: "2030",
      cvc: "123",
      registerCard: 0,
    },
    buyer: {
      id: nanoid(),
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
      ip: "13.53.34.223",
    },
    billingAddress: {
      address: "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1",
      zipCode: "34742",
      contactName: "Jane Doe",
      city: "Istanbul",
      country: "Turkey",
      phone: "+905350000000",
    },
    shippingAddress: {
      address: "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1",
      zipCode: "34742",
      contactName: "Jane Doe",
      city: "Istanbul",
      country: "Turkey",
      phone: "+905350000000",
    },
    basketItems: [
      {
        id: nanoid(),
        name: "Binocular",
        category1: "Collectibles",
        category2: "Accessories",
        itemType: "Iyzipay.BASKET_ITEM_TYPE.PHYSICAL",
        price: 50.0,
      },
      {
        id: nanoid(),
        name: "Game code",
        category1: "Game",
        category2: "Online Game Items",
        itemType: "Iyzipay.BASKET_ITEM_TYPE.VIRTUAL",
        price: 50.0,
      },
    ],
  })
    .then((res) => {
      console.log(res);
      Logs.logFile("Create Payment", res);
    })
    .catch((err) => {
      console.log(err);
      Logs.logFile("Create Payment", err);
    });
};
// createPayment()

const createPaymentAndSaveCard = () => {
  return Payments.createPayment({
    locale: Iyzipay.LOCALE.TR,
    conversationId: nanoid(),
    price: 100.0,
    paidPrice: 100.0,
    installment: 1,
    currency: "TRY",
    basketId: nanoid(),
    paymentChannel: "WEB",
    paymentGroup: "LISTING",
    callbackUrl: "https://localhost/api/payment/3ds/complete",
    paymentCard: {
      cardUserKey: "WD8Z6Acu/IhVkLtQCoBlfLUy99Q=",
      cardToken: "eMe8zFprq8IKY2vLCiPLnUsXELo=",
    },
    buyer: {
      id: nanoid(),
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
      ip: "13.53.34.223",
    },
    billingAddress: {
      address: "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1",
      zipCode: "34742",
      contactName: "Jane Doe",
      city: "Istanbul",
      country: "Turkey",
      phone: "+905350000000",
    },
    shippingAddress: {
      address: "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1",
      zipCode: "34742",
      contactName: "Jane Doe",
      city: "Istanbul",
      country: "Turkey",
      phone: "+905350000000",
    },
    basketItems: [
      {
        id: nanoid(),
        name: "Binocular",
        category1: "Collectibles",
        category2: "Accessories",
        itemType: "PHYSICAL",
        price: 50.0,
      },
      {
        id: nanoid(),
        name: "Game code",
        category1: "Game",
        category2: "Online Game Items",
        itemType: "VIRTUAL",
        price: 50.0,
      },
    ],
  })
    .then((res) => {
      console.log(res);
      Logs.logFile("Create Payment and save card", res);
    })
    .catch((err) => {
      console.log(err);
      Logs.logFile("Create Payment and save card", err);
    });
};
// createPaymentAndSaveCard()

const createPaymentWithSavedCard = () => {
  return Payments.createPayment({
    locale: Iyzipay.LOCALE.TR,
    conversationId: nanoid(),
    price: 100.0,
    paidPrice: 100.0,
    installment: 1,
    currency: "TRY",
    basketId: nanoid(),
    paymentChannel: "WEB",
    paymentGroup: "LISTING",
    callbackUrl: "https://localhost/api/payment/3ds/complete",
    paymentCard: {
      cardUserKey: "WD8Z6Acu/IhVkLtQCoBlfLUy99Q=",
      cardToken: "eMe8zFprq8IKY2vLCiPLnUsXELo=",
    },
    buyer: {
      id: nanoid(),
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
      ip: "13.53.34.223",
    },
    billingAddress: {
      address: "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1",
      zipCode: "34742",
      contactName: "Jane Doe",
      city: "Istanbul",
      country: "Turkey",
      phone: "+905350000000",
    },
    shippingAddress: {
      address: "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1",
      zipCode: "34742",
      contactName: "Jane Doe",
      city: "Istanbul",
      country: "Turkey",
      phone: "+905350000000",
    },
    basketItems: [
      {
        id: nanoid(),
        name: "Binocular",
        category1: "Collectibles",
        category2: "Accessories",
        itemType: "PHYSICAL",
        price: 50.0,
      },
      {
        id: nanoid(),
        name: "Game code",
        category1: "Game",
        category2: "Online Game Items",
        itemType: "VIRTUAL",
        price: 50.0,
      },
    ],
  })
    .then((res) => {
      console.log(res);
      Logs.logFile("Create Payment with saved card", res);
    })
    .catch((err) => {
      console.log(err);
      Logs.logFile("Create Payment with saved card", err);
    });
};
// createPaymentWithSavedCard()

//3D Secure Payments

export const initializePaymentThreeDS = () => {
  PaymentsThreeDS.initializePayment({
    locale: Iyzipay.LOCALE.TR,
    conversationId: nanoid(),
    price: 100.0,
    paidPrice: 100.0,
    installment: 1,
    currency: "TRY",
    basketId: nanoid(),
    paymentChannel: "WEB",
    paymentGroup: "LISTING",
    callbackUrl: "https://localhost/api/payment/3ds/complete",
    paymentCard: {
      cardUserKey: "WD8Z6Acu/IhVkLtQCoBlfLUy99Q=",
      cardToken: "eMe8zFprq8IKY2vLCiPLnUsXELo=",
    },
    buyer: {
      id: nanoid(),
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
      ip: "13.53.34.223",
    },
    billingAddress: {
      address: "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1",
      zipCode: "34742",
      contactName: "Jane Doe",
      city: "Istanbul",
      country: "Turkey",
      phone: "+905350000000",
    },
    shippingAddress: {
      address: "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1",
      zipCode: "34742",
      contactName: "Jane Doe",
      city: "Istanbul",
      country: "Turkey",
      phone: "+905350000000",
    },
    basketItems: [
      {
        id: nanoid(),
        name: "Binocular",
        category1: "Collectibles",
        category2: "Accessories",
        itemType: "PHYSICAL",
        price: 50.0,
      },
      {
        id: nanoid(),
        name: "Game code",
        category1: "Game",
        category2: "Online Game Items",
        itemType: "VIRTUAL",
        price: 50.0,
      },
    ],
  })
    .then((res) => {
      console.log(res);
      Logs.logFile("Create Payment with 3d payments", res);
    })
    .catch((err) => {
      console.log(err);
      Logs.logFile("Create Payment with 3d payments", err);
    });
};
// initializePaymentThreeDS()

//Complate payment
const completeThreeDSPayment = () => {
  PaymentsThreeDS.completePayment({
    locale: Iyzipay.LOCALE.TR,
    conversationId: nanoid(),
    paymentId: "1",
    conversationId: "conversation data",
  })
    .then((res) => {
      console.log(res);
      Logs.logFile("Complete 3d payments", res);
    })
    .catch((err) => {
      console.log(err);
      Logs.logFile("Complete 3d payments", err);
    });
};
// completeThreeDSPayment()

export const initializePaymentThreeDSWithRegister = () => {
  PaymentsThreeDS.initializePayment({
    locale: Iyzipay.LOCALE.TR,
    conversationId: nanoid(),
    price: 100.0,
    paidPrice: 100.0,
    installment: 1,
    currency: "TRY",
    basketId: nanoid(),
    paymentChannel: "WEB",
    paymentGroup: "LISTING",
    callbackUrl: "https://localhost/api/payment/3ds/complete",
    paymentCard: {
      cardUserKey: "WD8Z6Acu/IhVkLtQCoBlfLUy99Q=",
      cardToken: "e9L7NHbzMhyrbOWqv4gW+STbLao=",
    },
    buyer: {
      id: nanoid(),
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
      ip: "13.53.34.223",
    },
    billingAddress: {
      address: "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1",
      zipCode: "34742",
      contactName: "Jane Doe",
      city: "Istanbul",
      country: "Turkey",
      phone: "+905350000000",
    },
    shippingAddress: {
      address: "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1",
      zipCode: "34742",
      contactName: "Jane Doe",
      city: "Istanbul",
      country: "Turkey",
      phone: "+905350000000",
    },
    basketItems: [
      {
        id: nanoid(),
        name: "Binocular",
        category1: "Collectibles",
        category2: "Accessories",
        itemType: "PHYSICAL",
        price: 50.0,
      },
      {
        id: nanoid(),
        name: "Game code",
        category1: "Game",
        category2: "Online Game Items",
        itemType: "VIRTUAL",
        price: 50.0,
      },
    ],
  })
    .then((res) => {
      console.log(res);
      Logs.logFile("Create 3d Payment with registired card", res);
    })
    .catch((err) => {
      console.log(err);
      Logs.logFile("Create 3d Payment with registired card", err);
    });
};
initializePaymentThreeDSWithRegister();

const initializeThreedsPaymentWithNewCardAndRegisterCard = () => {
  PaymentsThreeDS.initializePayment({
    locale: Iyzipay.LOCALE.TR,
    conversationId: nanoid(),
    price: 100.0,
    paidPrice: 100.0,
    installment: 1,
    currency: "TRY",
    basketId: nanoid(),
    paymentChannel: "WEB",
    paymentGroup: "LISTING",
    callbackUrl: "https://localhost/api/payment/3ds/complete",
    paymentCard: {
      cardUserKey: "WD8Z6Acu/IhVkLtQCoBlfLUy99Q=",
      cardToken: "e9L7NHbzMhyrbOWqv4gW+STbLao=",
    },
    buyer: {
      id: nanoid(),
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
      ip: "13.53.34.223",
    },
    billingAddress: {
      address: "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1",
      zipCode: "34742",
      contactName: "Jane Doe",
      city: "Istanbul",
      country: "Turkey",
      phone: "+905350000000",
    },
    shippingAddress: {
      address: "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1",
      zipCode: "34742",
      contactName: "Jane Doe",
      city: "Istanbul",
      country: "Turkey",
      phone: "+905350000000",
    },
    basketItems: [
      {
        id: nanoid(),
        name: "Binocular",
        category1: "Collectibles",
        category2: "Accessories",
        itemType: "PHYSICAL",
        price: 50.0,
      },
      {
        id: nanoid(),
        name: "Game code",
        category1: "Game",
        category2: "Online Game Items",
        itemType: "VIRTUAL",
        price: 50.0,
      },
    ],
  })
    .then((res) => {
      console.log(res);
      Logs.logFile("Create 3d Payment with registired card", res);
    })
    .catch((err) => {
      console.log(err);
      Logs.logFile("Create 3d Payment with registired card", err);
    });
};
// initializeThreedsPaymentWithNewCardAndRegisterCard()

const initializeCheckoutForm = () => {
  Checkout.initialize({
    locale: Iyzipay.LOCALE.TR,
    conversationId: nanoid(),
    price: 100.0,
    paidPrice: 100.0,
    installment: 1,
    currency: "TRY",
    basketId: nanoid(),
    paymentChannel: "WEB",
    paymentGroup: "LISTING",
    callbackUrl: "https://localhost/api/payment/3ds/complete/payment",
    cardUserKey: "WD8Z6Acu/IhVkLtQCoBlfLUy99Q=",
    cardToken: "e9L7NHbzMhyrbOWqv4gW+STbLao=",
    buyer: {
      id: nanoid(),
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
      ip: "13.53.34.223",
    },
    billingAddress: {
      address: "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1",
      zipCode: "34742",
      contactName: "Jane Doe",
      city: "Istanbul",
      country: "Turkey",
      phone: "+905350000000",
    },
    shippingAddress: {
      address: "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1",
      zipCode: "34742",
      contactName: "Jane Doe",
      city: "Istanbul",
      country: "Turkey",
      phone: "+905350000000",
    },
    basketItems: [
      {
        id: nanoid(),
        name: "Binocular",
        category1: "Collectibles",
        category2: "Accessories",
        itemType: "PHYSICAL",
        price: 50.0,
      },
      {
        id: nanoid(),
        name: "Game code",
        category1: "Game",
        category2: "Online Game Items",
        itemType: "VIRTUAL",
        price: 50.0,
      },
    ],
  })
    .then((res) => {
      console.log(res);
      Logs.logFile("checkout-form-payments", res);
    })
    .catch((err) => {
      console.log(err);
      Logs.logFile("checkout-form-payments", err);
    });
};
// initializeCheckoutForm()

const getFormPayment = () => {
  Checkout.getFormPayment({
    locale: Iyzipay.LOCALE.TR,
    conversationId: nanoid(),
    token:'',
  }).then((res) => {
    console.log(res);
    Logs.logFile("get-form-payment", res);
  }).catch((err) => {
    console.log(err);
    Logs.logFile("checkout-form-payments", err);
  });
};
// getFormPayment()


//CANCEL PAYMENTS

const cancelPayment = () => {
    CancelPayments.cancelPayment({
        locale: Iyzipay.LOCALE.TR,
        conversationId: nanoid(),
        paymentId: '1',
        ip:'85.34.78.112',
        reason:'REFUND.REASON.BUYER_REQUEST',
    }).then((res) => {
        console.log(res);
        Logs.logFile("cancel-payment", res);
    }).catch((err) => {
        console.log(err);
        Logs.logFile("cancel-payment", err);
    });
}
// cancelPayment()

//Refund Payments
const refundPayments = () => {
    RefundPayments.refundPayments({
        locale: Iyzipay.LOCALE.TR,
        conversationId: nanoid(),
        paymentTransaction:'18283356',
        price:100.0,
        currency:'TRY',
        paymentId: '1',
        ip:'85.34.78.112'
}).then((res) => {
    console.log(res);
    Logs.logFile("refund-payment", res);
}).catch((err) => {
    console.log(err);
    Logs.logFile("refund-payment", err);
    
})
}
// refundPayments()

const refundPaymentWithReason = () => {
    RefundPayments.refundPaymentWithReason({
        locale: Iyzipay.LOCALE.TR,
        conversationId: nanoid(),
        paymentTransaction:'18283356',
        price:100.0,
        currency:'TRY',
        paymentId: '1',
        ip:'',
        reason:'REFUND.REASON.BUYER_REQUEST'
}).then((res) => {
    console.log(res);
    Logs.logFile("refund-payment-with-reason", res);
}).catch((err) => {
    console.log(err);
    Logs.logFile("refund-payment-with-reason", err);
})
}
refundPaymentWithReason()