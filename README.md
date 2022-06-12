<h1>About</h1>
<p>This repository has been created as a test integration of the Iyzipay payment system.<p>

<h2>Technologies</h2>
 
<li>Express</li>
<li>MongoDB</li>
<li>Docker</li>
<li>Iyzipay</li>
<li>Babel</li>

### Requirements
```
Iyzipay Test Account
Docker
```
### Usage

Clone the repository

```
`$ git clone https://github.com/thebozturk/iyzipay-payment-integration.git`
```

Then open the project in ide and follow below commands:

Create environment file (.dev & .prod) for your config information of your database and Iyzipay test interface then fill the content as below.

#### MongoDB config

```
MONGO_URL=
```
#### Localhost config

```
PORT=
HTTPS_ENABLED=
DEPLOYMENT= development or production
LOGGER= dev or tiny
```
#### Iyzipay config

```
API_KEY=
URL=
SECRET_KEY=
```
  
Install dependencies and run app server with development or production mode

```
npm install
npm run start:dev
npm run start:production
```  
  
## Usage with Docker

```
npm run dockerize
npm run dockerize:start
```

## Endpoints

Authroziation 
```
- POST /login - for log in
```
Cards
```
- POST /cards - create a card
- GET /cards - read cards
- DELETE /cards/delete-by-token - delete a card by token
- DELETE /cards/:cartId - delete a card by index
```
Installments
```
- POST /installments - check installments
- POST /installments/:cartId - check installments with cartId
```
Payments
```
- POST /payments/:cartId/with-new-card - create payment with new card
- POST /payments/:cartId/with-new-card/register-card - create payment with new card & register card
- POST /payments/:cartId/with-register-card-index - create payment with registered card index
- POST /payments/:cartId/with-register-card-token - create payment with registered card token
```
Cancel Payment
```
- POST /payments/:paymentSuccessId/cancel - cancel payment
```
Refund Payment
```
- POST /payments/:paymentTransactionId/refund - refund payment
```

 
