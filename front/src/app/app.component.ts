import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoadingComponent } from './components/loading/loading.component';
import { FundoCiberneticoComponent } from './components/fundo-cibernetico/fundo-cibernetico.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoadingComponent, FundoCiberneticoComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'super-trunfo-rally';
  isFullscreen = false;

  ngOnInit() {
    // Listen for fullscreen change events to update state
    document.addEventListener('fullscreenchange', () => {
      this.isFullscreen = !!document.fullscreenElement;
    });
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error('Error attempting to enable fullscreen:', err);
      });
    } else {
      document.exitFullscreen().catch(err => {
        console.error('Error attempting to exit fullscreen:', err);
      });
    }
  }
}