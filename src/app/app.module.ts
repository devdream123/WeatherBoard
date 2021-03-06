import { BrowserModule } from '@angular/platform-browser';
import { ComponentsModule } from '../components/components.module'
import { ErrorHandler, NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { WeatherServiceProvider } from '../providers/weather-service/weather.service';
import { ForecastServiceProvider } from '../providers/forecast-service/forecast.service';
import { HttpModule } from '@angular/http';
import { Geolocation } from '@ionic-native/geolocation';
import { LocationServiceProvider } from '../providers/location-service/location-service';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage  
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule,
    ComponentsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    WeatherServiceProvider,
    ForecastServiceProvider,
    Geolocation,
    LocationServiceProvider
  ],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
