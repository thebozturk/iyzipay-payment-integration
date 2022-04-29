import ApiError from "../error/ApiError.js";
import * as Cards from '../services/iyzico/methods/cards.js';
import Users from '../db/users.js';
import nanoid from "../utils/nanoid.js";
import Session from "../middlewares/Session.js";

export default async (router) => {
    router.post('/cards', Session, async (req, res, next) => {
        const {card} = req.body;
        let result = await Cards.createUserCard({
            locale: req.user.locale,
            conversationId: req.user.conversationId,
            email: req.user.email,
            externalId: nanoid(),
            ...req.user?.cardUserKey && {
                cardUserKey: req.user.cardUserKey
            },
            card: card
        });
        if(!req.user.cardUserKey){
            if(result?.status === 'success' && result?.cardUserKey){
                const user = await Users.findOne({
                    _id: req.user._id
                });
                user.cardUserKey = result.cardUserKey;
                await user.save();
            }
        }
        res.json(result);
    })
}