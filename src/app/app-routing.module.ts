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
  private basePathName: string;

  constructor(
      _platformLocation: PlatformLocation,
      @Optional() @Inject(APP_BASE_HREF) _baseHref?: string) {
    super(_platformLocation, _baseHref);
    if (_baseHref == null) {
      _baseHref = _platformLocation.getBaseHrefFromDOM();
    }
    if (_baseHref == null) {
      _baseHref = _platformLocation.pathname;
    }
    _baseHref = _baseHref || '/';
    this.basePathName = _stripOnlyIndexHtml(_baseHref);
  }

  getBaseHref(): string {
    return this.basePathName + '#';
  }

  prepareExternalUrl(internal: string): string {
    if (internal.length === 0) {
      return this.basePathName + '#/';
    }
    const mark = internal.startsWith('/') ? '#' : '#/';
    return this.basePathName + mark + internal;
  }
}

function _stripOnlyIndexHtml(url: string): string {
  return url.replace(/\/index.html$/, '/');
}

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule],
  providers:
      [{provide: LocationStrategy, useClass: ProposeHashLocationStrategy}]
})
export class AppRoutingModule {
}
