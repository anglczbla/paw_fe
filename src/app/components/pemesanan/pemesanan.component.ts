import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import * as bootstrap from 'bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-pemesanan',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgxPaginationModule],
  templateUrl: './pemesanan.component.html',
  styleUrls: ['./pemesanan.component.css'],
})
export class PemesananComponent implements OnInit {
  pemesanan: any[] = [];
  produk: any[] = [];
  currentPage = 1;
  itemsPerPage = 5;
  isLoading = true;
  isSubmitting = false;
  editPemesananId: string | null = null;

  apiPemesananUrl = 'https://uas-backend-sigma.vercel.app/api/pemesanan';
  apiProdukUrl = 'https://uas-backend-sigma.vercel.app/api/produk';
  pemesananForm: FormGroup;
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);

  constructor() {
    this.pemesananForm = this.fb.group({
      nama: '',
      order: '',
      selesai: '',
      batasOrder: '',
      produk_id: '',
    });
  }
 

  ngOnInit(): void {
    this.getPemesanan();
    this.getProduk();
  }

  getPemesanan(): void {
    this.isLoading = true;
    this.http.get<any[]>(this.apiPemesananUrl).subscribe({
      next: (data) => {
        this.pemesanan = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching pemesanan data:', err);
        this.isLoading = false;
      },
    });
  }

  getProduk(): void {
    this.http.get<any[]>(this.apiProdukUrl).subscribe({
      next: (data) => {
        this.produk = data; // Perbaiki penggunaan produkList
      },
      error: (err) => {
        console.error('Error fetching produk data:', err);
      },
    });
  }

  addPemesanan(): void {
    if (this.pemesananForm.valid) {
      this.isSubmitting = true;

      const token = localStorage.getItem('authToken');
      const headers = { Authorization: `Bearer ${token}` };

      this.http
        .post(
          this.apiPemesananUrl,
          this.pemesananForm.value,
          { headers }
        )
        .subscribe({
          next: (response) => {
            console.log('Data berhasil ditambahkan:', response);
            this.getPemesanan();
            this.pemesananForm.reset();
            this.isSubmitting = false;
            const modalElement = document.getElementById(
              'tambahPemesananModal'
            ) as HTMLElement;
            if (modalElement) {
              const modalInstance =
                bootstrap.Modal.getInstance(modalElement) ||
                new bootstrap.Modal(modalElement);
              modalInstance.hide();

              // Hapus elemen backdrop jika ada
              const backdrop = document.querySelector('.modal-backdrop');
              if (backdrop) {
                backdrop.remove();
              }

              // Pulihkan scroll pada body
              document.body.classList.remove('modal-open');
              document.body.style.overflow = '';
              document.body.style.paddingRight = '';
            }
          },
          error: (err) => {
            console.error('Error adding pemesanan:', err);
            this.isSubmitting = false;
          },
        });
    }
  }

  deletePemesanan(_id: string): void {
    if (confirm('Apakah Anda yakin ingin menghapus pemesanan ini?')) {
      const token = localStorage.getItem('authToken');
      const headers = { Authorization: `Bearer ${token}` };

      this.http
        .delete(`${this.apiPemesananUrl}/${_id}`, { headers })
        .subscribe({
          next: () => {
            this.getPemesanan();
            console.log(`Pemesanan dengan ID ${_id} berhasil dihapus`);
          },
          error: (err) => {
            console.error('Error deleting pemesanan:', err);
          },
        });
    }
  }

  getPemesananById(_id: string): void {
    this.editPemesananId = _id;
    this.http.get<any>(`${this.apiPemesananUrl}/${_id}`).subscribe({
      next: (data) => {
        this.pemesananForm.patchValue(data);
        this.openModal('editPemesananModal');
      },
      error: (err) => {
        console.error('Error fetching pemesanan by ID:', err);
      },
    });
  }

  updatePemesanan(): void {
    if (this.pemesananForm.valid && this.editPemesananId) {
      this.isSubmitting = true;

      const token = localStorage.getItem('authToken');
      const headers = { Authorization: `Bearer ${token}` };

      this.http
        .put(
          `${this.apiPemesananUrl}/${this.editPemesananId}`,
          this.pemesananForm.value,
          { headers }
        )
        .subscribe({
          next: () => {
            this.getPemesanan();
            this.isSubmitting = false;
            this.closeModal('editPemesananModal');

            const modalElement = document.getElementById(
              'editPemesananModal'
            ) as HTMLElement;
            if (modalElement) {
              const modalInstance = bootstrap.Modal.getInstance(modalElement);
              modalInstance?.hide();
            }
          },
          error: (err) => {
            console.error('Error updating pemesanan:', err);
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
