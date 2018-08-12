import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from 'ionic-angular';

import { UnitsComponent } from './units/units';

@NgModule({
	imports: [CommonModule,IonicModule],
	exports: [
    UnitsComponent,],
    declarations: [UnitsComponent],
})
export class ComponentsModule {}
