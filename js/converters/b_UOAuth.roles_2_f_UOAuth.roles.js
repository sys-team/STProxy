var xml2js  = require('xml2js');
var util = require('util');

function convert(
    xml,
    options
) {
    var json;
    var result = {};
    var attr = {};
    var resultObj = {};
    var parser = new xml2js.Parser();
    var account;
    var roles;

    parser.parseString(
        xml,
        function(err, res){
            json = res;
        }
    );

    result.account = {};
    account = json.response.account[0];

    Object.keys(account).forEach(
        function(key){
            result.account[key] = account[key][0];
        }
    );

    result.roles = {};
    roles = json.response.roles[0].role;

    roles.forEach(
        function(role){

            if (role.data) {

                var parsed;

                try {
                    parsed = JSON.parse(role.data[0]);
                } catch (err) {
                    parsed = role.data[0]
                };

                if (result.roles[role.code]){

                    if (util.isArray(result.roles[role.code])){

                        result.roles[role.code].push(parsed)

                    } else {

                        var val;

                        val = result.roles[role.code];
                        result.roles[role.code] = [];
                        result.roles[role.code].push(val);
                        result.roles[role.code].push(parsed);

                    }

                } else {

                    result.roles[role.code] = parsed

                }

            } else {
                result.roles[role.code] = true
            }

        }

    );

    attr['page-row-count'] = 1;

    resultObj.data = JSON.stringify(result);
    resultObj.attributes = attr;

    return resultObj;
}

exports.convert = convert;
