import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { ListaClientesComponent } from './Pages/listaClientes/listaClientes.component';
import { CadastroClienteComponent } from './Pages/cadastro-cliente/cadastro-cliente.component';

export const routes: Routes = [
    {path:'listaClientes', component: ListaClientesComponent },
    {path:'cadastroCliente', component: CadastroClienteComponent},
    {path:'', component: ListaClientesComponent}
];
