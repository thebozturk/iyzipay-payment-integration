import iyzipay from "../connection/iyzipay.js";

export const initialize = (data) => {
    return new Promise((resolve, reject) => {
        iyzipay.checkoutFormInitialize.create(data, (err, res) => {
        if (err) {
            reject(err);
        } else {
            resolve(res);
        }
        });
    });
}

export const getFormPayment = (data) => {
    return new Promise((resolve, reject) => {
        iyzipay.checkoutFormInitialize.retrieve(data, (err, res) => {
        if (err) {
            reject(err);
        } else {
            resolve(res);
        }
        });
    });
}