import { Observable } from 'rxjs/Rx';
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
  private baseUrl:string  = "../../assets/json/forecast.local.json"; //api.openweathermap.org/data/2.5/forecast?
  
  constructor(public http: Http) {
    console.log('Hello ForecastServiceProvider Provider');
  }
  getForecastByCoord(): Observable<any> {
    //"http://api.openweathermap.org/data/2.5/forecast?lat=35&lon=139&APPID=2035919e80085e73997f50e5cf950035"
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
