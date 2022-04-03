import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ControllerSectionComponent } from './controller-section/controller-section.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';


import { LoginComponent } from './login/login.component';
import { AppComponent } from './app.component';
import { WaterQualityComponent } from './water-quality/water-quality.component';
import { AeratorControlComponent } from './aerator-control/aerator-control.component';
import { TimeStrategyComponent } from './time-strategy/time-strategy.component';
import { MainComponent } from './main/main.component';
import { LabelledFieldComponent } from './labelled-field/labelled-field.component';


@NgModule({
  declarations: [
    AppComponent,
    ControllerSectionComponent,
    LoginComponent,
    WaterQualityComponent,
    AeratorControlComponent,
    TimeStrategyComponent,
    MainComponent,
    LabelledFieldComponent,
  ],
  imports: [
    MatMenuModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatInputModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatTabsModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
