# API

Query the [Twitch API](https://github.com/justintv/Twitch-API), aka Kraken, in your application or your website. It supports AJAX requests but has its limitations.

**IMPORTANT**: Twitch is requiring the Client-ID header on all of your API requests to Kraken. [Click here to read more](https://blog.twitch.tv/client-id-required-for-kraken-api-calls-afbb8e95f843#.ga3y34pya).

## AJAX

Using AJAX requests works fine with Twitch but, unlike Node or any other programming language, it has its limitations.

~~~ javascript
client.api({
    url: "https://api.twitch.tv/kraken?client_id=CLIENT_ID"
}, function(err, res, body) {
    console.log(body);
});
~~~

**Pro tips**:

- Set the Client-ID in the URL with ``client_id=1dac77895e8f56fa1a71e7c43ef09d87``
- Set the OAuth Token in the URL with ``oauth_token=3eb787117110834e079932bedfb8e6a7``
- Set the method in the URL with ``_method=put``

## Node

We support all of the options available from the [request](https://github.com/request/request#requestoptions-callback) module. The response body is parsed as JSON.

~~~ javascript
client.api({
    url: "https://api.twitch.tv/kraken/",
    headers: {
        "Client-ID": "1dac77895e8f56fa1a71e7c43ef09d87"
    }
}, function(err, res, body) {
    console.log(body);
});
~~~

~~~ javascript
client.api({
    url: "https://api.twitch.tv/kraken/user",
    method: "GET",
    headers: {
        "Accept": "application/vnd.twitchtv.v3+json",
        "Authorization": "OAuth 3eb787117110834e079932bedfb8e6a7",
        "Client-ID": "1dac77895e8f56fa1a71e7c43ef09d87"
    }
}, function(err, res, body) {
    console.log(body);
});
~~~