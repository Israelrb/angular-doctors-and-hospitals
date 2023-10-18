import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, delay } from 'rxjs';
import { Usuario } from 'src/app/models/usuario.model';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit, OnDestroy {
  public totalUsuarios: number = 0;
  public usuarios: Usuario[] = [];
  public usuariosTemp: Usuario[] = [];
  public desde: number = 0;
  public cargando: boolean = true;
  public imgSubs: Subscription;

  constructor(
    private usuariveService: UsuarioService,
    private busquedasService: BusquedasService,
    private modalImagenService: ModalImagenService
  ){
    
  }
  ngOnDestroy(): void {
    this.imgSubs.unsubscribe()
  }

  ngOnInit(): void {
    this.cargarUsuarios();
    this.imgSubs = this.modalImagenService.nuevaImagen.pipe(
      delay(1000)
    ).subscribe(img => this.cargarUsuarios())
  }

  cargarUsuarios() {
    this.cargando = true;
    this.usuariveService.cargarUsuarios(this.desde).subscribe(({total, usuarios})=>{
      this.totalUsuarios = total;
      this.usuarios = usuarios;
      this.usuariosTemp = usuarios;
      this.cargando = false;
     })
  }

  cambiarPagina(valor: number) {
    this.desde += valor;

    if(this.desde < 0){
      this.desde = 0;
    }else if( this.desde >= this.totalUsuarios){
      this.desde -= valor;
    };

    this.cargarUsuarios();
  }

  buscar(termino: string) {

    if(termino.length === 0) {
      this.usuarios = this.usuariosTemp;
    }

    this.busquedasService.buscar('usuarios', termino)
        .subscribe(resultados => {
          this.usuarios = resultados;
        });
  }

  eliminarUsuario(usuario: Usuario) {
    if(usuario.uid === this.usuariveService.uid){
      return Swal.fire('Error', 'No puede borrarse a si mismo', 'error');
    }

    return Swal.fire({
      title: '¿Borrar usuario?',
      text: `Esta a punto de borrar a ${usuario.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, borrarlo!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuariveService.eliminarUsuario(usuario).subscribe(resp => {
          Swal.fire('Usuario borrado', `${usuario.nombre} fue eliminado correctamente`, 'success');
          this.cargarUsuarios();
        });
      }
    })
  }

  cambiarRole(usuario: Usuario){
    this.usuariveService.guardarUsuario(usuario).subscribe(resp => {
    });
  }

  abrirModal(usuario: Usuario){
    this.modalImagenService.abrirModal("usuarios", usuario?.uid, usuario.img);
  }
}
