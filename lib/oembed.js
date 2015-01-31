'use strict';

var Joi = require('joi');

var internals = {};
internals.schema = Joi.object({
    version: Joi.default('1.0'),
    type: Joi.valid('photo', 'video', 'link', 'rich'),
    title: Joi.alternatives(Joi.string(), Joi.func()),
    format: Joi.valid('json', 'xml').default('json'),
    height: Joi.number().min(0),
    width: Joi.number().min(0),
    html: Joi.alternatives(Joi.string(), Joi.func()),
    url: Joi.when('type', {
        is: 'photo',
        then: Joi.required(),
        otherwise: Joi.optional()
    }),
    author_name: Joi.string(),
    author_url: Joi.string(),
    provider_name: Joi.string(),
    provider_url: Joi.string(),
    cache_age: Joi.number(),
    thumbnail_url: Joi.string(),
    thumbnail_width: Joi.number(),
    thumbnail_height: Joi.number()
});

internals.content = Joi.object({
    title: Joi.alternatives(Joi.string(), Joi.func()),
    html: Joi.alternatives(Joi.string(), Joi.func())
  }, {allowUnknown: true}
);

exports.handler = function (route, options) {
    Joi.assert(options, internals.schema, 'Invalid oEmbed handler options (' + route.path + ')');
    var settings = Joi.validate(options, internals.schema).value;

    var handler = function(request, reply) {
      // Callback-based elements need to be revalidated, otherwise the variations
      // for a single route are missed.
      Joi.assert(options, internals.schema, 'Invalid oEmbed handler content (' + route.path + ')');
      var content = Joi.validate(options, internals.schema).value;
      settings.title = content.title;
      settings.html = content.html;

      if (settings.height === undefined) {
          settings.height = request.query.maxheight;
      }
      else {
          settings.height = settings.height > request.query.maxheight ? request.query.maxheight : settings.height;
      }
      if (settings.width === undefined) {
          settings.width = request.query.maxwidth;
      }
      else {
          settings.width = settings.width > request.query.maxheight ? request.query.maxheight : settings.width;
      }

      settings.html = (typeof settings.html === 'function' ? settings.html(settings, request) : settings.html);
      settings.title = (typeof settings.title === 'function' ? settings.title(settings, request) : settings.title);

      // @todo Use a more targeted approach to throw this exception.
      Joi.assert(settings, Joi.object({
          html: Joi.when('type', { is: Joi.valid('video', 'rich'), then: Joi.required() })
      }).unknown(true));

      var format = settings.format === 'json' ? 'application/json' : 'text/xml';

      return reply(exports.response(settings, request)).type(format);
    };

    return handler;
};

exports.response = function (options, request) {
    delete options.format;
    return options;
};
