import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import * as bootstrap from 'bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';

const API_URL = "https://uas-backend-sigma.vercel.app/api"
// const API_URL = "http://localhost:3000/api"

@Component({
  selector: 'app-testimoni',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgxPaginationModule],
  templateUrl: './testimoni.component.html',
  styleUrls: ['./testimoni.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TestimoniComponent implements OnInit {
  testimoni: any[] = [];
  pemesanan: any[] = [];
  pengiriman:  any[] = [];
  currentPage = 1;
  itemsPerPage = 5;
  isLoading = true;
  isSubmitting = false;

  endpointTestimoni = `${API_URL}/testimoni`
  apiPemesananUrl = 'https://uas-backend-sigma.vercel.app/api/pemesanan';
  apiPengirimanUrl = 'https://uas-backend-sigma.vercel.app/api/pengiriman';
  testimoniForm: FormGroup;
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);

  constructor() {
    this.testimoniForm = this.fb.group({
      nama: [''],
      pemesanan_id: [''],
      pengiriman_id: [''],
      pesan: [''],
      rating: [null]
    });
  }

  ngOnInit(): void {
    this.getTestimoni();
    this.getPemesanan();
    this.getPengiriman();
  }

  getTestimoni(): void {
    this.isLoading = true;
    this.http.get<any[]>(this.endpointTestimoni).subscribe({
      next: (data) => {
        this.testimoni = data;
        console.log('Data Testimoni:', this.testimoni);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching testimoni data:', err);
        this.isLoading = false;
      }
    });
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

  getPengiriman(): void {
    this.isLoading = true;
    this.http.get<any[]>(this.apiPengirimanUrl).subscribe({
      next: (data) => {
        this.pengiriman = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching pengiriman data:', err);
        this.isLoading = false;
      }
    });
  }

  addTestimoni(): void {
    if (this.testimoniForm.valid) {
      this.isSubmitting = true;

      const token = localStorage.getItem('authToken');
      const headers = { Authorization: `Bearer ${token}` };

      this.http.post(this.endpointTestimoni, this.testimoniForm.value, { headers }).subscribe({
        next: (response) => {
          console.log('Data berhasil ditambahkan:', response);
          this.getTestimoni();
          this.testimoniForm.reset();
          this.isSubmitting = false;
          const modalElement = document.getElementById('tambahTestimoniModal') as HTMLElement;
          if (modalElement) {
            const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
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
          console.error('Error adding testimoni:', err);
          this.isSubmitting = false;
        }
      });
    }
  }

  deleteTestimoni(id: string): void {
    if (confirm('Apakah Anda yakin ingin menghapus testimoni ini?')) {
      const token = localStorage.getItem('authToken');
      const headers = { Authorization: `Bearer ${token}` };

      this.http.delete(`${this.endpointTestimoni}/${id}`, { headers }).subscribe({
        next: () => {
          this.getTestimoni();
          console.log(`Testimoni dengan ID ${id} berhasil dihapus`);
        },
        error: (err) => {
          console.error('Error deleting testimoni:', err);
        }
      });
    }
  }

  editTestimoniId: string | null = null;

  getTestimoniById(_id: string): void {
    this.editTestimoniId = _id;
    this.http.get<any>(`${this.endpointTestimoni}/${_id}`).subscribe({
      next: (data) => {
        this.testimoniForm.patchValue(data);
        this.openModal('editTestimoniModal');
      },
      error: (err) => {
        console.error('Error fetching testimoni by ID:', err);
      },
    });
  }

  updateTestimoni(): void {
    if (this.testimoniForm.valid  && this.editTestimoniId) {
      this.isSubmitting = true;

      const token = localStorage.getItem('authToken');
      const headers = { Authorization: `Bearer ${token}` };

      this.http.put(`${this.endpointTestimoni}/${this.editTestimoniId}`, this.testimoniForm.value, { headers }).subscribe({
        next: () => {
          this.getTestimoni();
          this.isSubmitting = false;
          this.closeModal('editTestimoniModal');

          const modalElement = document.getElementById('editTestimoniModal') as HTMLElement;
          if (modalElement) {
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            modalInstance?.hide();
          }
        },
        error: (err) => {
          console.error('Error updating testimoni:', err);
          this.isSubmitting = false;
        }
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
  



