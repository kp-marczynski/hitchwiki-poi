import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';

import {HomePage} from './home.page';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {HttpClientJsonpModule, HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {MapComponent} from '../map/map.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgbModule,
    HttpClientModule,
    HttpClientJsonpModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      }
    ])
  ],
  exports: [
    HomePage
  ],
  declarations: [HomePage, MapComponent]
})
export class HomePageModule {}
