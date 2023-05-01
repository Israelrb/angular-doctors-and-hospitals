import { AfterViewInit, Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginForm } from 'src/app/interfaces/login-form.interface';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

declare const google: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.css']
})
export class LoginComponent implements AfterViewInit {
  public formSubmitted = false;

  public loginForm = this.fb.group({
    email: [ localStorage.getItem('email') || '', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    remember: [false]
  });


  constructor(
    private router: Router,
    private fb: FormBuilder,
    private usuarioService: UsuarioService
  ){}

  ngAfterViewInit(): void {
    this.googleInit();
  }

  googleInit() {
    google.accounts.id.initialize({
      client_id: '580114238569-s7rllasjkm7ai0g21malc4j30th11tt0.apps.googleusercontent.com',
      callback: (response:any) => this.handleCredentialResponse(response)
    });
    google.accounts.id.renderButton(
      document.getElementById("buttonDiv"),
      { theme: "outline", size: "large" }  // customization attributes
    );
  }

  handleCredentialResponse(response: any){
    console.log("Encoded JWT ID token: " + response.credential);
    this.usuarioService.loginGoogle(response.credential).subscribe(resp => {
      this.router.navigateByUrl('/');
    });
  }

  login(){
    let body: LoginForm = {
      password: this.loginForm.get('password')?.value || '',
      email: this.loginForm.get('email')?.value || '',
      remember: this.loginForm.get('remember')?.value || false
    }
    this.usuarioService.login(body).subscribe( resp => {
      
      if(this.loginForm.get('remember')?.value){
        localStorage.setItem('email', this.loginForm.get('email')?.value || '');
      }else{
        localStorage.removeItem('email');
      }
      
    }, (err)=>{
      // Si sucede un error
      Swal.fire('Error', err.error.msg, 'error');
    });

    // console.log(this.loginForm.value);

     this.router.navigateByUrl('/');
  }
}
