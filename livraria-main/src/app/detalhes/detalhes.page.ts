import { SlicePipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { ResumirPipe } from '../pipes/resumir.pipe';
import { LivrosService, Livro } from '../services/livros.service';
import { FavoritosService } from '../services/favoritos.service';
import { CapaAlternativaDirective } from '../diretivas/capa-alternativa.directive';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton,
  IonChip, IonButton,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-detalhes',
  templateUrl: './detalhes.page.html',
  imports: [
    SlicePipe, ResumirPipe, CapaAlternativaDirective,
    IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton,
    IonChip, IonButton,
  ],
})
export class DetalhesPage {
  id = '';
  livro: Livro | null = null;
  favorito = false;
  carregando = true;
  erro = false;
  erroFavoritos = '';
  expandido = false;
  private consulta?: Subscription;
  constructor(private route: ActivatedRoute, private api: LivrosService, private salvos: FavoritosService) {}
  ionViewWillEnter() {
    this.id = this.route.snapshot.paramMap.get('id') ?? '';
    this.expandido = false;
    this.erroFavoritos = '';
    try { this.favorito = this.salvos.contem('/works/' + this.id); }
    catch { this.erroFavoritos = 'Não foi possível ler os favoritos deste navegador.'; }
    this.carregar();
  }
  carregar() {
    this.consulta?.unsubscribe();
    this.carregando = true;
    this.erro = false;
    this.livro = null;
    this.consulta = this.api.detalhes(this.id).subscribe({
      next: livro => { this.livro = livro; this.carregando = false; },
      error: () => { this.erro = true; this.carregando = false; },
    });
  }
  ngOnDestroy() { this.consulta?.unsubscribe(); }
  alternarFavorito() {
    if (!this.livro) return;
    try {
      if (this.salvos.contem(this.livro.key)) this.salvos.remover(this.livro.key);
      else this.salvos.adicionar(this.livro);
      this.favorito = this.salvos.contem(this.livro.key);
      this.erroFavoritos = '';
    } catch { this.erroFavoritos = 'Não foi possível salvar a alteração nos favoritos deste navegador.'; }
  }
}
