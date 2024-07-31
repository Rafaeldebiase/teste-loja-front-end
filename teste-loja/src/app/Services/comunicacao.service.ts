import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ICliente } from '../interfaces/icliente';

@Injectable({
  providedIn: 'root'
})
export class ComunicacaoService {
  private cliente = new BehaviorSubject<ICliente | null>(null);
  private telaCadastro = new BehaviorSubject<boolean>(false);

  setCliente(cliente: ICliente) {
    this.cliente.next(cliente);
  }

  getCliente(): Observable<ICliente | null> {
    return this.cliente.asObservable();
  }

  setTelaCadastro(telaCadastro: boolean) {
    this.telaCadastro.next(telaCadastro);
  }

  getTelaCadastro(): Observable<boolean> {
    return this.telaCadastro.asObservable();
  }
}
