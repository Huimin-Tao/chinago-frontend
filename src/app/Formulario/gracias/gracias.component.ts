import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-gracias',
  templateUrl: './gracias.component.html',
  styleUrl: './gracias.component.css'
})
export class GraciasComponent implements OnInit {
  nombreRecibido: string = '';

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.nombreRecibido = this.route.snapshot.paramMap.get('nombre') || '';
    console.log('Nombre recibido:', this.nombreRecibido);
  }
}
