import iyzipay from "../connection/iyzipay.js";

export const checkInstallment = (data) => {
  return new Promise((resolve, reject) => {
    iyzipay.installmentInfo.retrieve(data, (err, res) => {
      if (err) reject(err);
      resolve(res);
    });
  });
};
