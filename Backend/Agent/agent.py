#!/usr/bin/env python
import requests
import json
import os
from time import sleep
from sense_hat import SenseHat
from spidev import SpiDev

# The purpose of this section is to create a launcher.sh file that will run
# When the agent boots up that will in turn automatically run agent.py
# The launcher will be regenerated each time to ensure that the correct
# agent file will be run in the event the filename changing.

cwd = os.getcwd()
launcherPath = cwd + "/launcher.sh"

if not os.path.exists(launcherPath):
	# Adding the launcher.sh script to run at startup using cronjob
	cron_command = 'echo "@reboot ' + launcherPath + '" | sudo crontab -'
	os.system(cron_command)

# Creating launcher.sh
f = open(launcherPath,"w")
f.write("cd /" + "\n" + "sudo python3 " + __file__ + "\n" + "cd /")
f.close()

# Ensuring that launcher.sh is executable
os.chmod(launcherPath, 0o755)



roomID = '///room-id///'
ServerIP='///server-ip///'
duration = '///duration///'
private_key = '///private-key///'

req_headers = {
    "Key": private_key
}

server_url = f"http://{ServerIP}:5000/rooms/{roomID}/measurement"

class MCP:
    def __init__(self, bus = 0, device = 0):
        self.bus, self.device = bus, device
        self.spi = SpiDev()
        self.open()
        self.spi.max_speed_hz = 1000000
        
    def open(self):
        self.spi.open(self.bus, self.device)
        self.spi.max_speed_hz = 1000000
        
    def read(self, channel = 0):
        adc = self.spi.xfer2([1, (8 + channel) << 4, 0])
        data = ((adc[1] & 3) << 8) + adc[2]
        return data
    def close(self):
        self.spi.close()


#initializing sensors
sense = SenseHat()
adc = MCP()


while True:
    #Temperature
    temp = round(sense.get_temperature(), 2)
    #Humidity
    hum = round(sense.get_humidity(), 2)
    #Light
    light = adc.read(channel = 0)
    #AirPressure divided by 10 to convert from mBar to kPa
    pres = round(sense.get_pressure() / 10 , 2) 

    #Dataset
    dataSet = {'temperature': temp,
                'humidity': hum,
                'light': light,
                'pressure': pres}


    post_measurement = requests.post(server_url, headers=req_headers, json=dataSet)

    server_data = json.loads(post_measurement.text)
    sleep(int(server_data["duration"]))

