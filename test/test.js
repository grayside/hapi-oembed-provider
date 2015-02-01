var Code = require('code');
var Hapi = require('hapi');
var Hoek = require('hoek');
var Lab = require('lab');
var oEmbed = require('..');

var lab = exports.lab = Lab.script();
var describe = lab.describe;
var it = lab.it;
var expect = Code.expect;

describe('oEmbed', function() {
  describe('handler', function() {
    var provisionServer = function() {
        var server = new Hapi.Server({minimal: true});
        server.connection();
        server.register(oEmbed, Hoek.ignore);
        return server;
    };

    it('succeeds on baseline request', function(done) {
        var server = provisionServer();
        server.route({ method: 'GET', path: '/', handler: {
            oembed: {
                title: 'Embed',
                html: '<aside>Example Content</aside>'
            }
        }});

        server.inject('/?url=foo', function(response) {
            expect(response.statusCode).to.equal(200);
            done();
        });
    });
    it('limits height to maxheight', function(done) {
        var server = provisionServer();
        server.route({ method: 'GET', path: '/', handler: {
            oembed: {
                title: 'Embed',
                html: '<aside>Example Content</aside>',
                height: 20
            }
        }});

        server.inject('/?maxheight=10', function(response) {
            expect(response.result.height).to.equal('10');
            done();
        });
    });
    it('limits width to maxwidth', function(done) {
        var server = provisionServer();
        server.route({ method: 'GET', path: '/', handler: {
            oembed: {
                title: 'Embed',
                html: '<aside>Example Content</aside>',
                width: 20
            }
        }});

        server.inject('/?maxwidth=10', function(response) {
            expect(response.result.width).to.equal('10');
            done();
        });
    });
    it('may be of type "rich"', function(done) {
        var server = provisionServer();
        server.route({ method: 'GET', path: '/', handler: {
            oembed: {
                title: 'Embed',
                html: '<aside>Example Content</aside>',
                type: 'rich'
            }
        }});

        server.inject('/', function(response) {
            expect(response.statusCode).to.equal(200);
            done();
        });
    });
    it('may be of type "photo"', function(done) {
        var server = provisionServer();
        server.route({ method: 'GET', path: '/', handler: {
            oembed: {
                title: 'Embed',
                url: 'http://example.com/',
                type: 'photo'
            }
        }});

        server.inject('/', function(response) {
            expect(response.statusCode).to.equal(200);
            done();
        });
    });
    it('may be of type "link"', function(done) {
        var server = provisionServer();
        server.route({ method: 'GET', path: '/', handler: {
            oembed: {
                title: 'Embed',
                type: 'link'
            }
        }});

        server.inject('/', function(response) {
            expect(response.statusCode).to.equal(200);
            done();
        });
    });
    it('may be of type "video"', function(done) {
        var server = provisionServer();
        server.route({ method: 'GET', path: '/', handler: {
            oembed: {
                title: 'Video',
                html: '<aside>Example Content</aside>',
                type: 'video'
            }
        }});

        server.inject('/', function(response) {
            expect(response.statusCode).to.equal(200);
            done();
        });
    });
    it('may not be of invited type "mixed"', function(done) {
        var server = provisionServer();
        server.route({ method: 'GET', path: '/', handler: {
            oembed: {
                title: 'Mixed',
                html: '<aside>Example Content</aside>',
                type: 'mixed'
            }
        }});

        server.inject('/', function(response) {
            expect(response.statusCode).to.equal(500);
            done();
        });
    });
    it('the default oEmbed type is "rich"', function(done) {
        var server = provisionServer();
        server.route({ method: 'GET', path: '/', handler: {
            oembed: {
                title: 'Mixed',
                html: '<aside>Example Content</aside>'
            }
        }});

        server.inject('/', function(response) {
            expect(response.result.type).to.equal('rich');
            done();
        });
    });
    it('does not support XML oEmbed response', function(done) {
        var server = provisionServer();
        server.route({ method: 'GET', path: '/', handler: {
            oembed: {
                title: 'Example',
                html: '<aside>Example Content</aside>'
            }
        }});

        server.inject('/?format=xml', function(response) {
            expect(response.statusCode).to.equal(501);
            done();
        });
    });
  });
});
