import { Injectable } from '@angular/core';
import {Cliente} from "./cliente";
import {CLIENTES} from "./cliente.json";
import {Observable, of, throwError} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, map} from "rxjs/operators";
import {Router} from "@angular/router";

@Injectable()
export class ClienteService {
  private urlEndPoint:string = 'http://localhost:8080/api/clientes';
  //private httpHeaders= new HttpHeaders({'Content-Type':'application/json'});

  constructor(private http:HttpClient,private router:Router) { }

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
        if (e.status == 400){
          return throwError(e);
        }
        return throwError(e);
      })
    )
  }

  getCliente(id):Observable<Cliente>{
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.message){
          this.router.navigate(['/clientes']);
        }
        console.error(e.error.mensaje);
        if (e.status == 400){
          return throwError(e);
        }
        return throwError(e);
      })
    )
  }

  update(cliente:Cliente):Observable<Cliente>{
    //return this.http.put<Cliente>(`${this.urlEndPoint}/${cliente.id}`,cliente,{headers:this.agregarAuthHeader()});
    return this.http.put<Cliente>(`${this.urlEndPoint}/${cliente.id}`,cliente)
      .pipe(
        catchError(e => {
          if (e.status == 400){
            return throwError(e);
          }
        })
      );
  }

  delete(id:number):Observable<Cliente>{
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`)
      .pipe(
        catchError(e => {
          if (e.status == 400){
            return throwError(e);
          }
        })
      );
  }
}
