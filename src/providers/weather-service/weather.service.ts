import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

/*
  Generated class for the WeatherServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class WeatherServiceProvider {
  private baseUrl: string = "../../assets/json/weather.local.json";
  // "http://api.openweathermap.org/data/2.5/weather?lat=10.762622&lon=106.660172&units=metric&APPID=2035919e80085e73997f50e5cf950035";

  constructor(public http: Http) {
  }

  getWeatherByCoordinates(lat, lon, units): Observable<any> {

    //"http://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&APPID=2035919e80085e73997f50e5cf950035"
    this.baseUrl = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&APPID=2035919e80085e73997f50e5cf950035`;
    var response = this.http.get(this.baseUrl)
      .map((res) => res.json())
      .catch(this.handleError);
    return response;
  }

  private handleError(error: any): Observable<any> {
    console.error('An error occured', error);
    return Observable.throw(error.message || error);;

  }
}
