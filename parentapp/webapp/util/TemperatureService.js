sap.ui.define([
    'sap/ui/base/Object',
    'sap/m/MessageToast'
], function(BaseObject, MessageToast) {
    'use strict';
    
    const TemperatureService = BaseObject.extend("parentapp.parentapp.util.TemperatureService")

    TemperatureService.prototype.getForecast = function(sCity){
        if(!sCity){
            MessageToast.show("City is required")
        }

        return new Promise((resolve, reject) => {
            var temperatureApiUrl = `http://localhost:8080/getTemperature?city=${sCity}`
            fetch(temperatureApiUrl)
                .then(response => resolve(response.json()))
                .catch(error => reject(error))
        })
    }

    return TemperatureService
});