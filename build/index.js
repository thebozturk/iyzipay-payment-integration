"use strict";

require("express-async-errors");

var _dotenv = _interopRequireDefault(require("dotenv"));

var _config = _interopRequireDefault(require("./config.js"));

var _express = _interopRequireDefault(require("express"));

var _morgan = _interopRequireDefault(require("morgan"));

var _https = _interopRequireDefault(require("https"));

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _helmet = _interopRequireDefault(require("helmet"));

var _cors = _interopRequireDefault(require("cors"));

var _GenericErrorHandler = _interopRequireDefault(require("./middlewares/GenericErrorHandler.js"));

var _ApiError = _interopRequireDefault(require("./error/ApiError.js"));

var _index = _interopRequireDefault(require("./db/index.js"));

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* Checking if the config.production variable is set to true. If it is, it will load the .prod file in
the env folder. If it is not, it will load the .dev file in the env folder. */
const envPath = _config.default !== null && _config.default !== void 0 && _config.default.production ? "./env/.prod" : "./env/.dev";

_dotenv.default.config({
  path: envPath
}); //DB connection


_mongoose.default.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('DB connected successfully.');
}).catch(err => {
  console.log(err);
});

const app = (0, _express.default)();
app.use((0, _morgan.default)(process.env.logger));
app.use((0, _helmet.default)());
app.use((0, _cors.default)());
app.use('/', (req, res) => {
  throw new _ApiError.default('This is a test error', 500, 'test');
  res.json({
    message: 'Hello World'
  });
});
/* A middleware that will catch any error that is thrown in the application. */

app.use(_GenericErrorHandler.default);
/* Setting the maximum size of the request body to 1mb. */

app.use(_express.default.json({
  limit: '1mb'
}));
/* Parsing the request body and making it available in the req.body object. */

app.use(_express.default.urlencoded({
  extended: true
}));
/* Checking if the HTTPS_ENABLED environment variable is set to true. If it is, it will create a HTTPS
server using the key and cert files in the certs folder. If it is not, it will create a HTTP server. */

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