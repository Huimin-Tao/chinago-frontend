import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { GuiasService } from '../../../Guias/services/guias.service';
import { Guia, GuiaForm } from '../../../Guias/models/guia';
import { switchMap, of, map, forkJoin, Observable } from 'rxjs';

@Component({
  selector: 'app-gestion-guias',
  templateUrl: './gestion-guias.component.html',
  styleUrl: './gestion-guias.component.css',
})
export class GestionGuiasComponent implements OnInit{
  @ViewChild('fileInput', { static: false })
  fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('bannerFileInput', { static: false })
  bannerFileInput!: ElementRef<HTMLInputElement>;

  mode: 'create' | 'edit' = 'create';
  loading = false;
  error = '';


  displayedColumns = ['id', 'titulo', 'action'];
  dataSource = new MatTableDataSource<Guia>();


  guiaForm!: FormGroup;
  editForm!: FormGroup;


  selectedGuia: Guia | null = null;
  selectedFile: File | null = null;
  selectedBanerFile: File | null = null;
  selectedFileName = '';
  selectedBannerFileName = '';

  constructor(
    private fb: FormBuilder,
    private guiaService: GuiasService,
  ) {}

  ngOnInit() {
    this.initForms();
  }

  private initForms() {
    this.guiaForm = this.fb.group({
      titulo_guia: ['', Validators.required],
      description_guia: ['', Validators.required],
      url_foto: ['', Validators.required],
    });

    this.editForm = this.fb.group({
      titulo_guia: ['', Validators.required],
      description_guia: ['', Validators.required],
      url_foto: ['', Validators.required],
    });
  }

  switchMode(mode: 'create' | 'edit') {
    this.mode = mode;
    this.error = '';
    this.selectedGuia = null;

    if (mode === 'edit') {
      this.loadGuias();
    }
  }

  private loadGuias() {
    this.loading = true;
    this.guiaService.getGuias().subscribe({
      next: (list) => {
        this.dataSource.data = list;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || 'Error cargando guías';
        this.loading = false;
      },
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
    const ctrl = this.mode === 'create'
      ? this.guiaForm.get('url_foto')
      : this.editForm.get('url_foto');
    ctrl?.setValue(this.selectedFileName);
  }

  onBannerFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    this.selectedBanerFile = input.files[0];
    this.selectedBannerFileName = this.selectedBanerFile.name;
    const ctrl = this.mode === 'create'
      ? this.guiaForm.get('banner_foto')
      : this.editForm.get('banner_foto');
    ctrl?.setValue(this.selectedBannerFileName);
  }

  onCreate() {
     if (this.guiaForm.invalid || !this.selectedFile) {
      this.error = 'Por favor, completa todos los campos y selecciona una imagen.';
      return;
    }

    const payload: GuiaForm = {
      titulo_guia: this.guiaForm.value.titulo_guia,
      description_guia: this.guiaForm.value.description_guia
    };

    this.guiaService.createGuia(payload).pipe(
      switchMap(guia =>{
          return this.guiaService.uploadFoto(guia.id_guia, this.selectedFile!).pipe(
          switchMap(() => this.guiaService.uploadFoto(guia.id_guia, this.selectedBanerFile!)),
          map(() => guia)
        );
      })
    ).subscribe({
      next: (guia) => {
        alert('Guía creada con éxito!');
        this.guiaForm.reset();
        this.selectedFile = null;
        this.selectedFileName = '';
        this.selectedBanerFile = null;
        this.selectedBannerFileName = '';
      },
      error: (err) => {
        console.error('Error en la subida:', err);
        this.error = 'Error al crear la guía: ' + err.message;
      }
    });
  }

  selectGuia(g: Guia) {
    this.selectedGuia = g;
    console.log(g.fotos?.[0].url_foto);
    console.log(g.fotos?.[1].url_foto);
    this.editForm.patchValue({
      titulo_guia: g.titulo_guia,
      description_guia: g.description_guia,
      url_foto: g.fotos?.[0]?.url_foto || '',
      banner_foto: g.fotos?.[1]?.url_foto || ''

    });
    this.selectedFileName = (g.fotos?.[0]?.url_foto || '').replace('/storage/images/guias/', '');
    this.selectedBannerFileName = (g.fotos?.[1]?.url_foto || '').replace('/storage/images/guias/', '');
  }

  onUpdate() {
    if (!this.selectedGuia || this.editForm.invalid) return;

  const payload = this.editForm.value;
  const file = this.selectedFile;

  this.guiaService.updateGuia(this.selectedGuia.id_guia, payload).pipe(
    switchMap(guia => {
      const uploads: Observable<any>[] = [];

      if (this.selectedFile && this.selectedGuia?.fotos[0].id_foto) {
        uploads.push(this.guiaService.updateFotos(this.selectedGuia?.fotos[0].id_foto, this.selectedFile));
      }

      if (this.selectedBanerFile && this.selectedGuia?.fotos[1].id_foto) {
        uploads.push(this.guiaService.updateFotos(this.selectedGuia?.fotos[1].id_foto, this.selectedBanerFile));
      }

      return uploads.length > 0 ? forkJoin(uploads) : of([]);
    })
  ).subscribe({
    next: () => {
      alert('Guía y fotos actualizadas');
      this.loadGuias();
      this.selectedGuia = null;
      this.selectedFile = null;
      this.selectedBanerFile = null;
    },
    error: (err) => {
      this.error = 'Error al actualizar: ' + err.message;
    }
  });
  }

  onDelete(id: number) {
    if (!confirm('¿Seguro que deseas eliminar esta guía?')) return;

    this.guiaService.deleteGuia(id).subscribe({
      next: () => {
        alert('Guía eliminada');
        this.loadGuias();
        if (this.selectedGuia?.id_guia === id) {
          this.selectedGuia = null;
        }
      },
      error: (err) =>
        (this.error = err.message || 'Error eliminando guía'),
    });
  }
}
