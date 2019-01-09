import {APP_BASE_HREF, HashLocationStrategy, LocationStrategy, PlatformLocation} from '@angular/common';
import {Inject, Injectable, NgModule, Optional} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {ApplesComponent} from './apples/apples.component';
import {BicycleComponent} from './bicycle/bicycle.component';

const routes: Routes = [
  {path: 'fruit/some-apples', component: ApplesComponent},
  {path: 'transport/bicycle', component: BicycleComponent},
  {path: '', redirectTo: '/fruit/some-apples', pathMatch: 'full'}
];

@Injectable()
export class ProposeHashLocationStrategy extends HashLocationStrategy {
  private urlBaseHref: string;

  constructor(
      _platformLocation: PlatformLocation,
      @Optional() @Inject(APP_BASE_HREF) _baseHref?: string) {
    super(_platformLocation, _baseHref);
    try {
      _baseHref = _baseHref || _platformLocation.getBaseHrefFromDOM();
    } catch (e) {
      _baseHref = undefined;
    }
    _baseHref = _baseHref || _platformLocation.pathname;
    this.urlBaseHref = _baseHref;
  }

  getBaseHref(): string {
    return this.urlBaseHref + '#';
  }

  prepareExternalUrl(internal: string): string {
    if (internal.length === 0) {
      return this.urlBaseHref + '#/';
    }
    const mark = internal.startsWith('/') ? '#' : '#/';
    return this.urlBaseHref + mark + internal;
  }
}

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule],
  providers:
      [{provide: LocationStrategy, useClass: ProposeHashLocationStrategy}]
})
export class AppRoutingModule {
}
