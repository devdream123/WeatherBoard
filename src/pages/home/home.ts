
import { WeatherServiceProvider } from '../../providers/weather-service/weather.service';
import { ForecastServiceProvider } from '../../providers/forecast-service/forecast-service';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import * as moment from 'moment';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage{
  private weatherData:Object = {};
  private weatherDataMain:Object = {};  
  private weatherIcon;
  public forecastData:Object = {};
  public forecastList = [];
  private forecastWeather:Object = {};
  private hourlyList = [];
  private daysList = [];
  private hourly ;
  private day;
  private isToday: boolean;
  private errorMessage:any = '';
  constructor(public navCtrl: NavController, private weatherService: WeatherServiceProvider, private forecastService: ForecastServiceProvider) {

  }

 ionViewWillEnter(){
    this.getCurrentWeatherByCoord();
    this.getForecastByCoord();
  }


  public getCurrentWeatherByCoord(){
    this.weatherService.getWeatherByCoordinates().subscribe(   
      result => { 
        this.weatherData = result ;
        this.weatherDataMain = result.main;
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
    let now = moment().format('DD-MM-YY hh');
    let forecastUnixDate;
    let forecastDateHourTxt ;
    this.forecastList.splice(0,7).forEach(forecastElement => {
      this.forecastWeather= forecastElement.weather[0]; //array length of weather key always 1
      console.log("forecastElement.dt : " ,forecastElement.dt  );

      forecastUnixDate = forecastElement.dt * 1000;
      forecastDateHourTxt= moment(forecastUnixDate).format('DD-MM-YY hh');

        if(now <= forecastDateHourTxt ){
        this.isToday = true;
        this.hourly = moment(forecastUnixDate).format('h a');
        this.hourlyList.push({
          "hour" : this.hourly,
          "temp" : forecastElement.main.temp,
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
            "temp" : forecastElement.main.temp,
            "description" : this.forecastWeather['description'],
            "icon" :this.forecastWeather['icon']
          });
        }
      }
    });
  }
}
