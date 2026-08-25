import { TestBed } from '@angular/core/testing';

import { KonamiService } from './konami.service';

describe('KonamiService', () => {
  let service: KonamiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KonamiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
