
import { WeatherServiceProvider } from '../../providers/weather-service/weather.service';
import { ForecastServiceProvider } from '../../providers/forecast-service/forecast-service';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import * as moment from 'moment';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  private weatherData:Object = {};
  private weatherDataMain:Object = {};  
  private weatherIcon;
  private forecastData:Object = {};
  private forecastList = [];
  private forecastWeather:Object = {};
  private hourlyList = [];
  private hourly ;
  private isToday: boolean;
  constructor(public navCtrl: NavController, private weatherService: WeatherServiceProvider, private forecastService: ForecastServiceProvider) {

  }

  ionViewWillEnter(){
    this.getCurrentWeatherByCoord();
    this.getForecastByCoord();
  }


  getCurrentWeatherByCoord(){
    this.weatherService.getWeatherByCoordinates().subscribe(   
      result => { 
        this.weatherData = result ;
        this.weatherDataMain = result.main;
        this.weatherIcon = result.weather[0].icon + ".png";
      });
  }


  getForecastByCoord(){
    let forecastDateTxt ;
    let now = moment().utc().format('DD-MM-YY hh');
    let nextDayForecast;
    this.forecastService.getForecastByCoord().subscribe(   
      result => { 
       this.forecastData = result.city;
       this.forecastList = result.list;
       console.log("this.forecastList: " , this.forecastList);
       
       this.forecastList.splice(0,7).forEach(forecastElement => {

         this.forecastWeather= forecastElement.weather[0]; //array length always 1
         nextDayForecast = moment(this.forecastList[0].dt_txt).add(1,"days").format('DD-MM-YY hh');
         forecastDateTxt= moment(forecastElement.dt_txt).format('DD-MM-YY hh');
         console.log("nextDayForecast: " + nextDayForecast);
         
         if(now <= forecastDateTxt ){
          this.isToday = true;
          this.hourly = moment(forecastElement.dt_txt).format('h a');
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
        console.log("this.hourlyList: " + this.hourlyList);
      });
  }

}
