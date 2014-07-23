var converter  = require("./b_ASA.rest_2_f_rest.v2");

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