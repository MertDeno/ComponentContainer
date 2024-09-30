sap.ui.define([
    'sap/ui/base/Object',
    'sap/m/MessageBox'
], function(BaseObject, MessageBox) {
    'use strict';
    
    const ForecastService = BaseObject.extend("parentapp.parentapp.util.ForecastService")

    ForecastService.prototype.getForecasts = function(sCity){
        return new Promise((resolve, reject) => {
            var forecastApiUrl = `http://localhost:8080/getForecasts?city=${sCity}`

            fetch(forecastApiUrl)
                .then(response => resolve(response.json()))
                .catch(error => reject(error))
        })
    }
    
    return ForecastService
});