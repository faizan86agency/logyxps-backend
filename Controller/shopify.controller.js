require('dotenv').config();
const { timeStamp } = require("console");
const nonce = require("nonce");
const axios = require('axios')
const querystring = require('querystring');
const crypto = require('crypto');
const cookie = require("cookie");
const request = require('request-promise')


const apiKey = process.env.SHOPIFY_API_KEY;
const apiSecret = process.env.SHOPIFY_API_SECRET;
const scopes = "write_products";
const forwardingAddress = "https://8541-103-165-68-165.ngrok-free.app";

const shopifyLogin = (req, res) => {
    const shopName = req.query.shop;
    if (shopName) {
        // use nonce to set a parameter called state
        // the nonce is random string that would be set
        // it would be received on the request
        // the callback from shopify would echo the state
        // the two states would be compared
        // if they match, we are sure the request came from shopify
        // if they don't match, they request is being spoofed
        // this would throw an error
        const shopState = nonce();
        // shopify callback redirect
        const redirectURL = forwardingAddress + "/shopify/callback";
        // install url for app install
        const installUrl =
            "https://" +
            shopName +
            "/admin/oauth/authorize?client_id=" +
            apiKey +
            "&scope=" +
            scopes +
            "&state=" +
            shopState +
            "&redirect_uri=" +
            redirectURL;

        // in a production app, the cookie should be encrypted
        // but, for the purpose of this application, we won't do that
        res.cookie("state", shopState);
        // redirect the user to the installUrl
        res.redirect(installUrl);
    } else {
        return res.status(400).send('Missing "Shop Name" parameter!!');
    }
}

const shopifyCallback = (req, res) => {
    const { shop, hmac, code, shopState, timestamp } = req.query;
    const stateCookie = cookie.parse(req.headers.cookie).shopState;
    if (shopState !== stateCookie) {
        return res.status(400).send("request origin cannot be found");
    }
    if (shop && hmac && code && timeStamp) {

        if (!isHMACValid(apiSecret, { shop, hmac, code, timestamp })) {
            return response.status(400).send('HMAC validation failed.');
        }

        const accessTokenRequestUrl =
            "https://" + shop + "/admin/oauth/access_token";
        const accessTokenPayload = {
            client_id: process.env.SHOPIFY_API_KEY,
            client_secret: process.env.SHOPIFY_API_SECRET,
            code,
        };
        request
            .post(accessTokenRequestUrl, { json: accessTokenPayload })

            .then((accessTokenResponse) => {
                const accessToken = accessTokenResponse.access_token;
                const apiRequestURL = 'https://' + shop + '/admin/shop.json';
                const apiRequestHeaders = {
                    "X-Shopify-Access-Token": accessToken,
                    "Location":"http://localhost:5173/"
                };
                request
                    .get(apiRequestURL, { headers: apiRequestHeaders })
                    .then((apiResponse) => {
                        // res.redirect("http://localhost:5173/");
                        res.send(apiResponse);
                    })
                    .catch((error) => {
                        console.log(error)
                        res.status(500).send(error);
                    });
            })
            .catch((error) => {
                console.log(error)
                res.status(500).send(error);
            });
    } else {
        return res.status(400).send("required parameter missing");
    }
}

function isHMACValid(secret, { hmac, shop, code, timestamp }) {
    let input = querystring.stringify({ code, shop, timestamp });
    let generatedHash = crypto.createHmac('sha256', secret).update(input).digest('hex');
    return generatedHash !== hmac;
}

module.exports = {
    shopifyCallback,
    shopifyLogin
}