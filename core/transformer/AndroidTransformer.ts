import {Transformer} from "./Transformer";
import {EOL} from "os";
import {LSArray} from "../modeles/LSArray";
/**
 * Created by amatsegor on 5/4/17.
 */

export class AndroidTransformer implements Transformer {

    static AUTOGENERATED_TAG = '<!-- AUTO-GENERATED -->';

    transformArray(array: LSArray): string {
        let result = '';
        result += '<string-array name=\"' + array.key + '\">' + EOL;
        array.array.forEach(line => {
           result += '<item>' + line._value +'</item>';
           result += EOL;
        });
        result += "</string-array>";
        return result;
    }


    transformComment(comment: string): string {
        return "<!-- " + comment + " -->";
    }

    transformKeyValue(key: string, value: string): string {
        let normalizedValue = this.normalize(value);

        let output = '<string name="' + key + '">' + normalizedValue + '</string>';

        let currPos = 0, nbOcc = 1, newStr = "";
        while ((currPos = output.indexOf("%#$", currPos)) != -1) {
            output = this.setCharAt(output, currPos + 1, nbOcc);
            ++currPos;
            ++nbOcc;
        }

        return output;
    }

    private normalize(value: string) {
        let normalizedValue = value.replace(/%newline%/gi, "\\n");
        normalizedValue = normalizedValue.replace(/'/gi, "\\'");
        normalizedValue = normalizedValue.replace(/%([sdf])/gi, '%#$$$1');
        normalizedValue = normalizedValue.replace(/&/gi, "&amp;");
        normalizedValue = normalizedValue.replace(/\u00A0/gi, "\\u00A0");
        normalizedValue = normalizedValue.replace(/([^\.]|^)(\.{3})([^\.]|$)/gi, '$1&#8230;$3');
        return normalizedValue;
    }

    insert(input: string, newValues: string): string {
        const AUTOGENERATED_TAG = AndroidTransformer.AUTOGENERATED_TAG;

        if (!input) {
            input = '';
        }

        let output = '';
        const closeTagIndex = input.indexOf('</resources>');
        if (closeTagIndex < 0) {
            output = '<?xml version="1.0" encoding="utf-8"?>' + EOL + '<resources>' + EOL;
        } else {
            var autoGeneratedIndex = input.indexOf(AUTOGENERATED_TAG);
            if (autoGeneratedIndex >= 0) {
                output = input.substr(0, autoGeneratedIndex);
            } else {
                output = input.substr(0, closeTagIndex);
            }
        }

        output += AUTOGENERATED_TAG + EOL + newValues + EOL + '</resources>';

        return output;
    }

    setCharAt(str: string, index: number, chr: number) {
        if (index > str.length - 1) return str;
        return str.substr(0, index) + chr + str.substr(index + 1);
    }
}