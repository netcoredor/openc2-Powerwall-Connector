**Tesla Powerwall 2.0 and OpenC2 Enablement**
A Proof of Concept
In this writeup an OpenC2 connector for the Tesla Powerwall is introduced to illustrate the use of the OpenC2 language in an IOT device. Due to the lack of formal Tesla REST API documentation online, this proof of concept is incomplete. All commands in the development of this OpenC2 proof of concept were intentionally restricted to query commands to avoid any unforeseen issues with the Powerwall during the development of this OpenC2 connector. Although there are other commands which allow for making changes, those commands will not be covered in this writeup. Any readers attempting to use this information for their own purposes do so at their own risk.

**Basic OpenC2 Background**

OpenC2 is a language specification currently being worked on out of the oasis-open.org* standards body. The goal of the language is to provide a standard language for initiating commands for command and control of an almost limitless variety of networked devices. In theory, OpenC2 can be used to control firewalls, endpoint malware protection software, IOT devices, databases, routers, switches and anything digital with network connectivity. 

Based on the draft version at the time of this posting an OpenC2 commands structure looks like the following:

{
"id": "72221242711906412840273569986755",
"action": "query",
"target": {
"property": {
"name": "battery_percentage"
}
},
"actuator": {
"endpoint_smart_meter": {
}
}
}

In this example a Tesla Powerewall is “OpenC2 enabled” to make interfacing with the Tesla Powerwall much easier to standardize across devices. OpenC2 is in its early draft stage, as such few vendors are adopting it directly into their products, so a transitional approach is demonstrated here. Initially, OpenC2 implementers can create a meta layer to translate OpenC2 commands to their target product's existing API. There are plenty of products in the market that offer REST API access to their applications, these products are a good entry point for OpenC2 enablement. Why add another API layer to an application that already provides a REST API? When an integrator is looking to integrate products across many different vendor applications a REST API is useful, except that every product has a different structure to their REST commands. OpenC2 aims to address this problem by introducing one common language. The use of OpenC2 provides a means to integrate more easily and reduce command mapping time between products. Integrators can spend their integration effort in figuring out what commands to run, versus spending time figuring out what is the shape of the command for a particular vendors REST API.

**Tesla Powerwall**

Tesla powerwall 2.0 is a usable 13.5Kwh battery (per Tesla’s site)** for use in the home as either a backup battery, solar battery or for Time of Use(not tested) usage to run during the day when rates are highest and charge at night when rates are cheaper (your mileage may vary). Due to OpenC2s infancy, some liberties were taken in the interpretation of the command specification. 
The Tesla Powerwall offers unauthenticated access to numerous REST API calls. The following list is not a complete accounting. Only unauthenticated information gathering commands are present here. The OpenC2 listener only exposes a subset of the values below. 

**REST API Command**

Method  GET

URI /api/status

JSON Response:

{
"start_time": "2018-03-16 22:31:50 +0800",
"up_time_seconds": "279h52m23.949702965s",
"is_new": false,
"version": "1.15.0\n",
"git_hash": "db123456c6cad12a3e4c5678e90fff123eb4da5d\n"
}

**REST API Command:**

Method  GET

URI /api/system_status/soe

JSON Response:

{
"percentage": 100
}


**REST API Command:**

Method  GET

URI /api/meters/aggregates

JSON Response:

{
"site": {
"last_communication_time": "2018-03-28T14:26:39.190433322-04:00",
"instant_power": 979.8400268554688,
"instant_reactive_power": -474.5899963378906,
"instant_apparent_power": 1088.7250079116052,
"frequency": 60,
"energy_exported": 42.521111111111196,
"energy_imported": 2783920.8358333334,
"instant_average_voltage": 244.5800018310547,
"instant_total_current": 0,
"i_a_current": 0,
"i_b_current": 0,
"i_c_current": 0
},
"battery": {
"last_communication_time": "2018-03-28T14:26:39.190735987-04:00",
"instant_power": 0,
"instant_reactive_power": 390,
"instant_apparent_power": 390,
"frequency": 59.981,
"energy_exported": 300,
"energy_imported": 36510,
"instant_average_voltage": 244.4,
"instant_total_current": -0.30000000000000004,
"i_a_current": 0,
"i_b_current": 0,
"i_c_current": 0
},
"load": {
"last_communication_time": "2018-03-28T14:26:39.190433322-04:00",
"instant_power": 976.8239963308101,
"instant_reactive_power": -79.68784435495816,
"instant_apparent_power": 980.0690140728022,
"frequency": 60,
"energy_exported": 0,
"energy_imported": 2747668.3147222223,
"instant_average_voltage": 244.5800018310547,
"instant_total_current": 3.9938833470348816,
"i_a_current": 0,
"i_b_current": 0,
"i_c_current": 0
},
"solar": {
"last_communication_time": "0001-01-01T00:00:00Z",
"instant_power": 0,
"instant_reactive_power": 0,
"instant_apparent_power": 0,
"frequency": 0,
"energy_exported": 0,
"energy_imported": 0,
"instant_average_voltage": 0,
"instant_total_current": 0,
"i_a_current": 0,
"i_b_current": 0,
"i_c_current": 0
},
"busway": {
"last_communication_time": "0001-01-01T00:00:00Z",
"instant_power": 0,
"instant_reactive_power": 0,
"instant_apparent_power": 0,
"frequency": 0,
"energy_exported": 0,
"energy_imported": 0,
"instant_average_voltage": 0,
"instant_total_current": 0,
"i_a_current": 0,
"i_b_current": 0,
"i_c_current": 0
},
"frequency": {
"last_communication_time": "0001-01-01T00:00:00Z",
"instant_power": 0,
"instant_reactive_power": 0,
"instant_apparent_power": 0,
"frequency": 0,
"energy_exported": 0,
"energy_imported": 0,
"instant_average_voltage": 0,
"instant_total_current": 0,
"i_a_current": 0,
"i_b_current": 0,
"i_c_current": 0
},
"generator": {
"last_communication_time": "0001-01-01T00:00:00Z",
"instant_power": 0,
"instant_reactive_power": 0,
"instant_apparent_power": 0,
"frequency": 0,
"energy_exported": 0,
"energy_imported": 0,
"instant_average_voltage": 0,
"instant_total_current": 0,
"i_a_current": 0,
"i_b_current": 0,
"i_c_current": 0
}
}

**REST API Command:**

Method  GET

URI /api/powerwalls

JSON Response:

{
"powerwalls": [
{
"PackagePartNumber": "1011110-01-G",
"PackageSerialNumber": "TG1234567891XX"
}
],
"has_sync": true
}

**REST API Command:**

Method  GET

URI /api/sitemaster

JSON Response:

{
"running": true,
"uptime": "1007883s,",
"connected_to_tesla": true
}

**REST API Command:**

Method  GET

URI /api/site_info

JSON Response:

{
"site_name": "Home Energy Gateway",
"timezone": "America/New_York",
"min_site_meter_power_kW": -1000000000,
"max_site_meter_power_kW": 1000000000,
"nominal_system_energy_kWh": 13.5,
"grid_code": "60Hz_240V_s_IEEE1547:2003",
"grid_voltage_setting": 240,
"grid_freq_setting": 60,
"grid_phase_setting": "Split",
"country": "United States",
"state": "*",
"region": "IEEE1547"
}


**Tesla Powerwall Local LAN accessible Web Interface.**

Want to find the native Tesla Powerwall commands yourself? While looking at the Tesla Powerwall web page, enable developer tools in your browser. Look at the sources tab and format the content for easy viewing by clicking {} to pretty the code. Begin looking for api commands by performing a text search for ‘api’.
Tesla Powerwall values exposed via OpenC2:

•   Battery percentage
•   Timezone
•   Nominal system energy in kwh
•   Grid code
•   Grid voltage setting
•   Grid frequency setting
•   Country
•   Site name
•   Site.instant_apparent_power
•   Site.last_communication_time
•   Powerwalls
•   uptime


**OpenC2 Connector Use and Configuration**

The proof of concept in this writeup is coded in NodeJS. It requires a minimal installation of the express module by running ‘npm install express’ in the Tesla_OpenC2 folder. Configuration of the tool requires opening the .etc/config.json file to specify your self-created api key and the IP address of the Powerwall. The api key is set in the code as a form of authorization validation when receiving OpenC2 commands. When the openc2 connector is executed it will require all incoming openc2 commands to pass the api key to perform the requested action. The Powerwall IP address is specified in the openc2server key in the config.json For example a properly formatted config.json looks like this:
{
"oc2-api-key":"0123456789123456795fd45d536f886ba4",
"openc2server":"10.0.0.10"
}

After specifying the api and server ip in the config.json file, execute node listener.js to start the OpenC2 listener on port 1512. To customize the port, simply open the listener.js file and scroll to the bottom to modify the listening port number. Once the listener is running OpenC2 commands can received for processing. 
There are many ways to send OpenC2 commands. In this example we’ll focus on sending commands with python to enable use of the commands on as many operating systems as possible with minimal installation requirements.

Python Example

    In order to run with python, please ensure you have the request library installed by running pip install request. Create a file named ‘tesla1.py’ and insert the following code:

import requests 
url = "http://localhost:1512/oc2/" 
payload = '{\
"id": "63795834503717021320881117126993",\
"action": "query",\
"target": {\
"property": {\
"name": "battery_percentage"\
}\
},\
"actuator": {\
"endpoint_smart_meter": {}\
}\
}'
headers = {"Content-Type":"application/json","oc2-api-key":"07849cf8aade4ed278b43796ba8c3d3171f424bc38e597e95fd45d536f886ba4","Cache-Control":"no-cache"}
response = requests.request("POST", url, data=payload, headers=headers)
print(response.text)
Final Steps to Test
Once the proper values for key and powerwall openc2server are specified in the config.json and the listener.js has been executed, the testla1.py command can be executed and a json file with battery percentage will be returned.



Reference

*OASIS Open Command and Control (OpenC2) TC | OASIS. (2018, 03 28). Retrieved from OASIS Open Command and Control (OpenC2) TC | OASIS: https://www.oasis-open.org/committees/tc_home.php?wg_abbrev=openc2
**Tesla. (2018, 03 28). Retrieved from Tesla Powerwall: https://www.tesla.com/powerwall
