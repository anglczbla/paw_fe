import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PemesananComponent } from './pemesanan.component';

describe('PemesananComponent', () => {
  let component: PemesananComponent;
  let fixture: ComponentFixture<PemesananComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PemesananComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PemesananComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
