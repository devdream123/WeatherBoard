import { Component } from '@angular/core';

/**
 * Generated class for the SettingComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'setting-component',
  templateUrl: 'setting.html'
})
export class SettingComponent {

  text: string;

  constructor() {
    console.log('Hello SettingComponent Component');
    this.text = 'Hello World';
  }

}
