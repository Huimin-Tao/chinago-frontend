import { Component, OnInit, Output, EventEmitter, ElementRef, HostListener, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { RutasService } from '../../services/rutas.service';
import { Observable, combineLatest, of } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { Filtro, TipoFiltro, Ruta } from '../../models/ruta';

@Component({
  selector: 'app-buscador-rutas',
  templateUrl: './buscador-rutas.component.html',
  styleUrls: ['./buscador-rutas.component.css']
})
export class BuscadorRutasComponent implements OnInit {
  filtroForm!: FormGroup;
  searchControl = new FormControl('');
  tiposFiltro$: Observable<TipoFiltro[]>;
  filteredTipos$: Observable<TipoFiltro[]> | undefined;
  showFilter = false;

  @Output() search = new EventEmitter<string | Ruta[]>();
  @Input() filtrosPersonalizados: TipoFiltro[] | null = null;
  @Output() seleccionarValor = new EventEmitter<string>();

  constructor(
    private fb: FormBuilder,
    private eRef: ElementRef,
    private rutasService: RutasService
  ) {
    this.tiposFiltro$ = this.rutasService.getTiposFiltro();
  }


  ngOnInit(): void {
    this.filtroForm = this.fb.group({
      q: ['']
    });

    const filtros$ = this.filtrosPersonalizados
      ? of(this.filtrosPersonalizados)
      : this.tiposFiltro$;

    this.filteredTipos$ = combineLatest([
      filtros$,
      this.searchControl.valueChanges.pipe(startWith(''))
    ]).pipe(
      map(([tipos, term]) => {
        const t = term?.trim().toLowerCase() || '';
        return tipos.map(tipo => ({
          ...tipo,
          filtros: tipo.filtros.filter((f: { contenido_filtro: string }) =>
            f.contenido_filtro.toLowerCase().includes(t)
          )
        })).filter(tipo => tipo.filtros.length > 0);
      })
    );
    if (this.filtrosPersonalizados) {
      this.showFilter = true;
    }
  }


  @HostListener('document:click', ['$event.target'])
  onClickOutside(target: HTMLElement) {
    if (!this.eRef.nativeElement.contains(target)) {
      this.showFilter = false;
    }
  }


  submit(): void {
    const texto = this.filtroForm.get('q')!.value.trim();
    if (texto) this.search.emit(texto);
    this.showFilter = false;
  }

  onInputFocus(): void {
    this.showFilter = true;
  }


  onSelect(filtro: Filtro): void {
    this.filtroForm.patchValue({ q: filtro.contenido_filtro });

    if (this.filtrosPersonalizados) {
      this.seleccionarValor.emit(filtro.contenido_filtro);
    } else {
      this.rutasService.getRutasPorFiltro(filtro.id_filtro).subscribe(rutas => {
        this.search.emit(rutas);
      });
    }

    this.showFilter = false;
  }



  onClose(): void {
    this.showFilter = false;
  }
}
