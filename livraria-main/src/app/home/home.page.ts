import { UpperCasePipe } from '@angular/common';
import { CATEGORIAS, LivrosService, Livro } from '../services/livros.service';
import { CapaAlternativaDirective } from '../diretivas/capa-alternativa.directive';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonChip,
  IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  imports: [
    UpperCasePipe, CapaAlternativaDirective,
    IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonChip,
    IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, RouterLink,
  ],
})
export class HomePage implements OnInit {
  categoria = 'fantasia';
  categorias = CATEGORIAS;
  livrosPorCategoria: Record<string, Livro[]> = {};
  carregando: Record<string, boolean> = {};
  erros: Record<string, boolean> = {};
  constructor(private api: LivrosService) {}
  ngOnInit() { this.categorias.forEach(cat => this.carregar(cat.id)); }
  carregar(id: string) {
    const cat = this.categorias.find(item => item.id === id)!;
    this.carregando[id] = true;
    this.erros[id] = false;
    this.api.porCategoria(cat.consulta).subscribe({
      next: livros => { this.livrosPorCategoria[id] = livros; this.carregando[id] = false; },
      error: () => { this.erros[id] = true; this.carregando[id] = false; },
    });
  }
}
