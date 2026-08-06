import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CartaService } from './carta.service';

describe('CartaService', () => {
  let service: CartaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(CartaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
