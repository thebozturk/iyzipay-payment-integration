"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ApiError = _interopRequireDefault(require("../error/ApiError"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * It takes an error object, and returns a JSON object with the error's status, message, and code
 * @param err - The error object that was thrown.
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next middleware function in the stack.
 */
const GenericErrorHandler = (err, req, res, next) => {
  if (!err instanceof _ApiError.default) {
    console.error(err);
  }

  if (/\w+ validation failed: \w+/i.test(err.message)) {
    err.message = err.message.replace(/\w+ validation failed: /i, '');
  }

  res.status(err.status || 500).json({
    status: err === null || err === void 0 ? void 0 : err.status,
    error: err === null || err === void 0 ? void 0 : err.message,
    err: err.code
  });
};

var _default = GenericErrorHandler;
exports.default = _default;