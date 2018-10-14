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
  private basePathName = '/';

  constructor(
      _platformLocation: PlatformLocation,
      @Optional() @Inject(APP_BASE_HREF) _baseHref?: string) {
    super(_platformLocation, _baseHref);
    if (_baseHref != null) {
      this.basePathName = _baseHref;
    } else {
      const currentPathName = _platformLocation.pathname;
      this.basePathName = currentPathName || '/';
    }
  }

  getBaseHref(): string {
    return this.basePathName;
  }

  prepareExternalUrl(internal: string): string {
    if (internal.length === 0) {
      return this.basePathName;
    }
    const url = this.basePathName + '#' + internal;
    return url;
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
