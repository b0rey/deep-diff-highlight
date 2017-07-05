'use strict';

var stringifyObject = require('stringify-object'),
    chalk = require('chalk'),
    inverseGreen = chalk.green.inverse,
    inverseRed = chalk.red.inverse,
    grey = chalk.grey;

module.exports = function(diff) {
    return new JSONDiff(diff).getText();
};

function JSONDiff(diff) {
    this.data = diff;
}

JSONDiff.prototype.renders = {
    ND: function (diff, color, field) {
        var path = diff.data.path;

        if (!Array.isArray(path)) {
            return ' = ' + color(diff.getStringifyField(field));
        }

        var last = path.length - 1,
            owner = diff.getPath(path.slice(0, last));
        return grey(owner) + '.' + color(path[last]);
    },
    N: function (diff) {
        return this.ND(diff, inverseRed, 'rhs');
    },
    D: function (diff) {
        return this.ND(diff, inverseGreen, 'lhs');
    },
    E: function (diff) {
        return grey(diff.getPath()) + ' = ' +
            inverseGreen(diff.getStringifyField('rhs')) +
            inverseRed(diff.getStringifyField('lhs'));
    },
    A: function (diff) {
        return grey(diff.getPath() + '[' + diff.data.index + ']') +
            new JSONDiff(diff.data.item).getText();
    }
};

JSONDiff.prototype.getStringifyField = function (field) {
    return stringifyObject(this.data[field], { indent: '  ' });
};

JSONDiff.prototype.getText = function () {
    return this.renders[this.data.kind](this);
};

JSONDiff.prototype.getPath = function (path) {
    path = path || this.data.path;
    if (!Array.isArray(path)) return '';

    return path.reduce(function (acc, item) {
        return typeof item === 'number' ?
            acc + '[' + item + ']' :
            acc + '.' + item;
    }, 'obj');
};
