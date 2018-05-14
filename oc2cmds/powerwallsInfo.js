"use strict";
module.exports =  function (callback){
    var AuthConfig = require(__dirname + '/../etc/config.json');
    var fs = require('fs');
    var request = require('request');
    var options = { 
        method: 'GET', 
        url: 'http://'+ AuthConfig['openc2server'] + '/api/powerwalls' };
        request(options, 
            function (err,body) {
                    if (!err) {
                        var parsedbody = JSON.parse(body.body);
                        callback(parsedbody);
                        } 
                    else {
                        if (typeof callback == 'function')
                            {
                        callback(err);
                        }
                    }
                })

            }