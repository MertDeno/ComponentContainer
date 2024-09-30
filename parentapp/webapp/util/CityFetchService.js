sap.ui.define([
    'sap/ui/base/Object',
    'sap/m/MessageBox'
], function(BaseObject, MessageBox) {
    'use strict';
    
    const CityFetchService = BaseObject.extend("parentapp.parentapp.util.CityFetchService")

    CityFetchService.prototype.getCity =  function(sCity){
        if(sCity.length == 0){
            MessageBox.error("City cannot be blank")
        }

        return new Promise((resolve, reject) => {
            var cityFetchUrl = `http://localhost:8080/getCityData?city=${sCity}`
            fetch(cityFetchUrl)
                .then(response => resolve(response.json()))
                .catch(error => reject(error))
        })
    }

    return CityFetchService
});