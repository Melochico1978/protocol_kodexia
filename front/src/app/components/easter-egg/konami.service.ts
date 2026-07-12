import { Injectable, NgZone } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class KonamiService {
  private readonly konamiCode = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'
  ];
  private inputSequence: string[] = [];

  
  public konamiActivated$ = new Subject<void>();

  constructor(private ngZone: NgZone) {
    this.initListener();
  }

  private initListener() {
    if (typeof window !== 'undefined') {
      
      this.ngZone.runOutsideAngular(() => {
        window.addEventListener('keydown', (event: KeyboardEvent) => {
          this.handleKeyDown(event);
        });
      });
    }
  }

  private handleKeyDown(event: KeyboardEvent) {
    
    const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
    this.inputSequence.push(key);

    
    if (this.inputSequence.length > this.konamiCode.length) {
      this.inputSequence.shift();
    }

    if (this.isMatch()) {
      
      this.ngZone.run(() => {
        this.konamiActivated$.next();
        this.inputSequence = []; 
      });
    }
  }

  private isMatch(): boolean {
    return this.konamiCode.length === this.inputSequence.length &&
           this.konamiCode.every((key, i) => key === this.inputSequence[i]);
  }
}