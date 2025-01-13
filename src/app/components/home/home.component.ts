import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { BannerComponent } from './banner/banner.component';
import { HeaderMenuComponent } from './header-menu/header-menu.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { NewsComponent } from './news/news.component';
// import { ProdukComponent } from '@components/produk/produk.component';
// import { PemesananComponent } from '@components/pemesanan/pemesanan.component';
// import { PengirimanComponent } from '@components/pengiriman/pengiriman.component';
// import { TestimoniComponent } from '@components/testimoni/testimoni.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeaderComponent,
    BannerComponent,
    HeaderMenuComponent,
    AboutUsComponent,
    NewsComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  bannerEl: any;
  headerEl: any;

  bannerIsScroll: boolean = false;

  constructor(
    private el: ElementRef
  ){}
  
  ngOnInit(): void{
    this.headerEl = this.el.nativeElement.querySelector('#headerId').offsetTop;
    this.bannerEl = this.el.nativeElement.querySelector('#bannerId').offsetTop;
  }

  @HostListener('window:scroll', [])
  onWindowScroll(){
    this.bannerIsScroll = window.scrollY > this.headerEl
    console.log('this.bannerIsScroll', this.bannerIsScroll);
    console.log('this.headerEl', this.headerEl);
    console.log('window.scrollY', window,scrollY);
    
  }


}
