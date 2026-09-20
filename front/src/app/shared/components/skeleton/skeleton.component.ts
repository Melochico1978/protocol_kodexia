import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      class="skeleton-loader" 
      [style.width]="width" 
      [style.height]="height" 
      [style.border-radius]="borderRadius">
    </div>
  `,
  styles: [`
    .skeleton-loader {
      background: linear-gradient(90deg, #1e2433 25%, #2a3142 50%, #1e2433 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite linear;
      margin-bottom: 10px;
    }

    @keyframes shimmer {
      0% {
        background-position: 200% 0;
      }
      100% {
        background-position: -200% 0;
      }
    }
  `]
})
export class SkeletonComponent {
  @Input() width: string = '100%';
  @Input() height: string = '20px';
  @Input() borderRadius: string = '4px';
}
