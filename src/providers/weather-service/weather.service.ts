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
  private baseUrl:string  = "../../assets/json/weather.local.json"; //api.openweathermap.org/data/2.5/weather?
  
  constructor(public http: Http) {
  }
  getWeatherByCoordinates(): Observable<any> {
     //"http://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&APPID=2035919e80085e73997f50e5cf950035"
     var response =  this.http.get(this.baseUrl)
                  .map( (res) => res.json())
                  .catch (this.handleError);  
    return response;
     }

  private handleError(error : any): Observable<any>{
    console.error('An error occured', error);
    return Observable.throw(error.message || error);;

  }
}
