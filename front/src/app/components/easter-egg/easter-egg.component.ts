import { Component, inject, OnInit, OnDestroy, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { NgIf } from '@angular/common';
import { KonamiService } from '../../core/services/konami.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-easter-egg',
  standalone: true,
  imports: [NgIf],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './easter-egg.component.html',
  styleUrl: './easter-egg.component.css'
})
export class EasterEggComponent implements OnInit, OnDestroy {
  konami = inject(KonamiService);
  cdr = inject(ChangeDetectorRef);
  isActive = false;
  private sub?: Subscription;

  ngOnInit() {
    this.sub = this.konami.konamiActivated$.subscribe(() => {
      this.isActive = true;
      this.cdr.markForCheck();

      if (typeof document !== 'undefined') {
        document.body.classList.add('barrel-roll');
        
        setTimeout(() => {
          this.isActive = false;
          document.body.classList.remove('barrel-roll');
          this.cdr.markForCheck();
        }, 6500);
      }
    });
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
    // Safety cleanup
    if (typeof document !== 'undefined') {
      document.body.classList.remove('barrel-roll');
    }
  }
}
