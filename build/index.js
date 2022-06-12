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

var _passport = _interopRequireDefault(require("passport"));

var _passportJwt = require("passport-jwt");

var _users = _interopRequireDefault(require("./db/users.js"));

var _Session = _interopRequireDefault(require("./middlewares/Session.js"));

var _index2 = _interopRequireDefault(require("./routes/index.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const _dirname = _path.default.resolve();

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

const router = _express.default.Router();

app.use((0, _morgan.default)(process.env.logger));
app.use((0, _helmet.default)());
app.use((0, _cors.default)());
/* Setting the maximum size of the request body to 1mb. */

app.use(_express.default.json({
  limit: '1mb'
}));
/* Parsing the request body and making it available in the req.body object. */

app.use(_express.default.urlencoded({
  extended: true
}));

_passport.default.serializeUser((user, done) => {
  done(null, user);
});

_passport.default.deserializeUser((id, done) => {
  done(null, id);
});

app.use(_passport.default.initialize());
const jwtOpts = {
  jwtFromRequest: _passportJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
};
/* A middleware that will check if the user is authenticated. */

_passport.default.use(new _passportJwt.Strategy(jwtOpts, async (jwtPayload, done) => {
  try {
    const user = await _users.default.findOne({
      _id: jwtPayload._id
    });

    if (user) {
      done(null, user.toJSON());
    } else {
      done(new _ApiError.default('Autherization is not valid', 401, 'authorizationInvalid'), false);
    }
  } catch (error) {
    return done(error, false);
  }
}));

_index2.default.forEach((routeFn, index) => {
  routeFn(router);
});

app.use("/api", router);
app.all('/test-auth', _Session.default, (req, res, next) => {
  res.json({
    test: true
  });
});
/* A middleware that will catch any error that is thrown in the application. */

app.use(_GenericErrorHandler.default);
/* Checking if the HTTPS_ENABLED environment variable is set to true. If it is, it will create a HTTPS
server using the key and cert files in the certs folder. If it is not, it will create a HTTP server. */

if (process.env.HTTPS_ENABLED === 'true') {
  const key = _fs.default.readFileSync(_path.default.join(_dirname, './src/certs/key.pem'), 'utf8').toString();

  const cert = _fs.default.readFileSync(_path.default.join(_dirname, './src/certs/cert.pem'), 'utf8').toString();

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