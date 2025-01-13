import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import * as bootstrap from 'bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-pengiriman',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgxPaginationModule],
  templateUrl: './pengiriman.component.html',
  styleUrls: ['./pengiriman.component.css'],
})
export class PengirimanComponent implements OnInit {
  pengiriman: any[] = [];
  pemesanan: any[] = [];
  currentPage = 1;
  itemsPerPage = 5;
  isLoading = true;
  isSubmitting = false;
  editPengirimanId: string | null = null;


  apiPengirimanUrl = 'https://uas-backend-sigma.vercel.app/api/pengiriman';
  apiPemesananUrl = 'https://uas-backend-sigma.vercel.app/api/pemesanan';
  pengirimanForm: FormGroup;
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);

  constructor() {
    this.pengirimanForm = this.fb.group({
      pemesanan_id: '',
      alamat: '',
      kota: '',
      kodePos: '',
      negara: '',
      status: [''],
    });
  }

  ngOnInit(): void {
    this.getPengiriman();
    this.getPemesanan();
  }

  // statusList: string[] = ['Shipping',"Pending","Delivered"];

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

  getPemesanan(): void {
    this.http.get<any[]>(this.apiPemesananUrl).subscribe({
      next: (data) => {
        this.pemesanan = data;
      },
      error: (err) => {
        console.error('Error fetching pemesanan data:', err);
      }
    });
  }

  // addPengiriman(): void {
  //   if (this.pengirimanForm.valid) {
  //     this.isSubmitting = true;

  //     const token = localStorage.getItem('authToken');
  //     const headers = { Authorization: `Bearer ${token}` };

  //     this.http.post(this.apiPengirimanUrl, this.pengirimanForm.value, { headers }).subscribe({
  //       next: (response) => {
  //         console.log('Data berhasil ditambahkan:', response);
  //         this.getPengiriman();
  //         this.pengirimanForm.reset();
  //         this.isSubmitting = false;

  //         // Close modal
  //         const modalElement = document.getElementById('tambahPengirimanModal') as HTMLElement;
  //         if (modalElement) {
  //           const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
  //           modalInstance.hide();

  //           // Remove modal backdrop
  //           const backdrop = document.querySelector('.modal-backdrop');
  //           if (backdrop) {
  //             backdrop.remove();
  //           }

  //           // Reset scroll on body
  //           document.body.classList.remove('modal-open');
  //           document.body.style.overflow = '';
  //           document.body.style.paddingRight = '';
  //         }
  //       },
  //       error: (err) => {
  //         console.error('Error adding pengiriman:', err);
  //         this.isSubmitting = false;
  //       }
  //     });
  //   } else {
  //     console.error('Form is invalid');
  //   }
  // }

  addPengiriman(): void {
    if (this.pengirimanForm.valid) {
      this.isSubmitting = true;
  
      const token = localStorage.getItem('authToken');
      const headers = { Authorization: `Bearer ${token}` };
  
      // Mengirimkan POST request
      this.http.post(this.apiPengirimanUrl, this.pengirimanForm.value, { headers }).subscribe({
        next: (response) => {
          console.log('Data berhasil ditambahkan:', response);
          this.getPengiriman();
          this.pengirimanForm.reset();
          this.isSubmitting = false;
  
          // Tutup modal
          const modalElement = document.getElementById('tambahPengirimanModal') as HTMLElement;
          if (modalElement) {
            const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
            modalInstance.hide();
  
            // Hapus backdrop modal
            const backdrop = document.querySelector('.modal-backdrop');
            if (backdrop) {
              backdrop.remove();
            }
  
            // Reset scroll pada body
            document.body.classList.remove('modal-open');
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
          }
        },
        error: (err) => {
          console.error('Error adding pengiriman:', err);
          this.isSubmitting = false;
        }
      });
    } else {
      console.error('Form is invalid');
    }
  }
  

  deletePengiriman(_id: string): void {
    if (confirm('Apakah Anda yakin ingin menghapus pengiriman ini?')) {
      const token = localStorage.getItem('authToken');
      const headers = { Authorization: `Bearer ${token}` };
  
      this.http
        .delete(`${this.apiPengirimanUrl}/${_id}`, { headers })
        .subscribe({
          next: () => {
            this.getPengiriman();
            console.log(`Pengiriman dengan ID ${_id} berhasil dihapus`);
          },
          error: (err) => {
            console.error('Error deleting pengiriman:', err);
          },
        });
    }
  }
  
  getPengirimanById(_id: string): void {
    this.editPengirimanId = _id;
    this.http.get<any>(`${this.apiPengirimanUrl}/${_id}`).subscribe({
      next: (data) => {
        this.pengirimanForm.patchValue(data);
        this.openModal('editPengirimanModal');
      },
      error: (err) => {
        console.error('Error fetching pengiriman by ID:', err);
      },
    });
  }
  
  updatePengiriman(): void {
    if (this.pengirimanForm.valid && this.editPengirimanId) {
      this.isSubmitting = true;
  
      const token = localStorage.getItem('authToken');
      const headers = { Authorization: `Bearer ${token}` };
  
      this.http
        .put(
          `${this.apiPengirimanUrl}/${this.editPengirimanId}`,
          this.pengirimanForm.value,
          { headers }
        )
        .subscribe({
          next: () => {
            this.getPengiriman();
            this.isSubmitting = false;
            this.closeModal('editPengirimanModal');
  
            const modalElement = document.getElementById(
              'editPengirimanModal'
            ) as HTMLElement;
            if (modalElement) {
              const modalInstance = bootstrap.Modal.getInstance(modalElement);
              modalInstance?.hide();
            }
          },
          error: (err) => {
            console.error('Error updating pengiriman:', err);
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
      const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
      modalInstance.hide();
    }
  }
}
