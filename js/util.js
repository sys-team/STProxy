////////////
function canonicalize(
    str
) {
    toUpperWords = ['TE', 'XID', 'TS', 'CTS'];
    exactWords = {etag: 'ETag'};
    toUpperParts = ['MD5'];
    
    result = undefined;

    if (toUpperWords.indexOf(str.toUpperCase()) != -1) {
        return str.toUpperCase();
    }

    Object.keys(exactWords).forEach(function(word){

        if (str.toLowerCase() == word) {
            result = exactWords[word];
            return false;
        }
    });
    
    if (result) {
        return result;
    }
    
    arr = str.split('-');
    
    arr.forEach(function(word){
        result = (result ? result + '-' : '') + word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });
    
    toUpperParts.forEach(function(word){
        var reg = new RegExp(word, 'gi');
        result = result.replace(reg, word);
    });
    
    return result;
}

////////////
exports.canonicalize = canonicalize;