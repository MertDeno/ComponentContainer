sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "parentapp/parentapp/model/formatter",
    "sap/ui/model/json/JSONModel",
    'sap/ui/core/BusyIndicator'
],
function (Controller, MessageBox, formatter, JSONModel, BusyIndicator) {
    "use strict";

    return Controller.extend("parentapp.parentapp.controller.ParentView", {
        formatter: formatter,
        onInit: function () {
            debugger
            var oView = this.getView(),
                oViewModel = new JSONModel({
                    temperature : 0,
                    humidity: 0,
                    windRate: 0
                });
            oView.setModel(oViewModel, "temperatureModel")
            console.log(1)
        },

        onTemperaturePress: function(oEvent){
            debugger
            var oView = this.getView(),
//            oModel = new sap.ui.model.json.JSONModel(),
            oCity = oView.byId("city").getValue(),
            oTemperature = oView.byId("temperature"),
            oUrl = "https://api.api-ninjas.com/v1/city?name="+oCity,
            oHeaders = new Headers({
                "X-Api-Key": "Dt0G3/fCeMTymkweJEptGg==NK9Tes5myXpESOmr"
            }),
            result = {}

            BusyIndicator.show(500)
            oView.byId("weatherDetail").setVisible(false)
            
            if(oCity == ""){
                MessageBox.error("City name cannot be blank") 
                BusyIndicator.hide()
                return
            }

            //oCity == "" ? (MessageBox.error("City name cannot be blank"), BusyIndicator.hide()) : oCity = oCity

            if(oCity != ""){                
                fetch(oUrl, {
                    method: "GET",
                    headers: oHeaders
                })
                .then((oResponse) => {
                    debugger
                    return oResponse.json() 
                })
                .then((oData) => {
                    // Set the API data into the model
                    debugger
                    oCity = oData[0].name
                    if(oData.length === 0){
                        MessageBox.error("City name cannot be found")
                        BusyIndicator.hide()
                    }
                    else{
                        this.showTemperature(oCity)
                    }
//                    oData.length === 0 ? MessageBox.error("City name cannot be found") : this.showTemperature(oCity)
                })
                .catch((oError) => {
                    console.log("An error has occured:"+oError)
                    MessageBox.error("An error has occured")
                    BusyIndicator.hide()
                })
            }
//            this.getView().setModel(oModel, "cityModel")
        },
        showTemperature: function(cityName){
            debugger
            var APIKey = "48d9967e96c0df007dd1befcf3c57989",
//            var APIKey = "9j1FFEiRH3H8d7jqu9uvtMJF74G2GVsk",
            oView = this.getView(),
            oUrl = "https://api.weatherstack.com/current?access_key="+APIKey+"&query="+cityName,
//            oUrl = "https://api.tomorrow.io/v4/weather/realtime?location="+cityName+"&apikey="+APIKey,
            oModel = new JSONModel(),
            oTemperature = oView.byId("temperature"),
            result = {},
            location = {}
        
            fetch(oUrl,{
                method: "GET"
            })
            .then((response) => {
                debugger
                return response.json()
            })
            .then((oData) => {
                debugger
                console.log(oData)
//                result = oData.data.values
                result = oData.current
                location = oData.location
                var city = oData.request.query
                
                var oWeatherModel = new JSONModel({temperature:result.temperature, humidity:result.humidity, windRate: result.wind_speed});
                
                oView.byId("weatherDetail").setVisible(true)
                BusyIndicator.hide()
                
                oView.byId("weatherDetailHeader").setTitle(city)
                oView.byId("weatherDetailHeader").setSubtitle(location.localtime)
                oView.byId("temperature").setText(result.temperature)
                oView.byId("humidity").setText(result.humidity)
                oView.byId("weatherStatus").setText(result.weather_descriptions[0])
                oView.byId("windRate").setText(result.wind_speed)
                oView.byId("temperatureImg").setSrc(result.weather_icons[0])
                oView.setModel(oWeatherModel, "temperatureModel")
            })
            .catch((oError) => {
                debugger
                console.log(oError)
                MessageBox.error("An error has occured")
                BusyIndicator.hide()
            })
        }
    });
});
