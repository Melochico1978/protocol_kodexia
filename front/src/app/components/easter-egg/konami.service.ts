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

  // Observable for components to subscribe to
  public konamiActivated$ = new Subject<void>();

  constructor(private ngZone: NgZone) {
    this.initListener();
  }

  private initListener() {
    if (typeof window !== 'undefined') {
      // Listening outside Angular zone for performance
      this.ngZone.runOutsideAngular(() => {
        window.addEventListener('keydown', (event: KeyboardEvent) => {
          this.handleKeyDown(event);
        });
      });
    }
  }

  private handleKeyDown(event: KeyboardEvent) {
    // Normalize keys: if it's a single letter, convert to lowercase to handle caps lock/shift
    const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
    this.inputSequence.push(key);

    // Keep only the last 10 characters
    if (this.inputSequence.length > this.konamiCode.length) {
      this.inputSequence.shift();
    }

    if (this.isMatch()) {
      // Re-enter Angular zone to trigger change detection
      this.ngZone.run(() => {
        this.konamiActivated$.next();
        this.inputSequence = []; // Reset after success
      });
    }
  }

  private isMatch(): boolean {
    return this.konamiCode.length === this.inputSequence.length &&
           this.konamiCode.every((key, i) => key === this.inputSequence[i]);
  }
}