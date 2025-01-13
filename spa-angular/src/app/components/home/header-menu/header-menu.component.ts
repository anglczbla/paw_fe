import { Component, OnInit, Input } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // Add this import

@Component({
  selector: 'app-header-menu',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatMenuModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
    CommonModule // Include CommonModule here
  ],
  templateUrl: './header-menu.component.html',
  styleUrls: ['./header-menu.component.css']
})
export class HeaderMenuComponent implements OnInit {

  @Input() bannerIsScroll: boolean = false;
  isScrolled: boolean = true;
  isLoggedIn: boolean = false; // Status login

  constructor(private router: Router) { }

  ngOnInit() {
    // Memeriksa apakah ada token di localStorage
    this.isLoggedIn = !!localStorage.getItem('authToken');
  }

  onLogout() {
    // Menghapus token dari localStorage saat logout
    localStorage.removeItem('authToken');
    this.isLoggedIn = false; // Mengubah status login menjadi false
    this.router.navigate(['/auth']); // Arahkan ke halaman login setelah logout
  }

  // Fungsi untuk scroll ke div tertentu
  gotoDiv(page: string): void {
    const element = document.getElementById(page);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
