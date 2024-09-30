sap.ui.define([
    'sap/ui/base/Object',
    'sap/m/MessageBox'
], function(BaseObject, MessageBox) {
    'use strict';
    
    const ForecastService = BaseObject.extend("parentapp.parentapp.util.ForecastService")

    ForecastService.prototype.getForecasts = async function(sCity){
        var forecastApiUrl = `http://localhost:8080/getForecasts?city=${sCity}`

        try {
            const response = await fetch(forecastApiUrl)
            const result = await response.json()
            return result
        } catch (error) {
            MessageBox.error("An error has occured")
        }

/*         return new Promise((resolve, reject) => {
            var forecastApiUrl = `http://localhost:8080/getForecasts?city=${sCity}`

            fetch(forecastApiUrl)
                .then(response => resolve(response.json()))
                .catch(error => reject(error))
        }) */
    }
    
    return ForecastService
});