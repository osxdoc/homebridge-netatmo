# homebridge-netatmo

This is a plugin for homebridge. It's a working implementation for several Netatmo devices:

* **Netatmo Weather Station**
* **Netatmo Thermostat**
* **Netatmo Welcome** 

_Please check [notes on devices](#notes) below for detailed information on supported modules_.

# Disclaimer

This is a lightly modified fork for my personal use, all credit goes to [planetk](https://github.com/planetk/homebridge-netatmo).

# Installation

1. Install homebridge using: npm install -g homebridge
2. Install this plugin using: npm install -g homebridge-netatmo-schmittx
3. Update your configuration file. See sample-config.json in this repository for a sample. 

# Configuration

## Simple Configuration


Configuration sample:

```
"platforms": [
  {
    "platform": "Netatmo",
    "name": "Netatmo Platform",
    "auth": {
      "client_id": "Create at https://dev.netatmo.com/",
      "client_secret": "Create at https://dev.netatmo.com/",
      "username": "Your Netatmo username",
      "password": "Your Netatmo password"
    }
  }
],

```

To retrieve client id and secret please follow following guide:

1. Register at http://dev.netatmo.com as a developer
2. After successful registration, create your own app by using the menu entry "CREATE AN APP"
3. On the following page, enter a name for your app. Any name can be chosen. All other fields of the form (like callback url, etc.) can be left blank.
4. After successfully submitting the form, the overview page of your app should show client id and secret.


## Advanced Configuration

There are some optional configuration options in the Netatmo section of the config which provide finer control about what device and services to use to create accessories.

### API Refresh and Timing

Communication towards Netatmo API is controlled by three parameters:

#### ttl

Time in seconds, how long data will be kept in the internal cache. Mainly useful to avoid duplicate requests for different values from the same device. Defaults to 10 seconds if left out of config.
#### refresh_check

Time in milliseconds, how often the API will be automatically polled to check for changes. Defaults to 900000 which is 15 minutes. Do not take values much lower, or you risk that you put too much traffic to the Netatmo API. In worst case Netatmo might temporarilly exclude your app from the API.

#### refresh_run

Time in milliseconds, how often the the module checks if there was a request to refresh the data, either from the automatic polling or due to changes in the HomeKit app. This allows regular checks as well as refreshes after changes were done in the app. Defaults to 20000 which is 20 seconds.

```
"platforms": [
  {
    "platform": "Netatmo",
      ...
      "ttl": 10,
      "refresh_check": 900000,
      "refresh_run": 20000,
      ...
  }
],
```

### Filter Accessories by Device Type

This allows you to include and/or exclude devices of a certain type in your accessories.

The device types marked **bold** are the **default types** if this config section is left out.

Please note, that Welcome support is by default switched off, since it is not fully implemented yet.

```
"platforms": [
  {
    "platform": "Netatmo",
      ...
      "device_types": [
        "camera",
        "thermostat",
        "weatherstation"
      ],
      ...
  }
],
```

###  Filter Accessories by Device ID

Controlling devices can be done on a finer level by ID. The ID of a Netatmo device or module is it's MAC address.

In order to include or exclude a specific device, the corresponding ID can be included in a whitelist or blacklist respectively.

If the whitelist contains at least one entry, all other ids will be excluded.

```
"platforms": [
  {
    "platform": "Netatmo",
      ...
      "whitelist": [
        "aa:bb:cc:11:22:33"
      ],
      "blacklist": [
        "01:02:03:04:05:06",
        "01:23:45:67:89:ab"
      ],
      ...
  }
],
```

## Weather station

The indoor module and outdoor module are fully supported.

The rain gauge and the wind gauge are in general supported, but these devices use characteristics which are not supported by the native iOS Home app.

For this reason the Home app shows the devices as not supported. If you want to use this devices you should consider to use a different homekit app. For example Elgato's <a href="https://itunes.apple.com/us/app/elgato-eve/id917695792" target="blank">Eve</a> app is a good free alternative.

## Thermostat

The thermostat is fully supported. There are a few things to know:

* The allowed temperature ranges differ between Netatmo themostat and iOS Home app. This results in a narrower range of possible temperatures.
* Mapping of temperature modes between Netatmo and HomeKit is done as good as possible, but might be slightly confusing under certain conditions.
* After setting a temperature, the thermostat might return to automatic mode. Check your Netatmo settings.

## Cameras (Welcome and Presence)

The camera devices are currently only supported as simple motion sensors.

Motion detection might be delayed, since the polling is required an Netatmo has strict request rate limits.

Any events of type "movement", "person" and "outdoor" will be considered as a motion.
