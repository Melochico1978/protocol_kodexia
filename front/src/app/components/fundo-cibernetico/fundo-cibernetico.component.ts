import { Component, ElementRef, OnInit, ViewChild, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-fundo-cibernetico',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './fundo-cibernetico.component.html',
  styleUrl: './fundo-cibernetico.component.css'
})
export class FundoCiberneticoComponent implements OnInit {
  @ViewChild('matrixCanvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;

  ngOnInit() {
    this.iniciarEfeitoMatrix();
  }

  iniciarEfeitoMatrix() {
    const ctx = this.canvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const c = this.canvas.nativeElement;
    c.height = window.innerHeight;
    c.width = window.innerWidth;

    const letras = "01010101ABCDEF";
    const fontSize = 14;
    const colunas = c.width / fontSize;
    const gotas: number[] = [];

    for (let x = 0; x < colunas; x++) gotas[x] = 1;

    const desenhar = () => {
      ctx.fillStyle = "rgba(13, 2, 33, 0.05)";
      ctx.fillRect(0, 0, c.width, c.height);

      
      ctx.fillStyle = "#00ff41"; 
      ctx.font = fontSize + "px 'Courier New'";

      for (let i = 0; i < gotas.length; i++) {
        const texto = letras.charAt(Math.floor(Math.random() * letras.length));
        ctx.fillText(texto, i * fontSize, gotas[i] * fontSize);

        if (gotas[i] * fontSize > c.height && Math.random() > 0.975) {
          gotas[i] = 0;
        }
        gotas[i]++;
      }
    };

    setInterval(desenhar, 33);
  }

  @HostListener('window:resize')
  onResize() {
    if (this.canvas && this.canvas.nativeElement) {
      this.canvas.nativeElement.height = window.innerHeight;
      this.canvas.nativeElement.width = window.innerWidth;
    }
  }
}