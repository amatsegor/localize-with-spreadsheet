"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var os_1 = require("os");
/**
 * Created by amatsegor on 5/4/17.
 */
var DartTransformer = (function () {
    function DartTransformer() {
    }
    DartTransformer.prototype.transformComment = function (comment) {
        return "  // " + comment;
    };
    DartTransformer.prototype.transformKeyValue = function (key, value) {
        var normalizedValue = value.replace(/%newline%/gi, "\\n");
        normalizedValue = normalizedValue.replace(/"/gi, '\\"');
        normalizedValue = normalizedValue.replace(/%([@df])/gi, '%$1');
        normalizedValue = normalizedValue.replace(/%s/gi, "%@");
        return '  "' + key + '" : "' + normalizedValue + '",';
    };
    DartTransformer.prototype.insert = function (input, newValues, options) {
        if (!input) {
            input = '';
        }
        var generatedIndex = input.indexOf(DartTransformer.AUTOGENERATED_TAG);
        if (generatedIndex >= 0) {
            input = input.substr(0, generatedIndex);
        }
        var header = options && options.header ? options.header : '';
        var footer = options && options.footer ? options.footer : '';
        var output = input + DartTransformer.AUTOGENERATED_TAG + os_1.EOL +
            header +
            '{' + os_1.EOL +
            newValues + os_1.EOL
            + '};' + footer;
        return output;
    };
    return DartTransformer;
}());
exports.DartTransformer = DartTransformer;
;
