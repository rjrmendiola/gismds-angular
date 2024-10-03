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
// import { Map, NavigationControl, Marker } from 'maplibre-gl';

import * as L from 'leaflet';

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
  // map: Map | undefined;
  private map: any;
  private geojson: any;
  private mapData: any;

  private getBarangay(map: any, style: any): void {
    // fetch('./assets/data/brgy.cariaga.geojson')
    // fetch('./assets/data/hazard_landslide.geojson')
    // fetch('./assets/data/water_river.geojson')
      // fetch('./assets/data/buildings.geojson')
      // fetch('./assets/data/Landcovermap.geojson')
      // fetch('./assets/data/roads.geojson')
      fetch('./assets/data/carigara/barangay.geojson')
          .then(function(response) { return response.json() })
          .then(function(data) {
            // return data;
              L.geoJSON(data, {
                  // onEachFeature: function (feature, layer) {
                  //     // does this feature have a property named popupContent?
                  //     if (feature.properties && feature.properties.popupContent) {
                  //         layer.bindPopup(feature.properties.popupContent);
                  //     }
                  // }
                  style: style
              }).addTo(map)
          })
          .catch(error => console.log(error));
  };

  private initMap(): void {
    this.map = L.map('map', {
      center: [11.2966, 124.6783],
      zoom: 16
    }).setView([11.2977099, 124.6878707], 15);

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);

    this.mapData = this.getBarangay(this.map, this.style);

    // this.geojson = L.geoJson(this.mapData, {
    //     style: this.style,
    //     onEachFeature: this.onEachFeature
    // }).addTo(this.map);
  }

  getColor(d: number): string {
    return d > 1000 ? '#800026' :
           d > 500  ? '#BD0026' :
           d > 200  ? '#E31A1C' :
           d > 100  ? '#FC4E2A' :
           d > 50   ? '#FD8D3C' :
           d > 20   ? '#FEB24C' :
           d > 10   ? '#FED976' :
                      '#FFEDA0';
  }

  style(feature: any) {
    return {
        fillColor: this.getColor(parseInt(feature.properties.population)),
        // fillColor: '#800026',
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
  }

  highlightFeature(e: any) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    layer.bringToFront();
  }

  resetHighlight(e: any) {
    this.geojson.resetStyle(e.target);
  }

  zoomToFeature(e: any) {
    this.map.fitBounds(e.target.getBounds());
}

  onEachFeature(feature: any, layer: any) {
    layer.on({
        mouseover: this.highlightFeature,
        mouseout: this.resetHighlight,
        click: this.zoomToFeature
    });
}

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

    this.style = this.style.bind(this);
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
    // const initialState = { lng: 124.689232, lat: 11.301082, zoom: 15.0 };

    // this.map = new Map({
    //   container: this.mapContainer.nativeElement,
    //   style: `https://api.maptiler.com/maps/streets/style.json?key=Brbktff9L5mO7Pzkcpen`,
    //   center: [initialState.lng, initialState.lat],
    //   zoom: initialState.zoom
    // });

    // this.map.addControl(new NavigationControl());
    // new Marker({color: "#FF0000"})
    //   .setLngLat([124.689232,11.301082])
    //   .addTo(this.map);
    //   this.map.setCenter([124.689232, 11.301082]);

    this.initMap();
  }

  ngOnDestroy() {
    // this.map?.remove();
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
