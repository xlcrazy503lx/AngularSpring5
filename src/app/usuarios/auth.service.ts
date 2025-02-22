import { Injectable } from '@angular/core';
import {Observable, throwError} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Usuario} from "./usuario";
import {catchError, ignoreElements} from "rxjs/operators";
import swal from "sweetalert2";
import {getToken} from "codelyzer/angular/styles/cssLexer";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _usuario:Usuario;
  private _token:string;
  constructor(private http:HttpClient) { }
  public get usuario():Usuario{
      if (this._usuario != null){
        return this._usuario;
      }else if(this._usuario == null && sessionStorage.getItem('usuario') != null){
        this._usuario = JSON.parse(sessionStorage.getItem('usuario')) as Usuario;
        return this._usuario;
      }
      return new Usuario();
    }

  public get token():string{
    if (this._token != null){
      return this._token;
    }else if(this._token == null && sessionStorage.getItem('token') != null){
      this._token  = sessionStorage.getItem('token');
      return this._token;
    }
    return null;
  }
  login(usuario:Usuario):Observable<any>{
    const urlEndPoint:string = 'http://localhost:8080/oauth/token';
    const credenciales = btoa('angularapp'+':'+'12345');
    const httpHeaders = new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded',
    'Authorization':'Basic '+credenciales});
    let params = new URLSearchParams();
    params.set('grant_type','password');
    params.set('username',usuario.username);
    params.set('password',usuario.password);
    console.log(params.toString());
    return this.http.post<any>(urlEndPoint,params.toString(),{headers:httpHeaders}).pipe(
      catchError(e => {
        console.error(e.error.error);
        if (e.status == 400){
          swal.fire('Error al Iniciar', e.error.error_description, 'error');
          return throwError(e);
        }
        swal.fire('Error al Iniciar sesión', e.error.error, 'error');
        return throwError(e);
      })
    );
  }
  guardarUsuario(accessToken:string):void{
    let payload = this.obtenerDatosToken(accessToken);
    this._usuario = new Usuario();
    this._usuario.nombre = payload.nombre;
    this._usuario.apellido = payload.apellido;
    this._usuario.email = payload.email;
    this._usuario.username = payload.user_name;
    this._usuario.roles = payload.authorities;
    sessionStorage.setItem('usuario',JSON.stringify(this._usuario))
  }

  guardarToken(accessToken:string):void{
    this._token = accessToken;
    console.log('access token '+accessToken);
    sessionStorage.setItem('token',accessToken);
  }

  obtenerDatosToken(access_token:string):any{
    if (access_token !=null){
      console.log('acces token '+access_token);
      return JSON.parse(atob(access_token.split(".")[1]));
    }
    return null;
    //let payload = JSON.parse(atob(access_token.split(".")[1]));
  }
  isAuthenticated():boolean{
    let payload = this.obtenerDatosToken(this.token);
    return payload != null && payload.user_name && payload.user_name.length > 0;
  }

  hasRole(role:string):boolean{
    return this.usuario.roles.includes(role);
  }

  logout():void{
    this._token = null;
    this._usuario = null;
    //sessionStorage.clear();
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('usuario');
  }
}
