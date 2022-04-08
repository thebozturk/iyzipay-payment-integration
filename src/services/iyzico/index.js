import Iyzipay from 'iyzipay';
import * as Cards from './methods/cards.js'
import nanoid from '../../utils/nanoid.js'
import * as Logs from '../../utils/logs.js'


//Create card and user
const createUserAndCards = () => {
    Cards.createUserCard({
        locale: Iyzipay.LOCALE.TR,
        //The id to be used when communicating with Iyzipay
        conversationId: nanoid(),
        email:'bugrahan@email.com',
        externalId: nanoid(),
        // test card details from iyzipay
        card: {
            cardAlias: 'My Credit Card',
            cardHolderName: 'John Doe',
            cardNumber: '5528790000000008',
            expireMonth: '12',
            expireYear: '2030',
            cvc: '123',
            registerCard: 0
        }
    }).then(res => {
        console.log(res);
        Logs.logFile('Create cards user and card', res)
    }).catch(err => {
        console.log(err);
        Logs.logFile('Create cards user and card', err)
    })
}

// createUserAndCards()

const createACardForAUser = () => {
    Cards.createUserCard({
        locale: Iyzipay.LOCALE.TR,
        conversationId: nanoid(),
        email:'bugrahan@email.com',
        externalId: nanoid(),
        cardUserKey: "WD8Z6Acu/IhVkLtQCoBlfLUy99Q=",
        card: {
            cardAlias: 'My Credit Card',
            cardHolderName: 'John Doe',
            cardNumber: '5528790000000008',
            expireMonth: '12',
            expireYear: '2030',
            cvc: '123',
            registerCard: 0
        }
    }).then(res => {
        console.log(res);
        Logs.logFile('Create second card for a user', res)
    }).catch(err => {
        console.log(err);
        Logs.logFile('Create second card for a user', err)
    })
}

// createACardForAUser()


// read a user's cards
const readCardsOfAUser = () => {
    Cards.getUserCard({
        locale: Iyzipay.LOCALE.TR,
        conversationId: nanoid(),
        cardUserKey: "WD8Z6Acu/IhVkLtQCoBlfLUy99Q=",
    }).then(res => {
        console.log(res);
        Logs.logFile('Read Cards Of A User', res)
    }).catch(err => {
        console.log(err);
        Logs.logFile('Read Cards Of A User', err)
    })
}
readCardsOfAUser()

//delete a user's card
const deleteCardOfAUser = () => {
    Cards.deleteUserCard({
        locale: Iyzipay.LOCALE.TR,
        conversationId: nanoid(),
        cardUserKey: "WD8Z6Acu/IhVkLtQCoBlfLUy99Q=",
        cardToken:"e9L7NHbzMhyrbOWqv4gW+STbLao="
    }).then(res => {
        console.log(res);
        Logs.logFile('Delete Cards Of A User', res)
    }).catch(err => {
        console.log(err);
        Logs.logFile('Delete Cards Of A User', err)
    })
}
// deleteCardOfAUser()