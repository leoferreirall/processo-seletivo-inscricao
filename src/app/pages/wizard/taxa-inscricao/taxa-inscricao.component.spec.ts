import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxaInscricaoComponent } from './taxa-inscricao.component';

describe('TaxaInscricaoComponent', () => {
  let component: TaxaInscricaoComponent;
  let fixture: ComponentFixture<TaxaInscricaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaxaInscricaoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxaInscricaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
