import { Component, OnInit } from '@angular/core';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-imagen',
  templateUrl: './modal-imagen.component.html'
})
export class ModalImagenComponent implements OnInit{
  public imagenSubir: File | undefined;
  public imgTemp: any = '';

  constructor(
    public modalImagenService: ModalImagenService,
    private fileUploadService: FileUploadService
  ) {

  }
  
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  cerradorModal() {
    this.imgTemp = null;
    this.modalImagenService.cerrarModal()
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
    const id = this.modalImagenService.id;
    const tipo = this.modalImagenService.tipo;

    this.fileUploadService
      .actualizarFoto(this.imagenSubir || new File([""], ""), tipo, id)
      .then(img => {
        Swal.fire('Guardado', 'Imagen guardada!!', 'success');
        this.modalImagenService.nuevaImagen.emit(img)
        this.cerradorModal();
      });
  }

  
}
