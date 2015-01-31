var Code = require('code');
var Hapi = require('hapi');
var Hoek = require('hoek');
var Lab = require('lab');
var oEmbed = require('..');

var lab = exports.lab = Lab.script();
var describe = lab.describe;
var it = lab.it;
var expect = Code.expect;

describe('oEmbed handler', function () {
    var provisionServer = function() {
        var server = new Hapi.Server({minimal: true});
        server.register(oEmbed, Hoek.ignore);
        return server;
    };

    it('succeeds on baseline request', function(done) {
        var server = provisionServer();
console.log(server);
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

    it('requires a url parameter', function(done) {
        var server = provisionServer();
        server.route({ method: 'GET', path: '/', handler: {
            oembed: {
                title: 'Embed',
                html: '<aside>Example Content</aside>'
            }
        }});

        server.inject('/', function(response) {
            expect(response.statusCode).to.equal(400);
            done();
        });
    });
});
