import {Component, OnInit} from '@angular/core';
import {Cliente} from "./cliente";
import {ClienteService} from "./cliente.service";
import swal from 'sweetalert2';
import {AuthService} from "../usuarios/auth.service";

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html'
})
export class ClientesComponent implements OnInit {
  clientes:Cliente[];

  constructor(private clienteService:ClienteService,
              private authService:AuthService) { }

  ngOnInit() {
    this.clienteService.getClientes().subscribe(
      (clientes) => this.clientes = clientes
    );
  }

  delete(cliente:Cliente):void{
    swal.fire({
      title: 'Está seguro?',
      text: `¿Deseas eliminar el cliente ${cliente.nombre}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.value) {
        this.clienteService.delete(cliente.id).subscribe(
          response => {
            this.clientes = this.clientes.filter(cli => cli !== cliente);
            swal.fire(
              'Cliente eliminado!',
              `${cliente.nombre} eliminado con éxito`,
              'success'
            );
          }
        )
      }
    })
  }
}

