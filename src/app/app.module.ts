import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';

import {ApplesComponent} from './apples/apples.component';
import {BicycleComponent} from './bicycle/bicycle.component';

@NgModule({
  declarations: [AppComponent, ApplesComponent, BicycleComponent],
  imports: [BrowserModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
