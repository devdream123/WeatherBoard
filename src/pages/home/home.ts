
import { WeatherServiceProvider } from '../../providers/weather-service/weather.service';
import { ForecastServiceProvider } from '../../providers/forecast-service/forecast-service';
import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import * as moment from 'moment';


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
  private today ;
  private errorMessage:any = '';
  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController, private weatherService: WeatherServiceProvider, private forecastService: ForecastServiceProvider) {
    this.today =  moment().format('dddd DD MMMM hh:mm a');
  }

 ionViewWillEnter(){
    this.getCurrentWeatherByCoord();
    this.getForecastByCoord();
  }

  doRefresh(refresher) {
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
    }, 2000);


  }

  public getCurrentWeatherByCoord(){
    this.weatherService.getWeatherByCoordinates().subscribe(   
      result => { 
        this.weatherData = result ;
        this.weatherDataMain = result.main;
        this.weatherDataWind = result.wind;
        this.weatherIcon = result.weather[0].icon + ".png";
      },
      error => this.errorMessage = <any>error
    );
  }
  public getForecastByCoord():void{
    this.forecastService.getForecastByCoord().subscribe(   
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
    let now = moment();
    let forecastUnixDate;
    let isBeforeNextDay;
    this.forecastList.splice(0,7).forEach(forecastElement => {
      this.forecastWeather= forecastElement.weather[0]; //array length of weather key always 1
      forecastUnixDate = moment(forecastElement.dt * 1000);

        isBeforeNextDay = now.isBefore(forecastUnixDate);
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
    let forecastDateTxt ;
    let temporary ="";
    let forecastUnixDate;
    let today = moment().format('DD-MM-YY');
    let forecastFixedHr;
    this.forecastList.forEach(forecastElement => {
      this.forecastWeather= forecastElement.weather[0];
      
      forecastUnixDate = forecastElement.dt *1000;
      forecastDateTxt= moment(forecastUnixDate).format('DD-MM-YY');
      forecastFixedHr = moment(forecastUnixDate).format('hh:mm a');
      
      /*Due to the api return every 3 hours/5 days forecast, we need to pick an hour within that day to display an approximate weather condition*/
      if(today < forecastDateTxt && forecastFixedHr === "10:00 am"){
       if( forecastDateTxt !== temporary){
         temporary = forecastDateTxt;         
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
