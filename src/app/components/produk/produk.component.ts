import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import * as bootstrap from 'bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-produk',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgxPaginationModule],
  templateUrl: './produk.component.html',
  styleUrls: ['./produk.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProdukComponent implements OnInit {
  produk: any[] = [];
  currentPage = 1;
  itemsPerPage = 5;
  apiUrl = 'https://uas-backend-sigma.vercel.app/api/produk';
  isLoading = true;
  produkForm: FormGroup;
  isSubmitting = false;
 

  private http = inject(HttpClient);
  private fb = inject(FormBuilder);

  constructor() {
    this.produkForm = this.fb.group({
      nama: [''],
      deskripsi: [''],
      harga: [''],
      kategori: ['']
    });
  }

  ngOnInit(): void {
    this.getProduk();
  }

  kategoriList: string[] = ['Moisturizer', 'Serum', 'Toner', 'FacialWash'];

  getProduk(): void {
    this.isLoading = true;
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.produk = data;
        console.log('Data Produk:', this.produk);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching produk data:', err);
        this.isLoading = false;
      }
    });
  }

  addProduk(): void {
    if (this.produkForm.valid) {
      this.isSubmitting = true;

      const token = localStorage.getItem('authToken');
      const headers = { Authorization: `Bearer ${token}` };

      this.http.post(this.apiUrl, this.produkForm.value, { headers }).subscribe({
        next: () => {
          this.getProduk();
          this.produkForm.reset();
          this.isSubmitting = false;
          const modalElement = document.getElementById('tambahProdukModal') as HTMLElement;
          if (modalElement) {
            const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
            modalInstance.hide();
          }
        },
        error: (err) => {
          console.error('Error adding produk:', err);
          this.isSubmitting = false;
        }
      });
    }
  }

  deleteProduk(id: string): void {
    if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      const token = localStorage.getItem('authToken');
      const headers = { Authorization: `Bearer ${token}` };

      this.http.delete(`${this.apiUrl}/${id}`, { headers }).subscribe({
        next: () => {
          this.getProduk();
          console.log(`Produk dengan ID ${id} berhasil dihapus`);
        },
        error: (err) => {
          console.error('Error deleting produk:', err);
        }
      });
    }
  }

  editProdukId: string | null = null;

  getProdukById(id: string): void {
    this.editProdukId = id;

    // const token = localStorage.getItem('authToken');
    // const headers = { Authorization: `Bearer ${token}` };

    this.http.get(`${this.apiUrl}/${id}`).subscribe({
      next: (data: any) => {
        this.produkForm.patchValue({
          nama: data.nama,
          deskripsi: data.deskripsi,
          harga: data.harga,
          kategori: data.kategori
        });

        const modalElement = document.getElementById('editProdukModal') as HTMLElement;
        if (modalElement) {
          const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
          modalInstance.show();
        }
      },
      error: (err) => {
        console.error('Error fetching produk data by ID:', err);
      }
    });
  }

  updateProduk(): void {
    if (this.produkForm.valid) {
      this.isSubmitting = true;

      const token = localStorage.getItem('authToken');
      const headers = { Authorization: `Bearer ${token}` };

      this.http.put(`${this.apiUrl}/${this.editProdukId}`, this.produkForm.value, { headers }).subscribe({
        next: () => {
          this.getProduk();
          this.isSubmitting = false;

          const modalElement = document.getElementById('editProdukModal') as HTMLElement;
          if (modalElement) {
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            modalInstance?.hide();
          }
        },
        error: (err) => {
          console.error('Error updating produk:', err);
          this.isSubmitting = false;
        }
      });
    }
  }
}
