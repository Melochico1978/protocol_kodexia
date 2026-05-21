import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GerenciarCartasComponent } from './gerenciar-cartas.component';

describe('GerenciarCartasComponent', () => {
  let component: GerenciarCartasComponent;
  let fixture: ComponentFixture<GerenciarCartasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GerenciarCartasComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GerenciarCartasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
