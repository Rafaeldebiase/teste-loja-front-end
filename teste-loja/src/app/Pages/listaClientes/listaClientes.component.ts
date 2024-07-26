import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatTableModule, MatTableDataSource} from '@angular/material/table';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { SelectionModel  } from '@angular/cdk/collections';
import { Cliente } from '../../cliente';

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
export class ListaClientesComponent implements AfterViewInit {
  public displayedColumns: string[] = ['select','position','nome', 'email', 'telefone', 'dataCadastro', 'bloqueado', 'acoes'];
  public dataSource = new MatTableDataSource<Cliente>(CLIENTES_DATA);
  public selection = new SelectionModel<Cliente>(true, []);
  public filtro = false; 

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  public ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
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

  public checkboxLabel(row?: Cliente): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  public editarCliente(row?: Cliente) {
    console.log(row)
  }

  public bloquear(cliente: Cliente) {
    cliente.bloqueado = !cliente.bloqueado;
  }

  public mostrarFiltro() {
    this.filtro = !this.filtro;
  }

  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}

const CLIENTES_DATA: Cliente[] = [
  {position: 1, nome: "rafael", email: "teste@teste", telefone: "123654", dataCadastro: "123333", bloqueado: false },
  {position: 2, nome: "rafael", email: "teste@teste", telefone: "123654", dataCadastro: "123333", bloqueado: true },
  {position: 3, nome: "rafael", email: "teste@teste", telefone: "123654", dataCadastro: "123333", bloqueado: false },

];
