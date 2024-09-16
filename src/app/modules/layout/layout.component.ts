import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { FooterComponent } from './components/footer/footer.component';
import { NavigationEnd, Router, RouterOutlet, Event } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';

// import { LeafletModule } from '@asymmetrik/ngx-leaflet';
// import { tileLayer, latLng } from 'leaflet';
// import { bootstrapApplication } from '@angular/platform-browser';

// import * as Leaflet from 'leaflet';

// import { NgxMapLibreGLModule } from '@maplibre/ngx-maplibre-gl';

import { Map, NavigationControl, Marker } from 'maplibre-gl';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  standalone: true,
  // imports: [SidebarComponent, NavbarComponent, RouterOutlet, FooterComponent, LeafletModule],
  // imports: [SidebarComponent, NavbarComponent, RouterOutlet, FooterComponent, NgxMapLibreGLModule],
  imports: [SidebarComponent, NavbarComponent, RouterOutlet, FooterComponent],
})
export class LayoutComponent implements OnInit, AfterViewInit, OnDestroy {
  private mainContent: HTMLElement | null = null;
  map: Map | undefined;

  @ViewChild('map')
  private mapContainer!: ElementRef<HTMLElement>;

  constructor(private router: Router) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        if (this.mainContent) {
          this.mainContent!.scrollTop = 0;
        }
      }
    });
  }

  ngOnInit(): void {
    this.mainContent = document.getElementById('main-content');
  }

  // options = {
  //   layers: [
  //     tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '© OpenStreetMap contributors' })
  //   ],
  //   zoom: 13,
  //   center: latLng(11.2966, 124.6783),
  //   zoomControl: false,  // Disable the default zoom control buttons
  //   scrollWheelZoom: false,  // Disable zooming with the scroll wheel
  //   doubleClickZoom: false,  // Disable zooming on double-click
  //   dragging: false  // Optionally disable dragging
  // };

  // options: Leaflet.MapOptions = {
  //   layers: getLayers(),
  //   zoom: 12,
  //   center: new Leaflet.LatLng(43.530147, 16.488932)
  // };

  ngAfterViewInit() {
    const initialState = { lng: 43.530147, lat: 16.488932, zoom: 14 };

    this.map = new Map({
      container: this.mapContainer.nativeElement,
      style: `https://api.maptiler.com/maps/streets/style.json?key=Brbktff9L5mO7Pzkcpen`,
      center: [initialState.lng, initialState.lat],
      zoom: initialState.zoom
    });

    this.map.addControl(new NavigationControl());
    new Marker({color: "#FF0000"})
      .setLngLat([43.530147,16.488932])
      .addTo(this.map);
  }

  ngOnDestroy() {
    this.map?.remove();
  }
}

// export const getLayers = (): Leaflet.Layer[] => {
//   return [
//     new Leaflet.TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//       attribution: '&copy; OpenStreetMap contributors'
//     } as Leaflet.TileLayerOptions),
//   ] as Leaflet.Layer[];
// };

// bootstrapApplication(LayoutComponent);  // Bootstrapping the application
