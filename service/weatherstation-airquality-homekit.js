'use strict';

var homebridge;
var Characteristic;

module.exports = function(pHomebridge) {
  if (pHomebridge && !homebridge) {
    homebridge = pHomebridge;
    Characteristic = homebridge.hap.Characteristic;
  }

  class AirQualityService extends homebridge.hap.Service.AirQualitySensor {
    constructor(accessory) {
      super(accessory.name + " Air Quality");
      this.accessory = accessory;

      this.getCharacteristic(Characteristic.AirQuality)
        .on('get', this.getAirQuality.bind(this))
        .eventEnabled = true;

      var co2LevelCharacteristic = this.getCharacteristic(Characteristic.CarbonDioxideLevel) ||
                                   this.addCharacteristic(Characteristic.CarbonDioxideLevel);

      co2LevelCharacteristic.on('get', this.getCarbonDioxideLevel.bind(this))
                            .eventEnabled = true;
    }

    updateCharacteristics() {
      this.getCharacteristic(Characteristic.AirQuality)
            .updateValue(this.transformCO2ToAirQuality());
      this.getCharacteristic(Characteristic.CarbonDioxideLevel)
            .updateValue(this.accessory.co2);
    }

    getAirQuality(callback) {
      this.accessory.refreshData(function(err,data) {
        callback(err, this.transformCO2ToAirQuality());
      }.bind(this));
    }

    getCarbonDioxideLevel(callback) {
      this.accessory.refreshData(function(err,data) {
        callback(err, this.accessory.co2);
      }.bind(this));
    }

    transformCO2ToAirQuality() {
      var level = this.accessory.co2;
      var quality = Characteristic.AirQuality.UNKNOWN;

      if (level > 2000) quality = Characteristic.AirQuality.POOR;
      else if (level > 1500) quality = Characteristic.AirQuality.INFERIOR;
      else if (level > 1000) quality = Characteristic.AirQuality.FAIR;
      else if (level > 500) quality = Characteristic.AirQuality.GOOD;
      else if (level > 0) quality = Characteristic.AirQuality.EXCELLENT;
  
      return quality;
    }

  }

  return AirQualityService;
};
