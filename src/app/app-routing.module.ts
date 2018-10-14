import {APP_BASE_HREF} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {ApplesComponent} from './apples/apples.component';
import {BicycleComponent} from './bicycle/bicycle.component';

const routes: Routes = [
  {path: 'fruit/some-apples', component: ApplesComponent},
  {path: 'transport/bicycle', component: BicycleComponent},
  {path: '', redirectTo: '/fruit/some-apples', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: false})],
  exports: [RouterModule],
  providers: [{provide: APP_BASE_HREF, useValue: '/my/app'}]
})
export class AppRoutingModule {
}
