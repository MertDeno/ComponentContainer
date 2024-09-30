sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "parentapp/parentapp/model/formatter",
    "sap/ui/model/json/JSONModel",
    'sap/ui/core/BusyIndicator',
    "parentapp/parentapp/util/TemperatureService",
    "parentapp/parentapp/util/CityFetchService",
    "parentapp/parentapp/util/ForecastService"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageBox, formatter, JSONModel, BusyIndicator, TemperatureService, CityFetchService, ForecastService) {
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
                vCity = oView.byId("cityInput").getValue(),
                oCityFetchService = new CityFetchService()

                this.setEverythingNotVisible()

                oView.setBusy(true)

                oCityFetchService.getCity(vCity)
                    .then((oData) => {   
                        if(oData.length == 0){
                            MessageBox.error("City name cannot be found")
                            oView.setBusy(false)
                        }                     
                        else{
                            vCity = oData[0].name
                            this.showTemperature(vCity)     //The aim is reaching to the details of the city's weather status, so our code leads us to this function
                        }
                    })
                .catch(() => {
                    oView.setBusy(false)
                })
            },
            showTemperature: function(cityName){
                var oView = this.getView(),
                result = {},
                location = {},
                oService = new TemperatureService()

                oView.setBusy(true)              

                oService.getForecast(cityName)
                    .then((oData) => {
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
                        //In here we need to fetch the forecasts of the following seven days, in response to that our code calls this function
                    })
                    .then(() => {
//                        oView.setBusy(false)
                        this.showForecasts(cityName)
                    })
                    .catch(error => console.log(error))
            },
            showForecasts: function(cityName){
                //In this method, all the data will be visible via graphics which include both the max and min degrees of those following days
                var oView = this.getView(),
                    oForecastService = new ForecastService(),
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
                
                oView.setBusy(true)

                oForecastService.getForecasts(cityName)
                .then((oData) => {
                    oData.data.splice(0, 1)    //Since we need to fetch the following seven days, we remove the first data of the array            
                    oModelChart.setData(oData.data) //In this section, our aim is setting the parameters of the chart container via dynamic values
                    oView.setModel(oModelChart, "chartData")
                    oVizFrame.setVizProperties(properties)
                    oVizPopover.connect(oVizFrame.getVizUid());
                    this.setEverythingVisible()
                })
                .then(() => oView.setBusy(false))
                .catch((error) => MessageBox.error(error))

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
