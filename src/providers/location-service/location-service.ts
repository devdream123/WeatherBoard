import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the LocationServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LocationServiceProvider {
private apiKey:string = 'AIzaSyBASqJYvjhPiczLrKsZLdBFAQkMtZ4_0iE';
private baseUrl:string

constructor(public http: Http) {
}

queryLocation(locationText): Observable<any>{
  this.baseUrl = "https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=" + locationText + "&inputtype=textquery" + "&fields=formatted_address,geometry"+ "&key=" + this.apiKey;    
  // this.baseUrl ="https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=auckland%20new%20zealand&inputtype=textquery&fields=formatted_address,geometry&key=AIzaSyBASqJYvjhPiczLrKsZLdBFAQkMtZ4_0iE";
  var response = this.http.get(this.baseUrl)
                          .map( (res) => res.json())
                          .catch(this.handleError);
  return response;
}

private handleError(error : any): Observable<any>{
  console.error('An error occured', error);
  return Observable.throw(error.message || error);;
}
}
