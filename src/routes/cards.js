import ApiError from "../error/ApiError.js";
import * as Cards from "../services/iyzico/methods/cards.js";
import Users from "../db/users.js";
import nanoid from "../utils/nanoid.js";
import Session from "../middlewares/Session.js";

export default async (router) => {
  /* A route for adding a card to the user. */
  router.post("/cards", Session, async (req, res, next) => {
    const { card } = req.body;
    let result = await Cards.createUserCard({
      locale: req.user.locale,
      conversationId: req.user.conversationId,
      email: req.user.email,
      externalId: nanoid(),
      ...(req.user?.cardUserKey && {
        cardUserKey: req.user.cardUserKey,
      }),
      card: card,
    });
    if (!req.user.cardUserKey) {
      if (result?.status === "success" && result?.cardUserKey) {
        const user = await Users.findOne({
          _id: req.user._id,
        });
        user.cardUserKey = result.cardUserKey;
        await user.save();
      }
    }
    res.json(result);
  });

  router.get("/cards", Session, async (req, res, next) => {
/* Checking if the user has a card user key. If not, it throws an error. */
    if (!req.user?.cardUserKey) {
      throw new ApiError(
        "User has no card user key",
        401,
        "userHasNoCardUserKey"
      );
    }
    let cards = await Cards.getUserCard({
      locale: req.user.locale,
      conversationId: nanoid(),
      cardUserKey: req.user.cardUserKey,
    });

    res.status(200).json(cards);
  });
  //delete card - token
router.delete("/cards/delete-by-token", Session, async (req, res) => {
  const { cardToken } = req.body;
  if(!cardToken) {
    throw new ApiError("Card token is required", 400, "cardTokenRequired");
  }
  let result = await Cards.deleteUserCard({
    locale: req.user.locale,
    conversationId: nanoid(),
    cardUserKey: req.user.cardUserKey,
    cardToken: cardToken,
  });
  res.json(result).status(200);
})

//delete card - index

  router.delete("/cards/:cardIndex/delete-by-index", Session, async (req, res) => {
    if(!req.params?.cardIndex) {
      throw new ApiError("Card index is required", 400, "cardIndexRequired");
    }
    let cards = await Cards.getUserCard({
      locale: req.user.locale,
      conversationId: nanoid(),
      cardUserKey: req.user.cardUserKey,
    });
    const index = parseInt(req.params?.cardIndex);
    if(index >= cards.cardDetails.length) {
      throw new ApiError("Card does not exist", 400, "cardIndexInvalid");
    }
    const { cardToken } = cards.cardDetails[index];
    let deleteResult = await Cards.deleteUserCard({
      locale: req.user.locale,
      conversationId: nanoid(),
      cardUserKey: cardToken,
    });
    res.json(cards).status(200);
  })
};


