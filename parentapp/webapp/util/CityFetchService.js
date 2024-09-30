sap.ui.define([
    'sap/ui/base/Object',
    'sap/m/MessageBox'
], function(BaseObject, MessageBox) {
    'use strict';
    
    const CityFetchService = BaseObject.extend("parentapp.parentapp.util.CityFetchService")

    CityFetchService.prototype.getCity = async function(sCity){
        var cityFetchUrl = `http://localhost:8080/getCityData?city=${sCity}`
        
        if(sCity.length == 0){
            MessageBox.error("City cannot be blank")
        }
        else{
            try {
                const response = await fetch(cityFetchUrl)
                const result = await response.json()
                return result
            } catch (error) {
                debugger
                MessageBox.error("An error has occured")
            }
        }
        
        

/*      return new Promise((resolve, reject) => {
            var cityFetchUrl = `http://localhost:8080/getCityData?city=${sCity}`
            fetch(cityFetchUrl)
                .then(response => resolve(response.json()))
                .catch(error => reject(error))
        }) */
    }

    return CityFetchService
});