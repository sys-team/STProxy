function remove(
    string
){
    return string.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, '');
}

function escape(
    string
){
    var result = '';
    var index = -1;
    var length;
    var first;
    var second;

    if (string == null || typeof string != 'string') {
        return string;
    }

    length = string.length;

    while (++index < length) {
        var char = string.charAt(index);

        first = string.charCodeAt(index);

        if ( first >= 0xD800 && first <= 0xDBFF && length > index + 1) {

            second = string.charCodeAt(index + 1);

            if (second >= 0xDC00 && second <= 0xDFFF) {

                var codePoint;

                codePoint = (first - 0xD800) * 0x400 + second - 0xDC00 + 0x10000;

                result += '\\u{' + codePoint.toString(16).toUpperCase() + '}';

                index++;

                continue;

            }
        }

        result += char;
    }

    return result;
}


function unEscape(
    string
){

    return string.replace(/\\u{([0-9a-f]{5})}/gi,
        function(value) {

            value = value.replace('\\u{', '0x').replace('}', '');

            var output = '';
            if (value > 0xFFFF) {
                value -= 0x10000;
                output += String.fromCharCode(value >>> 10 & 0x3FF | 0xD800);
                value = 0xDC00 | value & 0x3FF;
            }
            output += String.fromCharCode(value);

        return output;
    });
}

exports.remove = remove;
exports.escape = escape;
exports.unEscape = unEscape;
