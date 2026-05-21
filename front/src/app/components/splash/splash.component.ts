// src/app/components/splash/splash.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.component.html',
  styleUrl: './splash.component.css',
})
export class SplashComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {
    // Manter a imagem por 5 segundos antes de redirecionar
    setTimeout(() => {
      this.router.navigate(['/inicio']);
    }, 5000);
  }
}