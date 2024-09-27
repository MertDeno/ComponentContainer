sap.ui.define([], function() {
    "use strict";

    return {
        formatTemperature: function(temperature) {
            return temperature + " °C";  // Append Celsius degree symbol
        },
        formatHumidity: function(humidity) {
            return humidity + " g/m3";  // Append Celsius degree symbol
        },
        formatWindRate: function(windRate) {
            return windRate + " knot";  // Append Celsius degree symbol
        }
    };
});
