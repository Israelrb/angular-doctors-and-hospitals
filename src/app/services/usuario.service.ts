import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegisterForm } from '../interfaces/register-form.interface';
import { environment } from 'src/environments/environment';
import { LoginForm } from '../interfaces/login-form.interface';
import { Observable, catchError, delay, map, of, retry, tap } from 'rxjs';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';
import { CargarUsuario } from '../interfaces/cargar-usuarios.interface';

declare const google: any;


const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  public usuario: Usuario = {
    nombre: '',
    apellidos: '',
    email: '',
    imagenUrl: ''
  }; 

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get uid(): string {
    return this.usuario.uid || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    }
  }

  logout() {
    localStorage.removeItem('token');
    google.accounts.id.revoke('touchcornprogamer@gmail.com', () => {
      this.router.navigate(['/login']);
    }); 
  }


  validarToken(): Observable<boolean> {
    google.accounts.id.initialize({
      client_id:
        '580114238569-s7rllasjkm7ai0g21malc4j30th11tt0.apps.googleusercontent.com',
    });


    return this.http.get(`${ base_url }/login/renew`, {
      headers: {
        'x-token': this.token
      }
    }).pipe(
      map((resp:any) =>{
        const {nombre, apellidos, email, img, google, role, uid} = resp.usuario;
        this.usuario = new Usuario(nombre, apellidos, email, '', img, google, role, uid );
        localStorage.setItem('token', resp.token);
        return true; 
      }),
      catchError(error => of(false))
    )
  }

  crearUsuario(formData: RegisterForm){
   return this.http.post(`${base_url}/usuarios`, formData)
          .pipe(
            tap((resp: any) =>{
              localStorage.setItem('token', resp.token)
            }),
            map(resp => true)
          );
  }

  actualizarPerfil(data: {email: string, nombre: string, role: string | undefined}) {
    data = {
      ...data,
      role: this.usuario?.role
    }
    return this.http.put(`${base_url}/usuarios/${this.uid}`, data, this.headers);
  }

  login(formData: LoginForm){
    return this.http.post(`${base_url}/login`, formData)
            .pipe(
              tap((resp: any) =>{
                localStorage.setItem('token', resp.token)
              })
            )
  }

  loginGoogle(token: string) {
    return this.http.post(`${base_url}/login/google`, {token})
      .pipe(
        tap((resp: any) =>{
          // console.log(resp);
          localStorage.setItem('token', resp.token)
        })
      )
  }

  cargarUsuarios(desde: number=0) {
    const url = `${base_url}/usuarios?desde=${desde}`
    return this.http.get<CargarUsuario>(url, this.headers ).pipe(
      map(resp => {
        const usuarios = resp.usuarios.map<Usuario>( user => {
        return new Usuario(user.nombre, user.apellidos, user.email, '', user.img, user.google, user.role, user.uid);
        });
        
        return {
          total: resp.total,
          usuarios
        };
      })
    )
  }

  eliminarUsuario(usuario: Usuario) {
    // /usuarios/644cfea53bff7ec70078d147

    const url = `${base_url}/usuarios/${usuario.uid}`
    return this.http.delete(url, this.headers );
  }

  guardarUsuario(usuario: Usuario) {
    
    return this.http.put(`${base_url}/usuarios/${usuario.uid}`, usuario, this.headers);
  }

}
