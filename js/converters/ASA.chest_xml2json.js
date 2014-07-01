var converter  = require('./ASA.rest_xml2json');

function convert(
    xml,
    options
)
{
    return converter.convert(xml, options);
}

exports.convert = convert;