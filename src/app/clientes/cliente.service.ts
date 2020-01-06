import { Injectable } from '@angular/core';
import {Cliente} from "./cliente";
import {CLIENTES} from "./cliente.json";
import {Observable, of, throwError} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, map} from "rxjs/operators";
import swal from "sweetalert2";
import {Router} from "@angular/router";
import {AuthService} from "../usuarios/auth.service";

@Injectable()
export class ClienteService {
  private urlEndPoint:string = 'http://localhost:8080/api/clientes';
  //private httpHeaders= new HttpHeaders({'Content-Type':'application/json'});

  private noAutorizado(e):boolean{
    console.log(e.status);
    if (e.status == 401 ){
      if (this.authService.isAuthenticated()){
        this.authService.logout();
      }
      this.router.navigate(['/login']);
      return true;
    }
    if (e.status ==403 ){
      swal.fire('Acceso denegado',`${this.authService.usuario.username} no tienes acceso a este recurso!`,'warning');
      this.router.navigate(['/clientes']);
      return true;
    }
    return false;
  }
  constructor(private http:HttpClient,private router:Router, private authService:AuthService) { }

  /*
  private agregarAuthHeader(){
    let token = this.authService.token;
    if (token != null && token != ''){
      return this.httpHeaders.append('Authorization','Bearer '+token);
    }else{
      return this.httpHeaders;
    }
  }*/

  getClientes(): Observable<Cliente[]>{
    return this.http.get(this.urlEndPoint).pipe(
      map((response) => response as Cliente[])
    );
  }

  create(cliente:Cliente):Observable<any>{
    return this.http.post<any>(this.urlEndPoint,cliente).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        if (this.noAutorizado(e)){
          return throwError(e);
        }
        if (e.status == 400){
          return throwError(e);
        }

        swal.fire('Error al crear', e.error.mensaje, 'error');
        return throwError(e);
      })
    )
  }

  getCliente(id):Observable<Cliente>{
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        if (this.noAutorizado(e)){
          return throwError(e);
        }
        if (e.status == 400){
          return throwError(e);
        }
        swal.fire('Error al editar', e.error.mensaje, 'error');
        return throwError(e);
      })
    )
  }

  update(cliente:Cliente):Observable<Cliente>{
    //return this.http.put<Cliente>(`${this.urlEndPoint}/${cliente.id}`,cliente,{headers:this.agregarAuthHeader()});
    return this.http.put<Cliente>(`${this.urlEndPoint}/${cliente.id}`,cliente);
  }

  delete(id:number):Observable<Cliente>{
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`)
      .pipe(
        catchError(e => {
          if (this.noAutorizado(e)){
            return throwError(e);
          }
          if (e.status == 400){
            return throwError(e);
          }
        })
      );
  }
}
