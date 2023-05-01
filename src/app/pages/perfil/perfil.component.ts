import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Usuario } from 'src/app/models/usuario.model';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styles: [
  ]
})
export class PerfilComponent implements OnInit {

  public perfilForm: FormGroup; 
  public usuario: Usuario;
  public imagenSubir: File | undefined;
  public imgTemp: any = '';


  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private fileUploadService: FileUploadService
  ) { 
    this.usuario = usuarioService.usuario;
    this.perfilForm = this.fb.group({
      nombre: [ this.usuario.nombre, Validators.required],
      apellidos: [ this.usuario.apellidos, Validators.required],
      email: [this.usuario.email, [Validators.required, Validators.email]]
    });
  
  }

  ngOnInit(): void {
   }

  actualizarPerfil(){
    this.usuarioService.actualizarPerfil(this.perfilForm.value).subscribe(resp => {
      const {nombre, apellidos, email} = this.perfilForm.value;
      this.usuario.nombre = nombre;
      this.usuario.apellidos = apellidos;
      this.usuario.email = email;
      Swal.fire('Guardado', 'Usuario Actualizado!!', 'success');
    }, (err)=>{
      console.log(err.error.msg);
      Swal.fire('ERROR', err.error.msg , 'error');
    });
  }

  cambiarImagen(event:any){
    const file: File = event.target.files[0];
    this.imagenSubir = file;

    if(!file){ 
      this.imgTemp = null;
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      this.imgTemp = reader.result;
    }
  }

  subirImagen() {
    this.fileUploadService
      .actualizarFoto(this.imagenSubir || new File([""], ""), 'usuarios', String(this.usuario.uid))
      .then(img => {
        this.usuario.img = img;
        Swal.fire('Guardado', 'Imagen guardada!!', 'success');
      });
  }
}
