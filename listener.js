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
var fs = require('fs');
var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json());
var AuthConfig = require(__dirname + '/etc/config.json');
var batteryPercentage = require(__dirname + '/oc2cmds/battery.js');
var aggregates = require(__dirname + '/oc2cmds/aggregates.js');
var siteinfo = require(__dirname + '/oc2cmds/siteinfo.js');
var powerwallsInfo = require(__dirname + '/oc2cmds/powerwallsInfo.js');
var uptime = require(__dirname + '/oc2cmds/uptime.js');

app.get('/', function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    fs.createReadStream(__dirname + '/html/index.htm').pipe(res);
});


app.post('/openc2mirror/', function (req, res) {
    res.send(req.body);
});

app.post('/openc2/command/', function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    if (req.headers["apikey"] == AuthConfig["apikey"]) {
        if (req.body.action.toLowerCase() == 'query' && req.body.target.hasOwnProperty('property')) {
            if (req.body.actuator.hasOwnProperty('endpoint_smart_meter')) {
                if (req.body.target.property.name.toLowerCase() == "battery_percentage") {
                    batteryPercentage(function (parsedbody) {
                        if (!parsedbody) {
                            res.sendStatus(400);
                        } else {
                            var output = '{ "command_ref" : "' + req.body.id + '", "status": "200", "results" : ' + '{ "battery_percentage" : ' + parsedbody.percentage + '}}';
                            res.send(JSON.parse(output, null, 4));
                        }
                    });
                } else if (req.body.target.property.name.toLowerCase() == 'device_count') {
                    powerwallsInfo(function (parsedbody) {
                        if (!parsedbody) {
                            res.sendStatus(400);
                        } else {
                            var output = '{ "command_ref" : "' + req.body.id + '", "status": "200", "results" : ' + JSON.stringify(parsedbody.powerwalls) + '}';
                            res.send(JSON.parse(output, null, 4));
                        }
                    });
                }else if (req.body.target.property.name.toLowerCase() == 'timezone') {
                    siteinfo(function (parsedbody) {
                        if (!parsedbody) {
                            res.sendStatus(400);
                        } else {
                            var output = '{ "command_ref" : "' + req.body.id + '", "status": "200", "results" : ' + '{ "time_zone" : "' + parsedbody.timezone + '"}}';
                            res.send(JSON.parse(output, null, 4));
                        }
                    });
                } else if (req.body.target.property.name.toLowerCase() == 'nominal_system_energy_kwh') {
                    siteinfo(function (parsedbody) {
                        if (!parsedbody) {
                            res.sendStatus(400);
                        } else {
                            var output = '{"command_ref" : "' + req.body.id + '", "status": "200", "results" : ' + '{ "nominal_system_energy_kwh" : ' + parsedbody.nominal_system_energy_kWh + '}}';
                            res.send(JSON.parse(output, null, 4));
                        }
                    });
                } else if (req.body.target.property.name.toLowerCase() == 'grid_code') {
                    siteinfo(function (parsedbody) {
                        if (!parsedbody) {
                            res.sendStatus(400);
                        } else {
                            var output = '{"command_ref" : "' + req.body.id + '", "status": "200", "results" : ' + '{ "grid_code" : "' + parsedbody.grid_code + '"}}';
                            res.send(JSON.parse(output, null, 4));

                        }
                    });
                } else if (req.body.target.property.name.toLowerCase() == 'grid_voltage_setting') {
                    siteinfo(function (parsedbody) {
                        if (!parsedbody) {
                            res.sendStatus(400);
                        } else {
                            var output = '{ "command_ref" : "' + req.body.id + '", "status": "200", "results" : ' + '{ "grid_voltage_setting" : "' + parsedbody.grid_voltage_setting + '"}}';
                            res.send(JSON.parse(output, null, 4));
                        }
                    });
                } else if (req.body.target.property.name.toLowerCase() == 'grid_freq_setting') {
                    siteinfo(function (parsedbody) {
                        if (!parsedbody) {
                            res.sendStatus(400);
                        } else {
                            var output = '{ "command_ref" : "' + req.body.id + '", "status": "200", "results" : ' + '{ "grid_frequency_setting" : "' + parsedbody.grid_freq_setting + '"}}';
                            res.send(JSON.parse(output, null, 4));
                        }
                    });
                } else if (req.body.target.property.name.toLowerCase() == 'country') {
                    siteinfo(function (parsedbody) {
                        if (!parsedbody) {
                            res.sendStatus(400);
                        } else {
                            var output = '{ "command_ref" : "' + req.body.id + '", "status": "200", "results" : ' + '{ "country" : "' + parsedbody.country + '"}}';
                            res.send(JSON.parse(output, null, 4));
                        }
                    });
                } else if (req.body.target.property.name.toLowerCase() == 'last_communication_time') {
                    aggregates(function (parsedbody) {
                        if (!parsedbody) {
                            res.sendStatus(400);
                        } else {
                            var output = '{ "command_ref" : "' + req.body.id + '", "status": "200", "results" : ' + '{ "last_communication_time" : "' + parsedbody.site.last_communication_time + '"}}';
                            res.send(JSON.parse(output, null, 4));
                        }
                    });

                } else if (req.body.target.property.name.toLowerCase() == 'instant_apparent_power') {
                    aggregates(function (parsedbody) {
                        if (!parsedbody) {
                            res.sendStatus(400);
                        } else {
                            var output = '{ "command_ref" : "' + req.body.id + '", "results" : ' + '{ "instant_apparent_power" : ' + parsedbody.site.instant_apparent_power + '}}';
                            res.send(JSON.parse(output, null, 4));
                        }
                    });
                } else if (req.body.target.property.name.toLowerCase() == 'site_name') {
                    siteinfo(function (parsedbody) {
                        if (!parsedbody) {
                            res.sendStatus(400);
                        } else {
                            var output = '{ "command_ref" : "' + req.body.id + '", "status": "200","results" : ' + '{ "site_name" : "' + parsedbody.site_name + '"}}';
                            res.send(JSON.parse(output, null, 4));
                        }
                    });
                } else if (req.body.target.property.name.toLowerCase() == 'uptime') {
                    uptime(function (parsedbody) {
                        if (!parsedbody) {
                            res.sendStatus(400);
                        } else {
                            var output = '{ "command_ref" : "' + req.body.id + '", "status": "200","results" : ' + '{ "uptime" : "' + parsedbody.uptime + '"}}';
                            res.send(JSON.parse(output, null, 4));
                        }
                    });
                } else {
                    res.send('{ "command_ref" : "", "status": "400", "results" : "failed" }');
                }
            }

        }

        if (req.body.action.toLowerCase() == 'query' && req.body.target.hasOwnProperty('openc2')) {
            var output = '{"command_ref" : "' + req.body.id + '","status": "200","results" : {"action" : "query","target" : {"property" : [{ "battery_percentage": "float" },{ "timezone": "string" }, { "nominal_system_energy_kwh": "float" }, { "grid_code": "string" },{ "grid_voltage_setting": "integer" },{ "grid_freq_setting": "integer" },{ "country": "string" },{ "last_communication_time": "date"},{ "instant_apparent_power": "float"},{ "site_name": "string" }]}}}'
            res.send(JSON.parse(output), null, 4);
               }
    }
    else {
         res.send('{ "command_ref" : "", "status": "401", "results" : "failed" }');


    }
});

http.createServer(app).listen(1512, function () {
    console.log('OpenC2 Middleware Listening on http://0.0.0.0:1512');
});
