"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _nanoid = require("nanoid");

const nanoid = (0, _nanoid.customAlphabet)('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 20);
const id = nanoid();
var _default = nanoid;
exports.default = _default;