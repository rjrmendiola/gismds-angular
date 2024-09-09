import { Component, OnInit } from '@angular/core';
import { Nft } from '../../models/nft';
import { NftAuctionsTableComponent } from '../../components/nft/nft-auctions-table/nft-auctions-table.component';
import { NftChartCardComponent } from '../../components/nft/nft-chart-card/nft-chart-card.component';
import { NftSingleCardComponent } from '../../components/nft/nft-single-card/nft-single-card.component';
import { NftDualCardComponent } from '../../components/nft/nft-dual-card/nft-dual-card.component';
import { NftHeaderComponent } from '../../components/nft/nft-header/nft-header.component';

import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { tileLayer, latLng } from 'leaflet';
import { bootstrapApplication } from '@angular/platform-browser';

@Component({
    selector: 'app-nft',
    templateUrl: './nft.component.html',
    standalone: true,
    imports: [
        NftHeaderComponent,
        NftDualCardComponent,
        NftSingleCardComponent,
        NftChartCardComponent,
        NftAuctionsTableComponent,
        LeafletModule,
    ],
})
export class NftComponent implements OnInit {
  // nft: Array<Nft>;

  constructor() {
    // this.nft = [
    //   {
    //     id: 34356771,
    //     title: 'Girls of the Cartoon Universe',
    //     creator: 'Jhon Doe',
    //     instant_price: 4.2,
    //     price: 187.47,
    //     ending_in: '06h 52m 47s',
    //     last_bid: 0.12,
    //     image: './assets/images/img-01.jpg',
    //     avatar: './assets/avatars/avt-01.jpg',
    //   },
    //   {
    //     id: 34356772,
    //     title: 'Pupaks',
    //     price: 548.79,
    //     last_bid: 0.35,
    //     image: './assets/images/img-02.jpg',
    //   },
    //   {
    //     id: 34356773,
    //     title: 'Seeing Green collection',
    //     price: 234.88,
    //     last_bid: 0.15,
    //     image: './assets/images/img-03.jpg',
    //   },
    // ];
  }

  ngOnInit(): void {}

  options = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '© OpenStreetMap contributors' })
    ],
    zoom: 13,  // You can adjust the zoom level if needed
    center: latLng(11.2966, 124.6783)  // Coordinates for Carigara, Leyte, Philippines
  };
}

bootstrapApplication(NftComponent);  // Bootstrapping the application
