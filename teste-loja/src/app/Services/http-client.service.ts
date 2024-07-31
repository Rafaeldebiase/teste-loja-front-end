import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ICliente } from '../interfaces/icliente';
import { NgModel } from '@angular/forms';
import { Observable } from 'rxjs';
import { IClienteGrid } from '../interfaces/iClienteGrid';
import { IBloquear } from '../interfaces/iBloquear';

@Injectable({
  providedIn: 'root'
})
export class HttpClientService {

  private http = inject(HttpClient)
  private apiUrl = 'https://localhost:7141/';

  public inserirCliente(cliente: ICliente) {
    return this.http.post(`${this.apiUrl}api/v1/Cliente/inserir`, cliente);
  }

  public editarCliente(cliente: ICliente) {
    return this.http.put(`${this.apiUrl}api/v1/Cliente/editar`, cliente)
  }

  public bloquearCliente(bloquear: IBloquear) {
    return this.http.put(`${this.apiUrl}api/v1/Cliente/bloquear`, bloquear)
  }

  public verificarEmail(email: string) {
    return this.http.get(`${this.apiUrl}api/v1/Cliente/verificarEmail/${email}`)
  }

  public verificarCpfCnpj(cpfCnpj: string) {
    return this.http.get(`${this.apiUrl}api/v1/Cliente/verificarCpfCnpj/${cpfCnpj}`)
  }

  public verificarInscricaoEstadual(inscricaoEstadual: string) {
    return this.http.get(`${this.apiUrl}api/v1/Cliente/verificarInscricaoEstadual/${inscricaoEstadual}`)
  }

  public buscarClientesPaginado(numeroPagina: number, tamanhoPagina: number): Observable<IClienteGrid[]> {
    return this.http.get<IClienteGrid[]>(`${this.apiUrl}api/v1/Cliente/buscarClientes/${numeroPagina}&${tamanhoPagina}`)
  }

  
}
