"use strict";

require("express-async-errors");

var _dotenv = _interopRequireDefault(require("dotenv"));

var _config = _interopRequireDefault(require("./config.js"));

var _express = _interopRequireDefault(require("express"));

var _morgan = _interopRequireDefault(require("morgan"));

var _https = _interopRequireDefault(require("https"));

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _GenericErrorHandler = _interopRequireDefault(require("./middlewares/GenericErrorHandler.js"));

var _ApiError = _interopRequireDefault(require("./error/ApiError.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const envPath = _config.default !== null && _config.default !== void 0 && _config.default.production ? "./env/.prod" : "./env/.dev";

_dotenv.default.config({
  path: envPath
});

const app = (0, _express.default)();
app.use((0, _morgan.default)(process.env.logger));
app.use('/', (req, res) => {
  throw new _ApiError.default('This is a test error', 500, 'test');
  res.json({
    message: 'Hello World'
  });
});
app.use(_GenericErrorHandler.default);
app.use(_express.default.json({
  limit: '1mb'
}));
app.use(_express.default.urlencoded({
  extended: true
}));

if (process.env.HTTPS_ENABLED === 'true') {
  const key = _fs.default.readFileSync(_path.default.join(__dirname, './certs/key.pem'), 'utf8').toString();

  const cert = _fs.default.readFileSync(_path.default.join(__dirname, './certs/cert.pem'), 'utf8').toString();

  _https.default.createServer({
    key: key,
    cert: cert
  }, app).listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`);
  });
} else {
  app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
}