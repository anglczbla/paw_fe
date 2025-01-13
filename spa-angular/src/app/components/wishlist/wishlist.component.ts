import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import * as bootstrap from 'bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgxPaginationModule],
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css'],
})
export class WishlistComponent implements OnInit {
  wishlist: any[] = [];
  produk: any[] = [];
  currentPage = 1;
  itemsPerPage = 5;
  isLoading = true;
  isSubmitting = false;
  editWishlistId: string | null = null;

  apiWishlistUrl = 'https://uas-backend-sigma.vercel.app/api/wishlist'; // Adjust to the correct API URL for wishlist
  apiProdukUrl = 'https://uas-backend-sigma.vercel.app/api/produk'; // The same API URL used for products

  wishlistForm: FormGroup;
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);

  constructor() {
    this.wishlistForm = this.fb.group({
      nama: '',
      tanggal: '',
      status: '',
      produk_id: '',
    });
  }

  ngOnInit(): void {
    this.getWishlist();
    this.getProduk();
  }

  getWishlist(): void {
    this.isLoading = true;
    this.http.get<any[]>(this.apiWishlistUrl).subscribe({
      next: (data) => {
        this.wishlist = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching wishlist data:', err);
        this.isLoading = false;
      },
    });
  }

  getProduk(): void {
    this.http.get<any[]>(this.apiProdukUrl).subscribe({
      next: (data) => {
        this.produk = data;
      },
      error: (err) => {
        console.error('Error fetching produk data:', err);
      },
    });
  }

  addWishlist(): void {
    if (this.wishlistForm.valid) {
      this.isSubmitting = true;

      const token = localStorage.getItem('authToken');
      const headers = { Authorization: `Bearer ${token}` };

      this.http
        .post(
          this.apiWishlistUrl,
          this.wishlistForm.value,
          { headers }
        )
        .subscribe({
          next: (response) => {
            console.log('Data berhasil ditambahkan:', response);
            this.getWishlist();
            this.wishlistForm.reset();
            this.isSubmitting = false;
            const modalElement = document.getElementById(
              'tambahWishlistModal'
            ) as HTMLElement;
            if (modalElement) {
              const modalInstance =
                bootstrap.Modal.getInstance(modalElement) ||
                new bootstrap.Modal(modalElement);
              modalInstance.hide();
            }
          },
          error: (err) => {
            console.error('Error adding wishlist:', err);
            this.isSubmitting = false;
          },
        });
    }
  }

  deleteWishlist(_id: string): void {
    if (confirm('Apakah Anda yakin ingin menghapus wishlist ini?')) {
      const token = localStorage.getItem('authToken');
      const headers = { Authorization: `Bearer ${token}` };

      this.http
        .delete(`${this.apiWishlistUrl}/${_id}`, { headers })
        .subscribe({
          next: () => {
            this.getWishlist();
            console.log(`Wishlist dengan ID ${_id} berhasil dihapus`);
          },
          error: (err) => {
            console.error('Error deleting wishlist:', err);
          },
        });
    }
  }

  getWishlistById(_id: string): void {
    this.editWishlistId = _id;
    this.http.get<any>(`${this.apiWishlistUrl}/${_id}`).subscribe({
      next: (data) => {
        this.wishlistForm.patchValue(data);
        this.openModal('editWishlistModal');
      },
      error: (err) => {
        console.error('Error fetching wishlist by ID:', err);
      },
    });
  }

  updateWishlist(): void {
    if (this.wishlistForm.valid && this.editWishlistId) {
      this.isSubmitting = true;

      const token = localStorage.getItem('authToken');
      const headers = { Authorization: `Bearer ${token}` };

      this.http
        .put(
          `${this.apiWishlistUrl}/${this.editWishlistId}`,
          this.wishlistForm.value,
          { headers }
        )
        .subscribe({
          next: () => {
            this.getWishlist();
            this.isSubmitting = false;
            this.closeModal('editWishlistModal');
          },
          error: (err) => {
            console.error('Error updating wishlist:', err);
            this.isSubmitting = false;
          },
        });
    }
  }

  openModal(modalId: string): void {
    const modalElement = document.getElementById(modalId) as HTMLElement;
    if (modalElement) {
      const modalInstance =
        bootstrap.Modal.getInstance(modalElement) ||
        new bootstrap.Modal(modalElement);
      modalInstance.show();
    }
  }

  closeModal(modalId: string): void {
    const modalElement = document.getElementById(modalId) as HTMLElement;
    if (modalElement) {
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      modalInstance?.hide();
    }
  }
}
