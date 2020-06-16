# PiTemp
Web-Based monitor for temperature, pressure, humidity and light, based on Raspberry Pi and [Enviro](https://learn.pimoroni.com/tutorial/sandyj/getting-started-with-enviro-plus) (plus or mini).

![Enviro Mini](https://raw.githubusercontent.com/Dave0x21/PiTemp/master/Enviro-mini-pHAT.jpg)

#### Why this project?
This project is born as gift for my father's birthday, I'll continue to contribute to this to give the best possible expierence to anyone 

## Screenshot
![Home1](https://raw.githubusercontent.com/Dave0x21/PiTemp/master/screenshot/screenshot1.png)
![Home2](https://raw.githubusercontent.com/Dave0x21/PiTemp/master/screenshot/screenshot2.png)
![DayView](https://raw.githubusercontent.com/Dave0x21/PiTemp/master/screenshot/screenshot3.png)
![CustomView](https://raw.githubusercontent.com/Dave0x21/PiTemp/master/screenshot/screenshot4.png)

## Install
* Install dependecies listed in **dependecies.txt**
* Configure your raspberry

  ```
  raspi-config nonint do_i2c 0
  raspi-config nonint do_spi 0
  ```
  
* Clone this repo and launch install.sh

  ```
  git clone https://github.com/Dave0x21/PiTemp.git
  cd PiTemp
  bash install.sh
  ```
#### How to access the dashboard
You can access the web dashboard from your browser with the **ip address/hostname** of the raspberry pi

## Todo
* Real time update of current measurements and charts in home page
* Add a logo

## Credits
* **pitemp** file, wich make the measurements and dysplay them on onboard screen, is a modified version of [weather-and-light.py](https://github.com/pimoroni/enviroplus-python/blob/master/examples/weather-and-light.py) from [Enviro+ GitHub](https://github.com/pimoroni/enviroplus-python)
* Web interface is based on [AdminLTE](https://adminlte.io/)
