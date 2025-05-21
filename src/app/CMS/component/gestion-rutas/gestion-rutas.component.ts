import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RutasService } from '../../../Rutas/services/rutas.service';
import { MatTableDataSource } from '@angular/material/table';
import { Ruta, TipoFiltro } from '../../../Rutas/models/ruta';
import { switchMap, map, of, forkJoin } from 'rxjs';


@Component({
  selector: 'app-gestion-rutas',
  templateUrl: './gestion-rutas.component.html',
  styleUrl: './gestion-rutas.component.css'
})
export class GestionRutasComponent implements OnInit{
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('bannerFileInput', { static: false })
  bannerFileInput!: ElementRef<HTMLInputElement>;

  mode: 'create' | 'edit' = 'create';
  loading = false;
  error = '';

  displayedColumns = ['id', 'titulo', 'action'];
  dataSource = new MatTableDataSource<Ruta>();

  rutaForm!: FormGroup;
  editForm!: FormGroup;

  selectedRuta: Ruta | null = null;
  selectedFile: File | null = null;
  selectedBanerFile: File | null = null;
  selectedFileName = '';
  selectedBannerFileName = '';

  modalActivo: string | null = null;

  tiposFiltro: TipoFiltro[] = [];

  tematicasFiltro = [
    { description_filtro: 'Temática', filtros: [
      { contenido_filtro: 'Familiar' },
      { contenido_filtro: 'Cultural' },
      { contenido_filtro: 'Romántica' },
      { contenido_filtro: 'Naturaleza' },
      { contenido_filtro: 'Gastronomía' },
    ]}
  ];

  iconsList: string[] = [
    'castle.svg',
    'garden.svg',
    'market.svg',
    'plaza.svg',
    'temple.svg',
    'tomb.svg',
    'villa.svg'
  ];

  constructor(private fb: FormBuilder, private rutasService: RutasService){}

  ngOnInit(): void {
    this.initForms();
    this.addItinerario();

    this.rutasService.getTiposFiltro().subscribe({
      next: (tipos) => {
        this.tiposFiltro = tipos;
      },
      error: () => {
        this.error = 'Error cargando los filtros';
      }
    });
  }

  private initForms() {
    this.rutaForm = this.fb.group({
      titulo_ruta: ['', Validators.required],
      description_ruta: ['', Validators.required],
      presupuesto_ruta: ['', Validators.required],
      ciudades_ruta: ['', Validators.required],
      duracion_ruta: ['', Validators.required],
      itinerarios: this.fb.array([]),
      tematica_ruta: ['', Validators.required],
      url_foto: ['', Validators.required],
      banner_foto: ['', Validators.required],
    });

    this.editForm = this.fb.group({
      titulo_ruta: ['', Validators.required],
      description_ruta: ['', Validators.required],
      edit_presupuesto_ruta: ['', Validators.required],
      edit_ciudades_ruta: ['', Validators.required],
      edit_duracion_ruta: ['', Validators.required],
      itinerarios: this.fb.array([]),
      edit_tematica_ruta: ['', Validators.required],
      url_foto: ['', Validators.required],
      banner_foto: ['', Validators.required],
    });
  }

  switchMode(mode: 'create' | 'edit') {
    this.mode = mode;
    this.selectedRuta = null;
    this.error = '';
    if (mode === 'edit') {
      this.loadRutas();
    }
  }

  loadRutas() {
    this.loading = true;
    this.rutasService.getRutas().subscribe({
      next: (list) => {
        this.dataSource.data = list;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || 'Error al cargar rutas';
        this.loading = false;
      }
    });
  }

  openFileDialog() {
    this.fileInput.nativeElement.click();
  }
  openBannerFileDialog() {
    this.bannerFileInput.nativeElement.click();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    this.selectedFile = input.files[0];
    this.selectedFileName = this.selectedFile.name;
    const control = this.mode === 'create' ? this.rutaForm.get('url_foto') : this.editForm.get('url_foto');
    control?.setValue(this.selectedFileName);
  }

  onBannerFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    this.selectedBanerFile = input.files[0];
    this.selectedBannerFileName = this.selectedBanerFile.name;
    const control = this.mode === 'create' ? this.rutaForm.get('banner_foto') : this.editForm.get('banner_foto');
    control?.setValue(this.selectedBanerFile);
  }

  onCreate() {
    if (this.rutaForm.invalid || !this.selectedFile) {
      this.error = 'Completa todos los campos y selecciona una imagen.';
      return;
    }

    const payload = { ...this.rutaForm.value };
    delete payload.url_foto;
    delete payload.itinerarios;

    this.rutasService.createRuta(payload).pipe(
      switchMap(ruta =>
        this.rutasService.uploadFoto(ruta.id_ruta, this.selectedFile!).pipe(
          switchMap(()=> this.rutasService.uploadFoto(ruta.id_ruta, this.selectedBanerFile!)),
          map(foto => ({ ruta, foto }))
        )
      ),
      switchMap(({ ruta, foto }) => {
        const camposFiltro = ['presupuesto_ruta', 'tematica_ruta', 'duracion_ruta', 'ciudades_ruta'];

        const peticionesFiltros = camposFiltro.map(campo => {
          const valor = this.rutaForm.get(campo)?.value;
          const tipoFiltro = this.getFiltrosPorCampo(campo)[0];
          const filtroEncontrado = tipoFiltro?.filtros.find(f => f.contenido_filtro === valor);
          return filtroEncontrado
            ? this.rutasService.addFiltroRuta(ruta.id_ruta, filtroEncontrado.id_filtro)
            : of(null);
        });

        return forkJoin(peticionesFiltros).pipe(
          map(() => ruta)
        );
      }),
    switchMap((ruta) => {
      const itinerarios = this.itinerarios.value;
      const peticionesItinerarios = itinerarios.map((it: any, index: number) => {
        const itinerarioPayload = {
          url_icono: it.icono,
          num_dia: index + 1,
          resumen_itinerario: it.descripcion
        };
        return this.rutasService.addItinerario(ruta.id_ruta, itinerarioPayload);
      });

      return forkJoin(peticionesItinerarios);
    })
    ).subscribe({
      next: () => {
        alert('Ruta creada exitosamente.');
        this.rutaForm.reset();
        this.selectedFile = null;
        this.selectedFileName = '';
      },
      error: (err) => {
        this.error = 'Error al crear ruta: ' + err.message;
      }
    });
  }

  selectRuta(r: Ruta) {

    this.selectedRuta = r;

    this.editItinerarios.clear();


    r.itinerarios?.forEach(itinerario => {
      this.editItinerarios.push(this.fb.group({
          descripcion: [itinerario.resumen_itinerario, Validators.required],
          icono: [itinerario.url_icono, Validators.required]
      }));
    });

    this.selectedFileName = (r.fotos?.[0]?.url_foto || '').replace('/storage/images/rutas/', '');
    this.selectedBannerFileName = (r.fotos?.[1]?.url_foto || '').replace('/storage/images/rutas/', '');

    this.editForm.patchValue({
      titulo_ruta: r.titulo_ruta,
      description_ruta: r.description_ruta,

      url_foto: this.selectedFileName,
      banner_foto: this.selectedBannerFileName,
      presupuesto_ruta: '',
      ciudades_ruta: '',
      duracion_ruta: '',
      tematica_ruta: ''
    });



    r.filtros.forEach(filtro => {
      const tipo = filtro.tipo_filtro?.description_filtro;
      const valor = filtro.contenido_filtro;

      switch (tipo) {
        case 'presupuesto':
          this.editForm.get('edit_presupuesto_ruta')?.setValue(valor);
          break;
        case 'Tematica':
          this.editForm.get('edit_tematica_ruta')?.setValue(valor);
          break;
        case 'Duración':
          this.editForm.get('edit_duracion_ruta')?.setValue(valor);
          break;
        case 'Ciudades':
          this.editForm.get('edit_ciudades_ruta')?.setValue(valor);
          break;
      }
    });
  }

  onUpdate() {
    if (!this.selectedRuta || this.editForm.invalid) {
      this.error = 'Formulario inválido o ruta no seleccionada.';
      return;
    }

    const payload = { ...this.editForm.value };
    delete payload.url_foto;
    delete payload.banner_foto;
    delete payload.itinerarios;

    // Actualizar datos generales de la ruta
    this.rutasService.updateRuta(this.selectedRuta.id_ruta, payload).pipe(
      switchMap(() => {
        const uploadTasks = [];

        if (this.selectedFile instanceof File) {
          uploadTasks.push(this.rutasService.updateFotos(this.selectedRuta!.fotos[0].id_foto, this.selectedFile));
        }

        if (this.selectedBanerFile instanceof File) {
          uploadTasks.push(this.rutasService.updateFotos(this.selectedRuta!.fotos[1].id_foto, this.selectedBanerFile));
        }

        return uploadTasks.length ? forkJoin(uploadTasks) : of(null);
      }),
      switchMap(() => {
        // Obtener itinerarios existentes para borrarlos
        const itinerariosExistentes = this.selectedRuta!.itinerarios || [];

        const deleteTasks = itinerariosExistentes.map(it =>
          this.rutasService.deleteItinerario(it.id_itinerario)
        );

        return deleteTasks.length ? forkJoin(deleteTasks) : of(null);
      }),
      switchMap(() => {
        // Añadir los nuevos itinerarios del formulario
        const itinerariosPayload = this.editItinerarios.value.map((it: any, index: number) => ({
          url_icono: it.icono,
          num_dia: index + 1,
          resumen_itinerario: it.descripcion
        }));

        const itinerariosTasks = itinerariosPayload.map((itinerario: any) =>
          this.rutasService.addItinerario(this.selectedRuta!.id_ruta, itinerario)
        );

        return forkJoin(itinerariosTasks);
      })
    ).subscribe({
      next: () => {
        alert('Ruta actualizada exitosamente.');
        this.loadRutas();
        this.selectedRuta = null;
        this.editForm.reset();
        this.editItinerarios.clear();
        this.selectedFile = null;
        this.selectedBanerFile = null;
        this.selectedFileName = '';
        this.selectedBannerFileName = '';
      },
      error: (err) => {
        this.error = 'Error al actualizar ruta: ' + err.message;
      }
    });
  }

  onDelete(id: number) {
    if (!confirm('¿Eliminar esta ruta?')) return;

    this.rutasService.deleteRuta(id).subscribe({
      next: () => {
        alert('Ruta eliminada');
        this.loadRutas();
        if (this.selectedRuta?.id_ruta === id) this.selectedRuta = null;
      },
      error: err => this.error = err.message || 'Error eliminando ruta',
    });
  }

  abrirSelector(campo: string) {
    this.modalActivo = campo;
  }

  cerrarModal() {
    this.modalActivo = null;
  }

  onValorSeleccionado(campoForm: string, valor: string) {
    const form = this.mode === 'create' ? this.rutaForm : this.editForm;
    form.get(campoForm)?.setValue(valor);
    this.modalActivo = null;
  }

  getFiltrosPorCampo(nombre: string): TipoFiltro[] {
    const map: Record<string, string> = {
      presupuesto_ruta: 'presupuesto',
      tematica_ruta: 'Tematica',
      duracion_ruta: 'Duración',
      ciudades_ruta: 'Ciudades'
    };

    const filtro = this.tiposFiltro.find(t => t.description_filtro === map[nombre]);
    return filtro ? [filtro] : [];
  }

  get itinerarios(): FormArray {
    return this.rutaForm.get('itinerarios') as FormArray;
  }
  get editItinerarios(): FormArray {
    return this.editForm.get('itinerarios') as FormArray;
}

  addItinerario() {
    const itinerario = this.fb.group({
      descripcion: ['', Validators.required],
      icono: ['', Validators.required] // Aquí guardaremos solo el nombre del icono
    });
    this.itinerarios.push(itinerario);
  }

  removeItinerario(i: number) {
    this.itinerarios.removeAt(i);
  }

  onItinerarioFileSelected(event: Event, i: number) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.itinerarios.at(i).get('icono')!.setValue(input.files[0]);
    }
  }
  selectIcon(index: number, icon: string) {
    this.itinerarios.at(index).get('icono')?.setValue(icon);
  }

  addEditItinerario() {
    const itinerario = this.fb.group({
        descripcion: ['', Validators.required],
        icono: ['', Validators.required]
    });
    this.editItinerarios.push(itinerario);
}

removeEditItinerario(index: number) {
    this.editItinerarios.removeAt(index);
}

selectIconEdit(index: number, icon: string) {
    this.editItinerarios.at(index).get('icono')?.setValue(icon);
}
}
