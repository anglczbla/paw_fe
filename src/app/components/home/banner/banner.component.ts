import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
//import { NgMaterialModule } from '@shared/module/ng-material.module';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-banner',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './banner.component.html',
  styleUrl: './banner.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BannerComponent implements OnInit {
  listBanner = [
    'assets/images/banner.jpg',
    'assets/images/bannerr.jpg',

  ]
  ngOnInit(): void { }
}