import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartaComponent } from './carta.component';

describe('CartaComponent', () => {
  let component: CartaComponent;
  let fixture: ComponentFixture<CartaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CartaComponent);
    component = fixture.componentInstance;
    component.cartaInput = {
      id: '1',
      grupo: 'A',
      codigo: '01',
      nome: 'PYTHON',
      imagem: '',
      performance: 80,
      sintaxe: 85,
      seguranca: 90,
      longevidade: 95,
      popularidade: 100,
      abstracao: 75,
      versatilidade: 70,
      lendaria: false
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
