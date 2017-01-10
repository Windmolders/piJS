# πJS - Tobania

Code run on a GoPiGo 2 (Raspberry PI 3) to run a car trough a website ( with optional controller support ).

## Authors

* Benno Daenen
* Jonas Windmolders
* Sam De Boeck

## Requirements

* Raspbian ( Or another linux based OS )
* NodeJS (6.x) + NPM
* Git
* WiFi (or a very long ethernet cable ;) ) -> You can use a hotspot instead of normal wifi to control the car.

## Installation

Clone the project to a folder
```shell
git clone https://github.com/Windmolders/piJS.git
```
Install dependencies
```shell
cd client && npm install
```

## Running the instances

Run server

```shell
node web/server.js
```

Run pi client

```shell
node client/src/pi.js
```

##Using the pi

Surf to the website with the IP of the pi with port '8080', eg:

```
127.0.0.1:8080
```

Secondly , fill in the IP of the bot with port 9090 to connect to it. (This is a feature to allow hosting the website on another address than the pi client.)

```
127.0.0.1:9090
```

You can now use the buttons or QZSD (AWSD) or your game controller.