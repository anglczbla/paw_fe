import { Routes } from '@angular/router';
import { ProdukComponent } from './components/produk/produk.component';
import { HomeComponent } from './components/home/home.component';
import { PengirimanComponent } from './components/pengiriman/pengiriman.component';
import { PemesananComponent } from './components/pemesanan/pemesanan.component';
import { TestimoniComponent } from './components/testimoni/testimoni.component';
import { ProfileComponent } from './components/profile/profile.component';
import { HeaderComponent } from './components/home/header/header.component';
import { AuthComponent } from './components/auth/auth.component';
import { WishlistComponent } from '@components/wishlist/wishlist.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
    { path: 'produk', component: ProdukComponent, canActivate: [AuthGuard] },
    { path: 'home', component: HomeComponent},
    { path: 'pengiriman', component: PengirimanComponent, canActivate: [AuthGuard]},
    { path: 'pemesanan', component: PemesananComponent},
    { path: 'testimoni', component: TestimoniComponent},
    { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
    { path: 'header', component: HeaderComponent, canActivate: [AuthGuard]},
    { path: 'wishlist', component: WishlistComponent},
    { path: 'auth', component: AuthComponent },
    { path: '**', redirectTo: 'auth' },
];