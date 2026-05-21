import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CepSearch } from './cep-search';

describe('CepSearch', () => {
  let component: CepSearch;
  let fixture: ComponentFixture<CepSearch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CepSearch],
    }).compileComponents();

    fixture = TestBed.createComponent(CepSearch);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
