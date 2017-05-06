"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var os_1 = require("os");
/**
 * Created by amatsegor on 5/4/17.
 */
var AndroidTransformer = (function () {
    function AndroidTransformer() {
    }
    AndroidTransformer.prototype.transformArray = function (array) {
        var result = '';
        result += '<string-array name=\"' + array.key + '\">' + os_1.EOL;
        array.array.forEach(function (line) {
            result += '<item>' + line._value + '</item>';
            result += os_1.EOL;
        });
        result += "</string-array>";
        return result;
    };
    AndroidTransformer.prototype.transformComment = function (comment) {
        return "<!-- " + comment + " -->";
    };
    AndroidTransformer.prototype.transformKeyValue = function (key, value) {
        var normalizedValue = this.normalize(value);
        var output = '<string name="' + key + '">' + normalizedValue + '</string>';
        var currPos = 0, nbOcc = 1, newStr = "";
        while ((currPos = output.indexOf("%#$", currPos)) != -1) {
            output = this.setCharAt(output, currPos + 1, nbOcc);
            ++currPos;
            ++nbOcc;
        }
        return output;
    };
    AndroidTransformer.prototype.normalize = function (value) {
        var normalizedValue = value.replace(/%newline%/gi, "\\n");
        normalizedValue = normalizedValue.replace(/'/gi, "\\'");
        normalizedValue = normalizedValue.replace(/%([sdf])/gi, '%#$$$1');
        normalizedValue = normalizedValue.replace(/&/gi, "&amp;");
        normalizedValue = normalizedValue.replace(/\u00A0/gi, "\\u00A0");
        normalizedValue = normalizedValue.replace(/([^\.]|^)(\.{3})([^\.]|$)/gi, '$1&#8230;$3');
        return normalizedValue;
    };
    AndroidTransformer.prototype.insert = function (input, newValues) {
        var AUTOGENERATED_TAG = AndroidTransformer.AUTOGENERATED_TAG;
        if (!input) {
            input = '';
        }
        var output = '';
        var closeTagIndex = input.indexOf('</resources>');
        if (closeTagIndex < 0) {
            output = '<?xml version="1.0" encoding="utf-8"?>' + os_1.EOL + '<resources>' + os_1.EOL;
        }
        else {
            var autoGeneratedIndex = input.indexOf(AUTOGENERATED_TAG);
            if (autoGeneratedIndex >= 0) {
                output = input.substr(0, autoGeneratedIndex);
            }
            else {
                output = input.substr(0, closeTagIndex);
            }
        }
        output += AUTOGENERATED_TAG + os_1.EOL + newValues + os_1.EOL + '</resources>';
        return output;
    };
    AndroidTransformer.prototype.setCharAt = function (str, index, chr) {
        if (index > str.length - 1)
            return str;
        return str.substr(0, index) + chr + str.substr(index + 1);
    };
    return AndroidTransformer;
}());
AndroidTransformer.AUTOGENERATED_TAG = '<!-- AUTO-GENERATED -->';
exports.AndroidTransformer = AndroidTransformer;
