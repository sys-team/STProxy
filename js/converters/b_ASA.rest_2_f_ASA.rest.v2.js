var xml2js  = require('xml2js');
var emoji = require('../emoji');

function convert(
  xml,
  options
) {
  var json;
  var result = {};
  var resultObj = {};
  var attr = {};
  var parser = new xml2js.Parser();

  parser.parseString(xml,
    function(err, res){
      json = res;
    });

  if (json['response']['error']) {

    if (json['response']['error'][0]['$']) {
      result['error'] = json['response']['error'][0]['$']['code'];
    } else {
      result['error'] = json['response']['error'][0];
    }

  } else {
    result = processXml(json, options, 0);

    Object.keys(json['response']['$']).forEach(function(key){
      attr[key] = json['response']['$'][key];
      if (options['metadata']) {
        result[key] = json['response']['$'][key];
      }
    });

  }

  resultObj['data'] = JSON.stringify(result);
  if (!options['titles']){
    resultObj['dataArray'] = result['array'];
  }

  resultObj['attributes']  = attr;

  return resultObj;
}


function processXml(
  json,
  options,
  level
){
    var resultObj = {};

    Object.keys(json).forEach(function(jkey) {

        if (!options['titles'] && !('Object' in json)) {
            resultObj['array'] = [];
        }

        if (json[jkey].d) {

            json[jkey].d.forEach(function(obj){

                var row = {};
                var types = [];

                //console.log(JSON.stringify(obj));

                if (!resultObj[obj['$']['name']] && options['titles']) {
                    resultObj[obj['$']['name']] = [];
                }

                if (typeof obj['_'] != 'string') {

                    for (var prop in obj) {
                        if (prop != '$'  && types.indexOf(prop == -1)) {
                            types.push(prop);
                        }
                    }

                    if (obj.$) {
                        row['id'] = obj['$']['xid'];
                    }

                    types.forEach(function(name){
                        obj[name].forEach(function(prop){
                            //console.log('prop:');
                            //console.log(JSON.stringify(prop));

                            if (prop['$']['parent']) {

                                row[prop['$']['name']] = prop['$']['parent-xid'];

                            } else if(name == 'xml') {

                                Object.keys(prop[prop['$']['name']][0]).forEach(function(xkey){
                                    var xmlPrep = {};
                                    var tmp;

                                    if (xkey == 'd') {
                                        xmlPrep =  prop[prop['$']['name']];
                                    } else {
                                        xmlPrep[xkey] = prop[prop['$']['name']][0][xkey][0];
                                    }

                                    var res = processXml(xmlPrep, options, level +1);

                                    row[prop['$']['name']] = (res.array ? res.array : res);

                                });


                            } else if(prop['$']['name'] != 'id') {

                                if (prop['_']) {
                                    row[prop['$']['name']] = emoji.unEscape(prop['_']);
                                }
                                if (prop.$.xid){
                                    row[prop['$']['name']] = prop.$.xid;
                                }
                            }
                        })
                    });

                } else {
                    row[obj['$']['xid']] = obj['_'];
                }

                //console.log('row:');
                //console.log(JSON.stringify(row));

                if (options['titles']) {
                    resultObj[obj['$']['name']].push(row);
                } else {
                    resultObj['array'].push(row);
                }

            });
        } else {

            //console.log(JSON.stringify(json[jkey]));

            var row = {};
            var types = [];

            for (var prop in json[jkey]) {
                if (prop != '$'  && types.indexOf(prop == -1)) {
                    types.push(prop);
                }
            }

            types.forEach(function(name){
                json[jkey][name].forEach(function(prop){
                    //console.log(prop)

                    if (name == 'xml') {

                        Object.keys(prop[prop['$']['name']][0]).forEach(function(xkey){
                            var xmlPrep = {};
                            var tmp;

                            if (xkey == 'd') {
                                xmlPrep =  prop[prop['$']['name']];
                            } else {
                                xmlPrep[xkey] = prop[prop['$']['name']][0][xkey][0];
                            }

                            var res = processXml(xmlPrep, options, level +1);

                            resultObj[prop['$']['name']] = (res.array ? res.array : res);

                        });


                    } else {
                        resultObj[prop['$']['name']] = emoji.unEscape(prop['_']);
                    }
                });
            });

        }

    });

    //console.log('resultObj:');
    //console.log(resultObj);

    return resultObj;

}

exports.convert = convert;
