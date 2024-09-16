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
            this._oPopover = this.getView().byId("idPopOver");
        },

        onTemperaturePress: function(){         //Function is fired when the temperature button is triggered 
            debugger
            var oView = this.getView(),
            oCity = oView.byId("cityInput").getValue(),
            oUrl = "https://api.api-ninjas.com/v1/city?name="+oCity,
            oHeaders = new Headers({
                "X-Api-Key": "Dt0G3/fCeMTymkweJEptGg==NK9Tes5myXpESOmr"
            })

            BusyIndicator.show(700)             //Busy indicator is triggered until all the data is fetched from APIs
            oView.byId("idChartContainer").setVisible(false)
            oView.byId("weatherDetail").setVisible(false)
            oView.byId("cityAndTime").setVisible(false)

            //All the containers are set to unvisible until the data is fetched
            
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
                    }
                    else{
                        this.showTemperature(oCity)     //The aim is reaching to the details of the city's weather status, so our code leads us to this function
                    }
//                    oData.length === 0 ? MessageBox.error("City name cannot be found") : this.showTemperature(oCity)
                })
                .catch((oError) => {
                    console.log("An error has occured:"+oError)
                    MessageBox.error("Invalid city name")
                    BusyIndicator.hide()
                })
            }
        },
        showTemperature: function(cityName){
            debugger
            var oView = this.getView(),
            apiKey = "48d9967e96c0df007dd1befcf3c57989",
            oUrl = `https://api.weatherstack.com/current?access_key=${apiKey}&query=${cityName}`,
            result = {},
            location = {}

            fetch(oUrl,{
                method: "GET"
            })
            .then((response) => {
                debugger
                return response.json()
            })
            .then((oData) => {          //After everything processed smoothly, our code will set values of the header section of the card
                debugger
                console.log(oData)
                result = oData.current
                location = oData.location
                var city = oData.request.query
                
                var oWeatherModel = new JSONModel({temperature:result.temperature, humidity:result.humidity, windRate: result.wind_speed});
                
                oView.byId("weatherDetail").setVisible(true)
                
                oView.byId("cityAndTime").setVisible(true)
                oView.byId("city").setText(city)
                oView.byId("time").setText(location.localtime)

                
                oView.byId("temperature").setText(result.temperature)
                oView.byId("humidity").setText(result.humidity)
                oView.byId("weatherStatus").setText(result.weather_descriptions[0])
                oView.byId("windRate").setText(result.wind_speed)
                oView.byId("temperatureImg").setSrc(result.weather_icons[0])
                oView.setModel(oWeatherModel, "temperatureModel")
                this.showForecasts(cityName)            //In here we need to fetch the forecasts of the following seven days, in response to that our code calls this function
            })
            .catch((oError) => {
                debugger
                console.log(oError)
                MessageBox.error("An error has occured")
                BusyIndicator.hide()
            })
        },
        showForecasts: function(cityName){
            //In this method, all the data will be visible via graphics which include both the max and min degrees of those following days
            debugger
            var oView = this.getView(),
                apikey = "bef87bd2ec8942b3877d4a1b5c6e43b8",
                oUrl = "https://api.weatherbit.io/v2.0/forecast/daily?city="+cityName+"&days=8&key="+apikey,
                oVizProperties = oView.byId("idChartContainer"),
                oModelChart = new JSONModel(),
                oVizFrame = oView.byId("idVizFrame"),
                oVizPopover = oView.byId("idPopOver"),
                properties = {
                    "title": {
                        "text": "Forecasts for "+cityName+" for a week"
                    },
                    'plotArea': {
                        'dataLabel': {
                            'visible': true
                        },
                        'drawingEffect':'glossy',
                        'isSmoothed': true							
                    },
                    'categoryAxis': {
                        'title': {
                            'visible': true
                        }
                    },
                    'legend': {
                        'visible': true
                    }
                }
            

            fetch(oUrl,{
                method: "GET"
            })
            .then((response) => response.json() )
            .then((oData) => {
                debugger
                oData.data.splice(0, 1)    //Since we need to fetch the following seven days, we remove the first data of the array            
                oModelChart.setData(oData.data) //In this section, our aim is setting the parameters of the chart container via dynamic values
                oView.setModel(oModelChart, "chartData")
                oVizFrame.setVizProperties(properties)
                oView.byId("idChartContainer").setVisible(true);
                oVizProperties.setVisible(true)
                oVizPopover.connect(oVizFrame.getVizUid());
                BusyIndicator.hide();
            })
            .catch((oError) => {
                console.log(oError)
                BusyIndicator.hide();
            })
        }
    });
});
