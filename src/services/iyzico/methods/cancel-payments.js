import iyzipay from "../connection/iyzipay.js";

export const cancelPayments = (data) => {
    return new Promise((resolve, reject) => {
        iyzipay.cancel.create(data, (err, res) => {
        if (err) {
            reject(err);
        } else {
            resolve(res);
        }
        });
    });
}