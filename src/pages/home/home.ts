
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
       this.getHourlyForecast();
       this.getDaysForecast();
      },
      error => this.errorMessage = <any>error
    );    
  }
  
  private getHourlyForecast():void{
    let now = moment().format('DD-MM-YY hh');
    let forecastUnix;
    let forecastDateHourTxt ;
    this.forecastList.splice(0,7).forEach(forecastElement => {
      this.forecastWeather= forecastElement.weather[0]; //array length of weather key always 1
      forecastUnix = forecastElement.dt * 1000;
      forecastDateHourTxt= moment(forecastUnix).format('DD-MM-YY hh');

        if(now <= forecastDateHourTxt ){
        this.isToday = true;
        this.hourly = moment(forecastUnix).format('h a');
        this.hourlyList.push({
          "hour" : this.hourly,
          "temp" : forecastElement.main.temp,
          "temp_min" : forecastElement.main.temp_min,
          "temp_max" : forecastElement.main.temp_max,
          "description" : this.forecastWeather['description'],
          "icon" : this.forecastWeather['icon']
        });
        }
    });
  }

  private getDaysForecast():void{
    let forecastDateTxt ;
    let temporary ="";
    let forecastUnix;
    let today = moment().format('DD-MM-YY');
    this.forecastList.forEach(forecastElement => {
      this.forecastWeather= forecastElement.weather[0];
      forecastUnix = forecastElement.dt * 1000;
      forecastDateTxt= moment(forecastUnix).format('DD-MM-YY');

      if(today < forecastDateTxt){
       if( forecastDateTxt !== temporary){
         temporary = forecastDateTxt;
          this.isToday = true;
          this.day = moment(forecastUnix).format('dddd');
          this.daysList.push({
            "day" : this.day,
            "temp" : forecastElement.main.temp,
            "temp_min" : forecastElement.main.temp_min,
            "temp_max" : forecastElement.main.temp_max,
            "description" : this.forecastWeather['description'],
            "icon" : this.forecastWeather['icon']
          });
        }
      }
    });
  }


}
