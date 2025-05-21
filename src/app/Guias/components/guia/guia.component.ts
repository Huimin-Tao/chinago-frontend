import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GuiasService } from '../../services/guias.service';
import { Guia } from '../../models/guia';
import { DomSanitizer, SafeHtml }  from '@angular/platform-browser';
import { switchMap, map } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-guia',
  templateUrl: './guia.component.html',
  styleUrl: './guia.component.css'
})
export class GuiaComponent implements OnInit{
  guia!: Guia;
  safeHtml!: SafeHtml;
  guiasSimilares:Guia[]=[];
  apiurl = environment.apiUrl;


  constructor(
    private route: ActivatedRoute,
    private guiasService: GuiasService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        map(params => +params.get('id')!),
        switchMap(id => this.guiasService.getGuiaById(id))
      )
      .subscribe({
        next: data => {
          this.guia = data;
          this.safeHtml = this.sanitizer.bypassSecurityTrustHtml(data.description_guia || '');

          this.guiasService.getGuias().subscribe(list => {
            const otros = list.filter(g => g.id_guia !== this.guia.id_guia);
            this.guiasSimilares = this.shuffleArray(otros).slice(0, 4);
          });
        },
        error: err => console.error('Error cargando guía', err)
      });
  }

  private shuffleArray<T>(arr: T[]): T[] {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

}
