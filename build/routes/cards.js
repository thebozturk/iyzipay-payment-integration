"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ApiError = _interopRequireDefault(require("../error/ApiError.js"));

var Cards = _interopRequireWildcard(require("../services/iyzico/methods/cards.js"));

var _users = _interopRequireDefault(require("../db/users.js"));

var _nanoid = _interopRequireDefault(require("../utils/nanoid.js"));

var _Session = _interopRequireDefault(require("../middlewares/Session.js"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = async router => {
  /* A route for adding a card to the user. */
  router.post("/cards", _Session.default, async (req, res, next) => {
    var _req$user;

    const {
      card
    } = req.body;
    let result = await Cards.createUserCard({
      locale: req.user.locale,
      conversationId: req.user.conversationId,
      email: req.user.email,
      externalId: (0, _nanoid.default)(),
      ...(((_req$user = req.user) === null || _req$user === void 0 ? void 0 : _req$user.cardUserKey) && {
        cardUserKey: req.user.cardUserKey
      }),
      card: card
    });

    if (!req.user.cardUserKey) {
      if ((result === null || result === void 0 ? void 0 : result.status) === "success" && result !== null && result !== void 0 && result.cardUserKey) {
        const user = await _users.default.findOne({
          _id: req.user._id
        });
        user.cardUserKey = result.cardUserKey;
        await user.save();
      }
    }

    res.json(result);
  });
  router.get("/cards", _Session.default, async (req, res, next) => {
    var _req$user2;

    /* Checking if the user has a card user key. If not, it throws an error. */
    if (!((_req$user2 = req.user) !== null && _req$user2 !== void 0 && _req$user2.cardUserKey)) {
      throw new _ApiError.default("User has no card user key", 401, "userHasNoCardUserKey");
    }

    let cards = await Cards.getUserCard({
      locale: req.user.locale,
      conversationId: (0, _nanoid.default)(),
      cardUserKey: req.user.cardUserKey
    });
    res.status(200).json(cards);
  }); //delete card - token

  router.delete("/cards/delete-by-token", _Session.default, async (req, res) => {
    const {
      cardToken
    } = req.body;

    if (!cardToken) {
      throw new _ApiError.default("Card token is required", 400, "cardTokenRequired");
    }

    let result = await Cards.deleteUserCard({
      locale: req.user.locale,
      conversationId: (0, _nanoid.default)(),
      cardUserKey: req.user.cardUserKey,
      cardToken: cardToken
    });
    res.json(result).status(200);
  }); //delete card - index

  router.delete("/cards/:cardIndex/delete-by-index", _Session.default, async (req, res) => {
    var _req$params, _req$params2;

    if (!((_req$params = req.params) !== null && _req$params !== void 0 && _req$params.cardIndex)) {
      throw new _ApiError.default("Card index is required", 400, "cardIndexRequired");
    }

    let cards = await Cards.getUserCard({
      locale: req.user.locale,
      conversationId: (0, _nanoid.default)(),
      cardUserKey: req.user.cardUserKey
    });
    const index = parseInt((_req$params2 = req.params) === null || _req$params2 === void 0 ? void 0 : _req$params2.cardIndex);

    if (index >= cards.cardDetails.length) {
      throw new _ApiError.default("Card does not exist", 400, "cardIndexInvalid");
    }

    const {
      cardToken
    } = cards.cardDetails[index];
    let deleteResult = await Cards.deleteUserCard({
      locale: req.user.locale,
      conversationId: (0, _nanoid.default)(),
      cardUserKey: cardToken
    });
    res.json(cards).status(200);
  });
};

exports.default = _default;