import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

/*
  Generated class for the ForecastServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ForecastServiceProvider {
  //"../../assets/json/forecast.local.json"; -- for local development
  private baseUrl:string  =  "http://api.openweathermap.org/data/2.5/forecast?lat=10.762622&lon=106.660172&units=metric&APPID=2035919e80085e73997f50e5cf950035";
  
  constructor(public http: Http) {
    console.log('Hello ForecastServiceProvider Provider');
  }
  getForecastByCoord(): Observable<any> {
    var response =  this.http.get(this.baseUrl)
                 .map( (res) => res.json())
                 .catch (this.handleError);  
                 console.log("response: " , response);
   return response;
    }

 private handleError(error : any): Observable<any>{
   console.error('An error occured', error);
   return Observable.throw(error.message || error);;

 }

}
