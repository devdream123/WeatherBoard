
import { WeatherServiceProvider } from '../../providers/weather-service/weather.service';
import { ForecastServiceProvider } from '../../providers/forecast-service/forecast.service';
import { LocationServiceProvider } from '../../providers/location-service/location-service';

import { Component, Input } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import * as moment from 'moment';
import { Geolocation, GeolocationOptions } from '@ionic-native/geolocation';
import { Events } from 'ionic-angular';
import 'rxjs/add/operator/filter';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage{
  @Input() locationInput:String;
  public weatherData:Object = {};
  public weatherDataMain:Object = {}; 
  public weatherDataWind:Object = {};  
  public weatherIcon;
  public forecastData:Object = {};
  public forecastList = [];
  public isToday: boolean;
  public currentDateToDisplay;
  private forecastWeather:Object = {};
  private hourlyList = [];
  private daysList = [];
  private hourly ;
  private day;
  private now ;
  private errorMessage:any = '';
  private latitude;
  private longtitude;
  private units = "metric";
  private unitSymbol = "C";

  constructor(public events: Events, public navCtrl: NavController, public loadingCtrl: LoadingController,  private weatherService: WeatherServiceProvider, private forecastService: ForecastServiceProvider, private geolocation: Geolocation, private locationService:LocationServiceProvider) {
  }

 ionViewWillEnter(){
  this.now =  moment();
  this.currentDateToDisplay = "Today " + this.now.format('DD-MM hh:mm a');
  this.longtitude = localStorage.getItem("new-long");
  this.latitude =localStorage.getItem("new-lat");
  console.log("new this.latitude-after reload",  this.latitude)
  console.log("new this.longtitude-after reload",  this.longtitude)
    if( this.latitude === null ||  this.longtitude === null){
      this.units = localStorage.getItem("newUnitTemp");
      if(this.units === "metric"){
        this.unitSymbol = "C";
      }else{
        this.unitSymbol = "F";
      }
      this.loadCurrentLocation();
    }else{
      this.units = localStorage.getItem("newUnitTemp");
      if(this.units === "metric"){
        this.unitSymbol = "C";
      }else{
        this.unitSymbol = "F";
      }
      this.getCurrentWeatherByCoord(this.latitude, this.longtitude, this.units);
      this.getForecastByCoord(this.latitude, this.longtitude, this.units);
    }
  }

  handleUnitChange(unit){
    localStorage.removeItem("newUnitTemp");
    console.log("unit-home: ", unit)
    localStorage.setItem("newUnitTemp", unit);
    this.units = unit;
    this.ionViewWillEnter();
    window.location.reload();
  }

  loadNewLocation(){
    this.getNewLocation(this.locationInput)
  }

  private getNewLocation(newLocation) {
    console.log("get new location")
    localStorage.removeItem("new-lat");
    localStorage.removeItem("new-long");
    this.locationService.queryLocation(newLocation).subscribe(
      (resp) => {
        console.log("new location resp -", resp);
        this.latitude = resp.candidates[0].geometry.location.lat;
        this.longtitude = resp.candidates[0].geometry.location.lng;
        localStorage.setItem("new-lat", this.latitude);
        localStorage.setItem("new-long",this.longtitude);
        window.location.reload();
      },
      (error) => {
        if (error.status === "OVER_QUERY_LIMIT"){
          alert ("You have exceeded your daily request quota for this API.");
        }else if (error.status === "ZERO_RESULTS" ){
          alert("No location found!")
        }
      }
    )
    console.log("new this.latitude",  this.latitude)
    console.log("new this.longtitude",  this.longtitude)
    
  }

  public loadCurrentLocation(){
    let geoOptions: GeolocationOptions = {
      enableHighAccuracy : true,
       timeout: 5000,
       maximumAge: 0
    };

   return this.geolocation.watchPosition(geoOptions)
    .filter((p) => p.coords !== undefined) //Filter Out Errors
    .subscribe(
      (resp) => {
        this.latitude = resp.coords.latitude;
        this.longtitude = resp.coords.longitude;
        this.getCurrentWeatherByCoord(this.latitude, this.longtitude, this.units);
        this.getForecastByCoord(this.latitude, this.longtitude, this.units);
      })
  }

  public doRefresh(refresher) {
    console.log('Begin async operation', refresher);
    let loader = this.loadingCtrl.create({
      content: "Please wait...",
      duration: 3000
    });
    loader.present();
    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
      location.reload();
    }, 3000);
  }

  private getCurrentWeatherByCoord(lat, lon, units){
    console.log("getCurrentWeather");
    console.log("units: ", units);

  return  this.weatherService.getWeatherByCoordinates(lat,lon, units).subscribe(   
      result => { 
        this.weatherData = result ;
        this.weatherDataMain = result.main;
        this.weatherDataWind = result.wind;
        this.weatherIcon = result.weather[0].icon + ".png";
      },
      error => this.errorMessage = <any>error
    );
  }
  
  private getForecastByCoord(lat, lon, units){
    console.log("getCurrentForecast");
    console.log("units: ", units);

  return this.forecastService.getForecastByCoord(lat, lon, units).subscribe(   
      result => { 
       this.forecastData = result.city;
       this.forecastList = result.list;
       this.getDaysForecast();
       this.getHourlyForecast();
      },
      error => this.errorMessage = <any>error
    ); 
  }
  
  private getHourlyForecast():void{
    let forecastUnixDate;
    let isBeforeNextDay;
    this.forecastList.splice(0,7).forEach(forecastElement => {
      this.forecastWeather= forecastElement.weather[0]; //array length of weather key always 1
      forecastUnixDate = moment(forecastElement.dt * 1000);

        isBeforeNextDay = this.now.isBefore(forecastUnixDate);
        if(isBeforeNextDay){
        this.isToday = true;
        this.hourly = moment(forecastUnixDate).format('h a');
        this.hourlyList.push({
          "hour" : this.hourly,
          "temp" : parseInt(forecastElement.main.temp),
          "description" : this.forecastWeather['description'],
          "icon" : this.forecastWeather['icon']
        });
        }
    });
  }

  private getDaysForecast():void{
    let temporary ="";
    let forecastUnixDate;
    let isBeforeNextDay;
    let forecastFixedHr;
    this.forecastList.forEach(forecastElement => {
      this.forecastWeather= forecastElement.weather[0];
      
      forecastUnixDate = moment(forecastElement.dt * 1000)
      forecastFixedHr = moment(forecastUnixDate).format('hh:mm a');
      isBeforeNextDay = this.now.isBefore(forecastUnixDate);
      /*Due to the api return every 3 hours/5 days forecast, we need to pick an hour within that day to display an approximate weather condition*/

      if(isBeforeNextDay && forecastFixedHr === "10:00 am"){
       if( forecastUnixDate !== temporary){
         temporary = forecastUnixDate;         
          this.day = moment(forecastUnixDate).format('dddd');
          this.daysList.push({
            "unixTime" : forecastElement.dt,
            "day" : this.day,
            "temp" : parseInt(forecastElement.main.temp),
            "description" : this.forecastWeather['description'],
            "icon" :this.forecastWeather['icon']
          });
        }
      }
    });
  }
}