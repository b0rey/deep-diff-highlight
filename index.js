'use strict';

var stringifyObject = require('stringify-object'),
    chalk = require('chalk'),
    inverseGreen = chalk.green.inverse,
    inverseRed = chalk.red.inverse,
    grey = chalk.grey,
    indent = '  ';

var renders = {
    ND: function (diff, color, field) {
        var path = diff.path;

        if (!Array.isArray(path)) {
            return ' = ' + color(stringify(diff[field]));
        }

        var last = path.length - 1,
            owner = buildPath(path.slice(0, last));
        return grey(owner) + '.' + color(path[last]);
    },
    N: function (diff) {
        return this.ND(diff, inverseRed, 'rhs');
    },
    D: function (diff) {
        return this.ND(diff, inverseGreen, 'lhs');
    },
    E: function (diff) {
        return grey(buildPath(diff.path)) + ' = ' +
            inverseGreen(stringify(diff['rhs'])) +
            inverseRed(stringify(diff['lhs']));
    },
    A: function (diff) {
        return grey(buildPath(diff.path) + '[' + diff.index + ']') +
            renders[diff.item.kind](diff.item);
    }
};

function stringify(obj) {
    return stringifyObject(obj, { indent: indent });
};

function buildPath(path) {
    if (!Array.isArray(path)) return '';

    return path.reduce(function (acc, item) {
        return typeof item === 'number' ?
            acc + '[' + item + ']' :
            acc + '.' + item;
    }, 'obj');
};

module.exports = function(diff, params) {
    if (params && params.indent) {
        indent = params.indent;
    }

    return renders[diff.kind](diff);
};
