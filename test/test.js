'use strict';

var expect = require('chai').expect;
var highlight = require('../index');
var deepDiff = require('deep-diff');

describe('#highlight', function() {
    describe('#single', function() {
        it('the new should be red', function() {
            var diff = deepDiff({}, { foo: 'foo' });
            var colored = highlight(diff[0]);
            expect(colored).to.equal('\u001b[90mobj\u001b[39m.\u001b[31m\u001b[7mfoo\u001b[27m\u001b[39m');
        });

        it('the deleted should be green', function() {
            var diff = deepDiff({ foo: 'foo' }, {});
            var colored = highlight(diff[0]);
            expect(colored).to.equal('\u001b[90mobj\u001b[39m.\u001b[32m\u001b[7mfoo\u001b[27m\u001b[39m');
        });

        it('the edited should be red for the expected and green for the actual', function() {
            var diff = deepDiff({ foo: 'foo' }, { foo: 'bar' });
            var colored = highlight(diff[0]);
            expect(colored).to.equal('\u001b[90mobj.foo\u001b[39m = \u001b[32m\u001b[7m\'bar\'\u001b[27m\u001b[39m\u001b[31m\u001b[7m\'foo\'\u001b[27m\u001b[39m');
        });
    });

    describe('#array', function() {
        it('the new should be red', function() {
            var diff = deepDiff([], ['foo']);
            var colored = highlight(diff[0]);
            expect(colored).to.equal('\u001b[90m[0]\u001b[39m = \u001b[31m\u001b[7m\'foo\'\u001b[27m\u001b[39m');
        });

        it('the deleted should be green', function() {
            var diff = deepDiff(['foo'], []);
            var colored = highlight(diff[0]);
            expect(colored).to.equal('\u001b[90m[0]\u001b[39m = \u001b[32m\u001b[7m\'foo\'\u001b[27m\u001b[39m');
        });

        it('the edited should be red for the expected and green for the actual', function() {
            var diff = deepDiff(['foo'], ['bar']);
            var colored = highlight(diff[0]);
            expect(colored).to.equal('\u001b[90mobj[0]\u001b[39m = \u001b[32m\u001b[7m\'bar\'\u001b[27m\u001b[39m\u001b[31m\u001b[7m\'foo\'\u001b[27m\u001b[39m');
        });
    });
});
