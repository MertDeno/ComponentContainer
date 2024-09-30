sap.ui.define([
    'sap/ui/base/Object',
    'sap/m/MessageBox'
], function(BaseObject, MessageBox) {
    'use strict';
    
    const TemperatureService = BaseObject.extend("parentapp.parentapp.util.TemperatureService")

    TemperatureService.prototype.getForecast = async function(sCity){
        var temperatureApiUrl = `http://localhost:8080/getTemperature?city=${sCity}`
   
        try {
            const response = await fetch(temperatureApiUrl)
            const result = await response.json()
            return result
        } catch (error) {
            MessageBox.error("An error has occured")
        }

    }

    return TemperatureService
});




/*         if(!sCity){
            MessageToast.show("City is required")
        }
 */
/*         return new Promise((resolve, reject) => {
            fetch(temperatureApiUrl)
                .then(response => resolve(response.json()))
                .catch(error => reject(error))
        }) */