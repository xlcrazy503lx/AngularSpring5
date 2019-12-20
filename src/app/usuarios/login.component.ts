import { Component, OnInit } from '@angular/core';
import {Usuario} from "./usuario";
import swal from "sweetalert2";
import {AuthService} from "./auth.service";
import {Router} from "@angular/router";
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  titulo:string = 'Por Favor Inicie Sesión';
  usuario:Usuario;

  constructor(private auth:AuthService, private router:Router) {
    this.usuario = new Usuario();
  }

  ngOnInit() {
    if (this.auth.isAuthenticated()){
      swal.fire('Login',`Hola ${this.auth.usuario.username} autenticado`,'info');
      this.router.navigate(['/clientes']);
    }
  }

  login():void{
    console.log(this.usuario);
    if (this.usuario.username == null || this.usuario.username == '' || this.usuario.password == null || this.usuario.password == ''){
      swal.fire('Error al iniciar sesión','Usuario o contraseñas vacio', 'error');
      return;
    }
    this.auth.login(this.usuario).subscribe(response => {
      console.log(response);
      let payload = JSON.parse(atob(response.access_token.split(".")[1]));
      console.log(payload);
      this.auth.guardarUsuario(response.access_token);
      this.auth.guardarToken(response.access_token);
      let usuariow = this.auth.usuario;
      this.router.navigate(['/clientes']);
      swal.fire('Login',`Hola ${usuariow.username} , Exito`,'success');
    })
  }
}
