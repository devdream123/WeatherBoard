import { Component, EventEmitter, Output} from '@angular/core';
import { Events } from 'ionic-angular';
/**
 * Generated class for the UnitsComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'units-component',
  templateUrl: './units.html'
})
export class UnitsComponent {
  @Output() unitTempEvent = new EventEmitter();
  unitsIcon: string = "thermometer";
  private unit:string;
  constructor(public events: Events) {
    console.log('Hello UnitsComponent Component');
  }

  metricSelected ($event){
    this.unit = "metric";
    console.log('this.unit: ' ,this.unit);
    this.unitTempEvent.emit(this.unit);
  }
 imperialSelected ($event){
    this.unit = "imperial";
    console.log('this.unit: ' ,this.unit);
    this.unitTempEvent.emit(this.unit);
  }
}
