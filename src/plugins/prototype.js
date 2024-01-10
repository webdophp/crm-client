if (String.prototype.toTitleCase) {
    String.prototype.toTitleCase = function () {
        return this.split(' ')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ')
    }
}

if (String.prototype.toTitleCaseFirstWord) {
    String.prototype.toTitleCaseFirstWord = function () {
        return this.split(' ')
            //.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
    }
}

if (!String.prototype.includes) {
    String.prototype.includes = function (search, start) {
        'use strict';
        if (typeof start !== 'number') {
            start = 0;
        }
        if (start + search.length > this.length) {
            return false;
        } else {
            return this.indexOf(search, start) !== -1;
        }
    }
}

if (!String.prototype.firstLetterCaps) {
    String.prototype.firstLetterCaps = function () {
        if (this) {
            return this.trim().replace(/ {1,}/g, " ").split(/\s+/).map(word => word[0] + (word[1] ? word[1].substring(1) : "")).join('').substring(0, 2).toUpperCase()
        } else {
            return ''
        }
    }
}

if (!String.prototype.startsWith) {
    Object.defineProperty(String.prototype, 'startsWith', {
        enumerable: false,
        configurable: false,
        writable: false,
        value: function (searchString, position) {
            position = position || 0;
            return this.indexOf(searchString, position) === position;
        }
    })
}

if (!String.prototype.arrayStartsWith) {
    Object.defineProperty(Array.prototype, 'arrayStartsWith', {
        enumerable: false,
        configurable: false,
        writable: false,
        value: function (searchString) {
            for (let i in this) {
                if (searchString.startsWith(this[i])) {
                    return true
                }
            }
            return false;
        }
    })
}

/// "Test {0}, {1} and {2}".format('one', 'two', 'three'); // Re
if (!String.prototype.format) {
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined' ? args[number] : match;
        });
    };
}

if (!String.prototype.repearString) {
    String.prototype.repearString = function (count) {
        var string = String(this.split('').join())
        if (typeof start !== 'number') {
            count = Number(count);
        }
        var str = ''
        for (let i = 1; i <= count; i++) {
            str = str + string
        }
        return str
    }
}

if (!String.prototype.stripTags) {
    String.prototype.stripTags = function () {
        return this.replace(/(<([^>]+)>)/ig, '').replace(/\s+/g, ' ').replace(/(\r|\n)/g, '').trim()
    }
}
