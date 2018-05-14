// Copyright 2018 Efrain Ortiz

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

//     http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
"use strict";
module.exports =  function (callback){
    var fs = require('fs');
    var AuthDBname = require(__dirname + '/../etc/authdb.json');
    var request = require('request');
    var options = { 
        method: 'GET', 
        url: 'https://'+ global.AuthConfig['sepmserver'] + ':8446/sepm/api/v1/computers',
        headers: 
              { 'cache-control': 'no-cache',
                'content-type': 'application/json',
                authorization: 'Bearer '+ AuthDBname['token']},
                ca: fs.readFileSync(__dirname + '/../etc/Sepm_certificate.pem'), json: true 
                };
        request(options, 
        function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    var id = body.content;
                    var computerIdCollection = [];
                    id.forEach(function(value,index){
                       computerIdCollection[index] = { "computername" : value['computerName'], "currentClientId"  : value['uniqueId'], "groupId" : value.group['id'],
                       "groupName" : value.group['name'],
                       "ipAddress" : value.ipAddresses[0],
                       "operatingSystem" : value['operatingSystem'],
                       "osFunction" : value['osFunction'],
                       "osLanguage" : value['osLanguage'],
                       "logonUserName" : value['logonUserName']
                        };
                    });
                    if (typeof callback == 'function')
                        {
                        callback(null, computerIdCollection); 
                        }
                    global.computersDB.remove({}, {multi : true}, function (err, numRemoved) {
                    body.content.forEach(function(element) {
                         global.computersDB.insert(element, function (err, newDoc) {});
                    }, this);

                    });
                    var timenow = Date.now();
                    global.AuthConfig['lastOC2ProxyRunTime'] = timenow;
                    var UpdatedAuthConfig = global.AuthConfig;
                    var UpdatedAuthConfigString = JSON.stringify(UpdatedAuthConfig);
                    fs.writeFileSync(__dirname + '/../etc/config.json',UpdatedAuthConfigString, function(err){
                    if(err) {
                        return console.log('Server ' + global.AuthConfig['sepmserver'] + ' is currently not responding.');
                    }
                    });
                    } 
                else {
                    if (typeof callback == 'function')
                        {
                    callback(error);
                    }
                }
            })
    }