import { Injectable } from '@angular/core';
import {Cliente} from "./cliente";
import {CLIENTES} from "./cliente.json";
import {Observable, of, throwError} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, map} from "rxjs/operators";
import swal from "sweetalert2";
import {Router} from "@angular/router";

@Injectable()
export class ClienteService {
  private urlEndPoint:string = 'http://localhost:8080/api/clientes';
  private httpHeaders= new HttpHeaders({'Content-Type':'application/json'});
  private noAutorizado(e):boolean{
    if (e.status == 401 || e.status ==403 ){
      this.router.navigate(['/login']);
      return true;
    }
    return false;
  }
  constructor(private http:HttpClient,private router:Router) { }

  getClientes(): Observable<Cliente[]>{
    //return of(CLIENTES);
    //return this.http.get<Cliente[]>(this.urlEndPoint);
    return this.http.get(this.urlEndPoint).pipe(
      map((response) => response as Cliente[])
    );
  }

  create(cliente:Cliente):Observable<any>{
    return this.http.post<any>(this.urlEndPoint,cliente,{headers:this.httpHeaders}).pipe(
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
        //this.router.navigate(['/clientes']);
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
    return this.http.put<Cliente>(`${this.urlEndPoint}/${cliente.id}`,cliente,{headers:this.httpHeaders});
  }

  delete(id:number):Observable<Cliente>{
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`,{headers:this.httpHeaders})
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
