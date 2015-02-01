# Hapi oEmbed Provider

An <a href="http://oembed.com">oembed provider</a> handler for <a href="http://hapijs.com">Hapi.js</a>.

[![Build Status](https://travis-ci.org/grayside/hapi-oembed-provider.svg)](https://travis-ci.org/grayside/hapi-oembed-provider)
[![npm version](https://badge.fury.io/js/hapi-oembed-provider.svg)](https://www.npmjs.com/package/hapi-oembed-provider)

## Options

All oembed payload responses are valid option keys for the oEmbed handler.

The 'html' and 'title' keys may be callbacks to facilitate data real-time data-loading.

## Setting Up Routes

In your oEmbed provider routes, you will want to add the following validation.
(Assumes [Joi](http://github.com/hapijs/joi) library for route validation.)

```js
    validate: {
        query: {
            url: Joi.required(),
            maxwidth: Joi.number().integer().min(1).default(600),
            maxheight: Joi.number().integer().min(1).default(600),
        }
    }
```


## Example
```js
    handler: {
        oembed: {
            type: 'rich',
            html: function(options, request) {
                return '<aside>This is the greatest</aside>'
            },
            title: function(options, request) {
                return 'Example',
            },
            provider_name: 'Example Content Provider',
            provider_url: 'http://example.com'
        }
    }
```

## License

MIT &copy; Adam Ross
