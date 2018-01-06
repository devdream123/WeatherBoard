
import { WeatherServiceProvider } from '../../providers/weather-service/weather.service';
import { ForecastServiceProvider } from '../../providers/forecast-service/forecast.service';
import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import * as moment from 'moment';
import { Geolocation } from '@ionic-native/geolocation';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage{
  private weatherData:Object = {};
  private weatherDataMain:Object = {}; 
  private weatherDataWind:Object = {};  
  private weatherIcon;
  public forecastData:Object = {};
  public forecastList = [];
  private forecastWeather:Object = {};
  private hourlyList = [];
  private daysList = [];
  private hourly ;
  private day;
  private isToday: boolean;
  private now ;
  public currentDateToDisplay;
  private errorMessage:any = '';
  private latitude;
  private longtitude;
  private units;
  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController, private weatherService: WeatherServiceProvider, private forecastService: ForecastServiceProvider, private geolocation: Geolocation) {
    this.now =  moment();
    this.currentDateToDisplay = "Today " + this.now.format('DD-MM hh:mm a');
  }

 ionViewWillEnter(){
    this.loadCurrentLocation();
   
  }

  public loadCurrentLocation(){
    this.geolocation.getCurrentPosition().then(
      (resp) => {
        this.latitude = resp.coords.latitude;
        this.longtitude = resp.coords.longitude;
        this.units = "metric";
        this.getCurrentWeatherByCoord(this.latitude, this.longtitude, this.units);
        this.getForecastByCoord(this.latitude, this.longtitude, this.units);
      }).catch(
        (error) => {
        console.log('Error getting location: ',error);
      });
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
      window.location.reload();
    }, 3000);


  }

  private getCurrentWeatherByCoord(lat, lon, units){
    this.weatherService.getWeatherByCoordinates(lat,lon, units).subscribe(   
      result => { 
        this.weatherData = result ;
        this.weatherDataMain = result.main;
        this.weatherDataWind = result.wind;
        this.weatherIcon = result.weather[0].icon + ".png";
      },
      error => this.errorMessage = <any>error
    );
  }
  private getForecastByCoord(lat, lon, units):void{
    this.forecastService.getForecastByCoord(lat, lon, units).subscribe(   
      result => { 
       this.forecastData = result.city;
       this.forecastList = result.list;
       console.log("this.forecastList: " , this.forecastList);
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
