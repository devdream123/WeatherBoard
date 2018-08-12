import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from 'ionic-angular';

import { UnitsComponent } from './units/units';
import { SettingComponent } from './setting/setting';

@NgModule({
	imports: [CommonModule,IonicModule],
	exports: [
    UnitsComponent,
    SettingComponent],
    declarations: [UnitsComponent,
    SettingComponent],
})
export class ComponentsModule {}
