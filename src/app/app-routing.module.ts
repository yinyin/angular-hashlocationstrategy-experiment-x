import {APP_BASE_HREF, HashLocationStrategy, Location, LocationStrategy, PlatformLocation} from '@angular/common';
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
  private urlHashFragmentPrefix: string;

  private sysPlatformLocation: PlatformLocation;

  constructor(
      _platformLocation: PlatformLocation,
      @Optional() @Inject(APP_BASE_HREF) _baseHref?: string) {
    super(_platformLocation, _baseHref);
    _baseHref = _baseHref || '';
    if (!_baseHref.startsWith('/')) {
      if (_baseHref.startsWith('#')) {
        _baseHref = _baseHref.substring(1);
      }
      _baseHref = ('' === _baseHref) ? _baseHref : ('#' + _baseHref);
    }
    const hashSignAt = _baseHref.indexOf('#');
    if (hashSignAt >= 0) {
      this.urlBaseHref = _baseHref.substring(0, hashSignAt);
      this.urlHashFragmentPrefix = '#' +
          Location.stripTrailingSlash(_baseHref.substring(hashSignAt + 1));
    } else {
      this.urlBaseHref = _baseHref;
      this.urlHashFragmentPrefix = '#';
    }
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
    {provide: LocationStrategy, useClass: ProposeHashLocationStrategy},
    {provide: APP_BASE_HREF, useValue: '#/prefix/with!/'}
  ]
})
export class AppRoutingModule {
}
