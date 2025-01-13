import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild, ElementRef } from '@angular/core';
import { DatFormatPipe } from '@pipes/dat-format.pipe';
import { SwiperContainer } from 'swiper/element';
import { MatButtonModule } from '@angular/material/button';
//import { NgMaterialModule } from '@shared/module/ng-material.module';
@Component({
  selector: 'app-news',
  standalone: true,
  imports: [
    MatButtonModule,
    // NgMaterialModule,
    DatFormatPipe
  ],
  templateUrl: './news.component.html',
  styleUrl: './news.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class NewsComponent {
  @ViewChild('newSwiper') swiper!: ElementRef<SwiperContainer>;

  listNews = [
    {
      title: "SKINTIFIC",
      tag: "Skintific Toner Pure Centella for Acne Prone Skin",
      datePost: new Date('2023-12-11'),
      author: "Angelica Izabella",
      image: 'assets/images/news-1.jpg'
    },
    {
      title: "NACIFIC",
      tag: "Nacific Toner Fresh Herbs",
      datePost: new Date('2023-12-11'),
      author: "Angelica Izabella",
      image: 'assets/images/news-2.jpg'
    },
    {
      title: "Sulhwasoo",
      tag: "Skincare 1 Set",
      datePost: new Date('2023-12-11'),
      author: "Angelica Izabella",
      image: 'assets/images/news-3.jpg'
    },
  ]

  onNext() {
    this.swiper.nativeElement.swiper.slideNext()
  }
  onPrev() {
    this.swiper.nativeElement.swiper.slidePrev()
  }
}