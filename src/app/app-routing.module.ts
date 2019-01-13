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
export class ProposeNoBreakingHashLocationStrategy extends
    HashLocationStrategy {
  private urlBaseHref: string;
  private urlHashFragmentPrefix: string;

  private sysPlatformLocation: PlatformLocation;

  constructor(
      _platformLocation: PlatformLocation,
      @Optional() @Inject(APP_BASE_HREF) _fragmentPrefix?: string) {
    super(_platformLocation, _fragmentPrefix);
    _fragmentPrefix = _fragmentPrefix || '';
    this.urlBaseHref = _platformLocation.pathname;
    this.urlHashFragmentPrefix = '#' + _fragmentPrefix;
    this.sysPlatformLocation = _platformLocation;
  }

  getBaseHref(): string {
    return this.urlBaseHref + this.urlHashFragmentPrefix;
  }

  path(includeHash: boolean = false): string {
    // the hash value is always prefixed with a `#`
    // and if it is empty then it will stay empty
    let path = this.sysPlatformLocation.hash;
    if (path == null) {
      path = this.urlHashFragmentPrefix;
    }
    if (path.startsWith(this.urlHashFragmentPrefix)) {
      return path.substring(this.urlHashFragmentPrefix.length);
    }
    return path.length > 0 ? path.substring(1) : path;
  }

  prepareExternalUrl(internal: string): string {
    if (internal.length === 0) {
      return this.urlBaseHref + this.urlHashFragmentPrefix + '/';
    }
    const mark = internal.startsWith('/') ? this.urlHashFragmentPrefix :
                                            (this.urlHashFragmentPrefix + '/');
    return this.urlBaseHref + mark + internal;
  }
}

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule],
  providers: [
    {
      provide: LocationStrategy,
      useClass: ProposeNoBreakingHashLocationStrategy
    },
    {provide: APP_BASE_HREF, useValue: ''}
  ]
})
export class AppRoutingModule {
}
