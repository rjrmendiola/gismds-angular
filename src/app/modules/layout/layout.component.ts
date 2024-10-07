import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  ViewEncapsulation,
} from '@angular/core';
import { FooterComponent } from './components/footer/footer.component';
import { NavigationEnd, Router, RouterOutlet, Event } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import * as L from 'leaflet';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  standalone: true,
  imports: [SidebarComponent, NavbarComponent, RouterOutlet, FooterComponent],
  encapsulation: ViewEncapsulation.None,
})
export class LayoutComponent implements OnInit, AfterViewInit, OnDestroy {
  private mainContent: HTMLElement | null = null;
  private map: any;
  private legend: any;
  private info: any;

  // Dictionary to store GeoJSON layers
  private layers: { [key: string]: L.GeoJSON } = {};
  geojson: any;

  // Layer visibility dictionary
  layerVisibility: { [key: string]: boolean } = {
    barangay: false,
    water_river: false,
    buildings: false,
    landcover: true, // Set landcover to true to show it by default
    roads: false,
  };

  // Define colors for each layer
  private layerColors: { [key: string]: string } = {
    barangay: '#FFEDA0',
    water_river: '#1E90FF',
    buildings: '#B22222',
    landcover: '#32CD32',
    roads: '#FFA500',
  };

  private fetchGeoJson(url: string): Promise<any> {
    return fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .catch((error) => {
        console.error(`Error fetching the GeoJSON data from ${url}:`, error);
        throw error;
      });
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [11.2966, 124.6783],
      zoom: 14,
      zoomControl: false,
      attributionControl: false,
    }).setView([11.2977099, 124.6878707], 14);

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      opacity: 0.3,
    });

    tiles.addTo(this.map);

    // Load GeoJSON data for different layers
    this.loadGeoJsonLayer('barangay', './assets/data/carigara/barangay.geojson'); // Updated fetch path
    this.loadGeoJsonLayer('water_river', './assets/data/water_river.geojson');
    this.loadGeoJsonLayer('buildings', './assets/data/buildings.geojson');
    this.loadGeoJsonLayer('landcover', './assets/data/Landcovermap.geojson');
    this.loadGeoJsonLayer('roads', './assets/data/roads.geojson');
  }

  // Method to load a GeoJSON layer and add it to the map
  private loadGeoJsonLayer(layerKey: string, url: string) {
    this.fetchGeoJson(url)
      .then((data) => {
        const layer = L.geoJson(data, {
          style: (feature) => this.style(feature, layerKey), // Pass layerKey to style
          onEachFeature: this.onEachFeature.bind(this),
        });
        this.layers[layerKey] = layer; // Store layer in dictionary

        // Only add layer to map if it is set to visible
        if (this.layerVisibility[layerKey]) {
          layer.addTo(this.map); // Initially add the layer to the map if visible
        }
      })
      .catch((error) => {
        console.error(`Failed to load GeoJSON from ${url}:`, error);
      });
  }

  // Method to toggle layer visibility based on checkbox state
  public toggleLayer(layerKey: string): void {
    const layer = this.layers[layerKey];
    this.layerVisibility[layerKey] = !this.layerVisibility[layerKey]; // Toggle visibility state

    if (this.map.hasLayer(layer)) {
      this.map.removeLayer(layer);
    } else {
      this.map.addLayer(layer);
    }

    this.addLegend(); // Update the legend when toggling layers
  }

  // Add legend with colors corresponding to each GeoJSON layer
  private addLegend(): void {
    if (this.legend) {
      this.map.removeControl(this.legend); // Remove existing legend
    }

    this.legend = new L.Control({ position: 'bottomright' });

    this.legend.onAdd = () => {
      const div = L.DomUtil.create('div', 'info legend');
      const labels: string[] = [];

      // Loop through the layer colors and create a legend item for each visible layer
      for (const layerKey in this.layerColors) {
        if (this.layerColors.hasOwnProperty(layerKey) && this.layerVisibility[layerKey]) {
          const color = this.layerColors[layerKey];
          const layerName = layerKey.charAt(0).toUpperCase() + layerKey.slice(1); // Capitalize the layer name
          labels.push(
            `<i style="background:${color}"></i> ${layerName}`
          );
        }
      }

      div.innerHTML = labels.join('<br>');
      return div;
    };

    this.legend.addTo(this.map);
  }

  private addInfoControl(): void {
    this.info = new L.Control({ position: 'topright' });

    this.info.onAdd = () => {
      this.info._div = L.DomUtil.create('div', 'info');
      this.info.updateInfo();
      return this.info._div;
    };

    this.info.updateInfo = (props?: any) => {
      if (!this.info._div) {
        console.error('Info control div is not created');
        return;
      }
      this.info._div.innerHTML =
        '<h4>Carigara, Leyte Population Density</h4>' +
        (props
          ? `<b>${props.name}</b><br />${props.population} people / mi<sup>2</sup>`
          : 'Hover over a barangay');
    };

    this.info.addTo(this.map);
  }

  private onEachFeature(feature: any, layer: any): void {
    layer.on({
      mouseover: this.highlightFeature.bind(this),
      mouseout: this.resetHighlight.bind(this),
      click: this.zoomToFeature.bind(this),
    });
  }

  private getColor(d: number): string {
    return d > 1000 ? '#800026' :
           d > 500  ? '#BD0026' :
           d > 200  ? '#E31A1C' :
           d > 100  ? '#FC4E2A' :
           d > 50   ? '#FD8D3C' :
           d > 20   ? '#FEB24C' :
           d > 10   ? '#FED976' :
                      '#FFEDA0';
  }

  // Updated style method to use layer-specific colors
  private style(feature: any, layerKey: string) {
    return {
      fillColor: this.layerColors[layerKey], // Use the layer-specific color
      weight: 2,
      opacity: 1,
      color: 'white', // Border color
      dashArray: '3',
      fillOpacity: 0.7,
    };
  }

  private highlightFeature(e: any) {
    const layer = e.target;

    layer.setStyle({
      weight: 5,
      color: '#FFFF99',
      dashArray: '',
      fillOpacity: 0.7,
    });

    layer.bringToFront();
    this.info.updateInfo(layer.feature.properties);
  }

  private resetHighlight(e: any) {
    const layer = e.target;

    // Find the key of the layer that is currently being highlighted
    const layerKey = Object.keys(this.layers).find(key => this.layers[key] === layer);
    if (layerKey) {
      this.layers[layerKey].resetStyle(layer); // Reset style using the specific layer
    }
    this.info.updateInfo(); // Clear the info panel
  }

  private zoomToFeature(e: any) {
    this.map.fitBounds(e.target.getBounds());
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
  }

  ngOnInit(): void {
    this.mainContent = document.getElementById('main-content');
  }

  ngAfterViewInit() {
    this.initMap();
    this.addLegend(); // Adding legend when the map is initialized
    this.addInfoControl();
  }

  ngOnDestroy() {
    if (this.map) {
      this.map.remove();
    }
  }
}
