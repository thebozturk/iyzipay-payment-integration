"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _bcryptjs = _interopRequireDefault(require("bcryptjs"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _users = _interopRequireDefault(require("../db/users.js"));

var _ApiError = _interopRequireDefault(require("../error/ApiError.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = router => {
  router.post('/login', async (req, res) => {
    const {
      email,
      password
    } = req.body;
    const user = await _users.default.findOne({
      email: email
    });

    if (!user) {
      throw new _ApiError.default('Incorrect password or email', 401, 'userOrPasswordIncorrect');
    }

    const passwordConfirmed = await _bcryptjs.default.compare(password, user.password);

    if (passwordConfirmed) {
      const UserJson = user.toJSON();

      const token = _jsonwebtoken.default.sign(UserJson, process.env.JWT_SECRET);

      res.json({
        user: UserJson,
        token: `Bearer ${token}`
      });
    } else {
      throw new _ApiError.default('Incorrect password or email', 401, 'userOrPasswordIncorrect');
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }
  });
};

exports.default = _default;