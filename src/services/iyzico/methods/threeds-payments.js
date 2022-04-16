import iyzipay from "../connection/iyzipay.js";

export const initializePayment = (data, callback) => {
    return new Promise((resolve, reject) => {
        iyzipay.threedsInitialize.create(data, (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        });
    })
}

export const complatePayment = (data, callback) => {
    return new Promise((resolve, reject) => {
        iyzipay.threedsPayment.create(data, (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        });
    })
}