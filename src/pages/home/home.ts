
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
export class HomePage {
  @Input() locationInput: String;
  public weatherData: Object = {};
  public weatherDataMain: Object = {};
  public weatherDataWind: Object = {};
  public weatherIcon: any;
  public forecastData: Object = {};
  public forecastList = [];
  public isToday: boolean;
  public currentDateToDisplay;
  private forecastWeather: Object = {};
  private hourlyList = [];
  private daysList = [];
  private hourly: any;
  private day: any;
  private now: any;
  public latitude: any;
  public longtitude: any;
  public units: String = "metric";
  public unitSymbol: String = "C";
  public windUnit: String = "m/s";
  public errorMessage: any = '';


  constructor(public events: Events, public navCtrl: NavController, public loadingCtrl: LoadingController, private weatherService: WeatherServiceProvider, private forecastService: ForecastServiceProvider, private geolocation: Geolocation, private locationService: LocationServiceProvider) {
  }

  ionViewWillEnter() {
    this.now = moment();
    this.currentDateToDisplay = "Today " + this.now.format('DD-MM hh:mm a');
    this.longtitude = localStorage.getItem("new-long");
    this.latitude = localStorage.getItem("new-lat");
    console.log("new this.latitude-after reload", this.latitude)
    console.log("new this.longtitude-after reload", this.longtitude)
    if (this.latitude === null || this.longtitude === null) {
      this.units = localStorage.getItem("newUnitTemp");
      if (this.units === "metric") {
        this.unitSymbol = "C";
        this.windUnit = "m/s"
      } else {
        this.unitSymbol = "F";
        this.windUnit = "mi/hr"
      }
      this.loadCurrentLocation();
    } else {
      this.units = localStorage.getItem("newUnitTemp");
      if (this.units === "metric") {
        this.unitSymbol = "C";
        this.windUnit = "m/s"
      } else {
        this.unitSymbol = "F";
        this.windUnit = "mi/hr"
      }
      this.getCurrentWeatherByCoord(this.latitude, this.longtitude, this.units);
      this.getForecastByCoord(this.latitude, this.longtitude, this.units);
    }
  }

  handleUnitChange(unit) {
    localStorage.removeItem("newUnitTemp");
    console.log("unit-home: ", unit)
    localStorage.setItem("newUnitTemp", unit);
    this.units = unit;
    this.ionViewWillEnter();
    window.location.reload();
  }

  loadNewLocation() {
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
        localStorage.setItem("new-lat", this.latitude.toString());
        localStorage.setItem("new-long", this.longtitude.toString());
        window.location.reload();
      },
      (error) => {
        if (error.status === "OVER_QUERY_LIMIT") {
          alert("You have exceeded your daily request quota for this API.");
        } else if (error.status === "ZERO_RESULTS") {
          alert("No location found!")
        }
      }
    )
    console.log("new this.latitude", this.latitude)
    console.log("new this.longtitude", this.longtitude)

  }

  public loadCurrentLocation() {
    let geoOptions: GeolocationOptions = {
      enableHighAccuracy: true,
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

  private getCurrentWeatherByCoord(lat, lon, units) {
    return this.weatherService.getWeatherByCoordinates(lat, lon, units).subscribe(
      result => {
        console.log("result: ", result)
        this.weatherData = result;
        this.weatherDataMain = result.main;
        this.weatherDataWind = result.wind;
        this.weatherIcon = result.weather[0].icon + ".png";
      },
      error => this.errorMessage = <any>error
    );
  }

  private getForecastByCoord(lat, lon, units) {
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

  private getHourlyForecast(): void {
    let forecastUnixDate;
    let isBeforeNextDay;
    this.forecastList.splice(0, 7).forEach(forecastElement => {
      this.forecastWeather = forecastElement.weather[0]; //array length of weather key always 1
      forecastUnixDate = moment(forecastElement.dt * 1000);
      isBeforeNextDay = this.now.isBefore(forecastUnixDate);

      if (isBeforeNextDay) {
        this.isToday = true;
        this.hourly = moment(forecastUnixDate).format('h a');
        this.hourlyList.push({
          "hour": this.hourly,
          "temp": parseInt(forecastElement.main.temp),
          "description": this.forecastWeather['description'],
          "icon": this.forecastWeather['icon']
        });

      }
    });
  }

  private getDaysForecast(): void {
    let forecastUnixDate;
    let prevDay, forecastDay, forecastTime;
    prevDay = this.now.format('dddd');
    this.forecastList.forEach(forecastElement => {
      this.forecastWeather = forecastElement.weather[0];
      forecastUnixDate = moment(forecastElement.dt * 1000)
      forecastDay = moment(forecastElement.dt_txt).format("dddd"); //return day eg: Monday
      forecastTime = moment(forecastElement.dt_txt).format("HH"); //return 24 hours eg: 04 or 23

      //check if forecast and take midday temp
      if (prevDay !== forecastDay && forecastTime > 11) {
        prevDay = forecastDay;
        this.day = moment(forecastUnixDate).format('dddd');
        this.daysList.push({
          "unixTime": forecastElement.dt,
          "day": this.day,
          "temp": parseInt(forecastElement.main.temp),
          "description": this.forecastWeather['description'],
          "icon": this.forecastWeather['icon']
        });
      }
    }
    );
  }
}