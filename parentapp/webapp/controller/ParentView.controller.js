sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "parentapp/parentapp/model/formatter",
    "sap/ui/model/json/JSONModel",
    'sap/ui/core/BusyIndicator'    
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageBox, formatter, JSONModel, BusyIndicator) {
        "use strict";

        return Controller.extend("parentapp.parentapp.controller.ParentView", {
            formatter: formatter,
            onInit: function () {
                var oView = this.getView(),
                    oViewModel = new JSONModel({
                        temperature : 0,
                        humidity: 0,
                        windRate: 0,
                        weatherDetailVisible: false,
                        cityAndTimeVisible: false
                    });
                oView.setModel(oViewModel, "temperatureModel")
                this._oPopover = this.getView().byId("idPopOver");
            },
    
            onTemperaturePress: function(){         //Function is fired when the temperature button is triggered 
                var oView = this.getView(),
                oCity = oView.byId("cityInput").getValue(),
                oUrl = "http://localhost:8080/getCityData?city="+oCity

                BusyIndicator.show(700)             //Busy indicator is triggered until all the data is fetched from APIs
                this.setEverythingNotVisible()
    
                //All the containers are set to unvisible until the data is fetched
                
                if(oCity == ""){
                    MessageBox.error("City name cannot be blank") 
                    BusyIndicator.hide()
                    return
                }
    
                //oCity == "" ? (MessageBox.error("City name cannot be blank"), BusyIndicator.hide()) : oCity = oCity
    
                if(oCity != ""){                
                    fetch(oUrl,{
                        method: "GET"
                    })
                    .then((oResponse) => {
                        return oResponse.json() 
                    })
                    .then((oData) => {
                        // Set the API data into the model
                        if(oData.length === 0){
                            MessageBox.error("City name cannot be found")
                            BusyIndicator.hide()
                        }
                        else{
                            oCity = oData[0].name
                            this.showTemperature(oCity)     //The aim is reaching to the details of the city's weather status, so our code leads us to this function
                        }
    
                    })
                    .catch((oError) => {
                        console.log("An error has occured:"+oError)
                        MessageBox.error("Invalid city name")
                        BusyIndicator.hide()
                    })
                }
            },
            showTemperature: function(cityName){
                var oView = this.getView(),
                oUrl = `http://localhost:8080/getTemperature?city=${cityName}`,
                result = {},
                location = {}
    
                fetch(oUrl,{
                    method: "GET"
                })
                .then((response) => {
                    return response.json()
                })
                .then((oData) => {          //After everything processed smoothly, our code will set values of the header section of the card
                    result = oData.current
                    location = oData.location
                    var city = oData.request.query
                    
                    var oWeatherModel = new JSONModel({
                        temperature:result.temperature, 
                        humidity:result.humidity, 
                        windRate: result.wind_speed, 
                        weatherDescription:{
                            weather_desc:result.weather_descriptions
                        },
                        weatherIcon:{
                            weather_icon: result.weather_icons
                        },
                        city: city,
                        time: location.localtime,
                        weatherDetailVisible: true,
                        cityAndTimeVisible: true
                    });
                    
                    oView.setModel(oWeatherModel, "temperatureModel")
                    this.showForecasts(cityName)            //In here we need to fetch the forecasts of the following seven days, in response to that our code calls this function
                })
                .catch((oError) => {
                    console.log(oError)
                    MessageBox.error("An error has occured")
                    BusyIndicator.hide()
                })
            },
            showForecasts: function(cityName){
                //In this method, all the data will be visible via graphics which include both the max and min degrees of those following days
                var oView = this.getView(),
                    oUrl = `http://localhost:8080/getForecasts?city=${cityName}`,
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
                    oData.data.splice(0, 1)    //Since we need to fetch the following seven days, we remove the first data of the array            
                    oModelChart.setData(oData.data) //In this section, our aim is setting the parameters of the chart container via dynamic values
                    oView.setModel(oModelChart, "chartData")
                    oVizFrame.setVizProperties(properties)
                    oVizPopover.connect(oVizFrame.getVizUid());
                    BusyIndicator.hide();
                    this.setEverythingVisible()
                })
                .catch((oError) => {
                    console.log(oError)
                    BusyIndicator.hide();
                })
            },

            setEverythingVisible: function(){
                var oView = this.getView(),
                oVizProperties = oView.byId("idChartContainer")

                oView.byId("idChartContainer").setVisible(true);
                oVizProperties.setVisible(true)
            },

            setEverythingNotVisible: function(){
                var oView = this.getView()

                oView.byId("idChartContainer").setVisible(false)
                oView.byId("cityAndTime").setVisible(false)
                oView.byId("weatherDetail").setVisible(false)                
            }
        });
    });
