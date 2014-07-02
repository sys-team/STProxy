var converter  = require('./ASA.rest_xml2json');

function convert(
    xml,
    options
)
{
    var coptions = {};
    
    coptions["isChest"] = true;
    
    return converter.convert(xml, coptions);
}

exports.convert = convert;