import { Component, AfterViewInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LoadingService } from '../../services/loading.service';
import { MenuComponent } from '../../menu/menu.component'; 

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, MenuComponent], 
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css',
})
export class InicioComponent implements AfterViewInit {
  @ViewChild('matrizCanvas', { static: false }) canvas!: ElementRef<HTMLCanvasElement>;

  constructor(
    private router: Router, 
    private loadingService: LoadingService
  ) {}

  ngAfterViewInit() {
    this.iniciarMatrix();
  }

  iniciarMatrix() {
    const c = this.canvas.nativeElement;
    const ctx = c.getContext('2d')!;
    
    c.width = window.innerWidth;
    c.height = window.innerHeight;

    const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*'.split('');
    const fontSize = 16;
    const colunas = c.width / fontSize;
    const drops: number[] = [];

    for (let x = 0; x < colunas; x++) drops[x] = 1;

    setInterval(() => {
      ctx.fillStyle = 'rgba(13, 2, 33, 0.05)';
      ctx.fillRect(0, 0, c.width, c.height);

      ctx.fillStyle = '#00ff41'; 
      ctx.font = fontSize + 'px monospace';

      for (let i = 0; i < drops.length; i++) {
        const texto = letras[Math.floor(Math.random() * letras.length)];
        ctx.fillText(texto, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > c.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }, 50);
  }

  @HostListener('window:resize')
  onResize() {
    this.iniciarMatrix();
  }
}