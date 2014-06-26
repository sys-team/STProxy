var converter  = require('./ASA.rest_xml2json');

function convert(
    xml
)
{
    return converter.convert(xml);
}

exports.convert = convert;