import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component'; 

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, MenuComponent], 
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css',
})
export class InicioComponent {}