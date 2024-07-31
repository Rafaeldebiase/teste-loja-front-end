import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatTableModule, MatTableDataSource} from '@angular/material/table';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { SelectionModel  } from '@angular/cdk/collections';
import { HttpClientService } from '../../Services/http-client.service';
import { IClienteGrid } from '../../interfaces/iClienteGrid';
import { ComunicacaoService } from '../../Services/comunicacao.service';
import { ICliente } from '../../interfaces/icliente';
import { Router } from '@angular/router';
import { IBloquear } from '../../interfaces/iBloquear';

@Component({
  selector: 'app-listaClientes',
  standalone: true,
  imports: [
    MatTableModule, 
    MatPaginatorModule, 
    MatCheckboxModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    CommonModule
  ],
  templateUrl: './listaClientes.component.html',
  styleUrl: './listaClientes.component.scss',
})
export class ListaClientesComponent implements AfterViewInit, OnInit {
  public displayedColumns: string[] = ['select','nomeRazaoSocial', 'email', 'telefone', 'dataCadastro', 'bloqueado', 'acoes'];
  public dataSource: MatTableDataSource<IClienteGrid> = new MatTableDataSource();
  public selection = new SelectionModel<IClienteGrid>(true, []);
  public filtro = false; 

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private _http = inject(HttpClientService);
  private _comunicacao = inject(ComunicacaoService);
  private _router = inject(Router)


  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  public ngAfterViewInit() {
    this.carregarClientes();
    this.paginator.page.subscribe(() => {
      this.carregarClientes()
      this.dataSource.paginator = this.paginator;
    }
  );
  }

  public carregarClientes() {
    const paginaAtual = this.paginator.pageIndex;
    const tamanhoPagina = this.paginator.pageSize;

    this._http.buscarClientesPaginado(paginaAtual + 1, tamanhoPagina).subscribe(response => {
      this.dataSource.data = response;
    });
  }

  public isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  public toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  public checkboxLabel(row?: IClienteGrid): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  public editarCliente(row?: ICliente) {
    console.log(row)
    const cliente: ICliente = {
      nomeRazaoSocial: row?.nomeRazaoSocial!,
      email: row?.email!,
      telefone: row?.telefone!,
      tipoPessoa: row?.tipoPessoa!,
      documento:row?.documento!,
      inscricaoEstadualPessoaFisica: row?.inscricaoEstadualPessoaFisica!,
      isentoInscricaoEstadual: row?.isentoInscricaoEstadual!,
      inscricaoEstadual: row?.inscricaoEstadual!,
      genero: row?.genero!,
      dataNascimento: row?.dataNascimento!,
      bloqueado: row?.bloqueado!,
      senha: row?.senha!
    }

    this._comunicacao.setCliente(cliente);
    this._router.navigate(['/cadastroCliente'])
  }

  public bloquear(cliente: IClienteGrid) {
    cliente.bloqueado = !cliente.bloqueado;
    const bloquear: IBloquear = {email: cliente.email}

    this._http.bloquearCliente(bloquear).subscribe(x => console.log);
  }

  public mostrarFiltro() {
    this.filtro = !this.filtro;
  }

  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
