import { Component, OnInit } from '@angular/core';
import { FooterComponent } from './components/footer/footer.component';
import { NavigationEnd, Router, RouterOutlet, Event } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';

import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { tileLayer, latLng } from 'leaflet';
import { bootstrapApplication } from '@angular/platform-browser';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  standalone: true,
  imports: [SidebarComponent, NavbarComponent, RouterOutlet, FooterComponent, LeafletModule],
})
export class LayoutComponent implements OnInit {
  private mainContent: HTMLElement | null = null;

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

  options = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '© OpenStreetMap contributors' })
    ],
    zoom: 13,
    center: latLng(11.2966, 124.6783),
    zoomControl: false,  // Disable the default zoom control buttons
    scrollWheelZoom: false,  // Disable zooming with the scroll wheel
    doubleClickZoom: false,  // Disable zooming on double-click
    dragging: false  // Optionally disable dragging
  };
}

bootstrapApplication(LayoutComponent);  // Bootstrapping the application
