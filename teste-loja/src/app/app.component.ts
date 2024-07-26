import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToolbarComponent } from "./components/toolbar/toolbar.component";
import { ListaClientesComponent } from "./Pages/listaClientes/listaClientes.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToolbarComponent, ListaClientesComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'teste-loja';
}
