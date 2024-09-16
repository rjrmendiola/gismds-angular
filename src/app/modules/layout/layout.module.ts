import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
// import { LeafletModule } from '@asymmetrik/ngx-leaflet';
// import { NgxMapLibreGLModule } from '@maplibre/ngx-maplibre-gl';

import { LayoutRoutingModule } from './layout-routing.module';
@NgModule({
  // imports: [LayoutRoutingModule, AngularSvgIconModule.forRoot(), LeafletModule],
  // imports: [LayoutRoutingModule, AngularSvgIconModule.forRoot(), NgxMapLibreGLModule],
  imports: [LayoutRoutingModule, AngularSvgIconModule.forRoot()],
  providers: [provideHttpClient(withInterceptorsFromDi())]
})
export class LayoutModule {}
