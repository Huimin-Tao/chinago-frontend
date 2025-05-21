import { HttpClient } from '@angular/common/http';
import { Component, OnInit} from '@angular/core';
import { AuthService } from '../Auth/auth.service';


export interface ImageModel {
  src: string;
  id: string;
}

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css',
})
export class LandingPageComponent implements OnInit{

  images: ImageModel[] = [
    { src:'/assets/images/beijing_250x250.jpg', id: '/rutas/2' },
    { src:'/assets/images/shanghai_250x250.jpg', id:'/rutas/3' },
    { src:'/assets/images/chengdu_250x250.jpg', id: '/rutas/4' },
    { src:'/assets/images/suzhou_250x250.jpg', id: '/rutas/5' },
  ];

  open:boolean=false;

  horaBeijing:string = '';
  cargandoHora:boolean = true;


  constructor(private http:HttpClient,
              public auth:AuthService
  ) { }

  ngOnInit(): void {
    this.getHoraBeijing();
    setInterval(() => this.getHoraBeijing(), 60000);
  }

  getHoraBeijing():void{
    this.cargandoHora=true;
    const apiUrl = 'https://www.timeapi.io/api/Time/current/zone?timeZone=Asia/Shanghai';

    this.http.get<any>(apiUrl).subscribe({
      next: (data) => {
        this.horaBeijing = data.time;
        this.cargandoHora = false;
      },
      error: (err) => {
        console.error('Error obteniendo la hora de Beijing:', err);
        this.horaBeijing = 'No disponible';
        this.cargandoHora=false;
      }
    });
  }

  logout() {
    this.auth.logout();
    this.open = false;
  }

  get isAdmin():boolean{
    return this.auth.user?.usuario?.email_user === 'htao@uoc.edu';
  }
}
