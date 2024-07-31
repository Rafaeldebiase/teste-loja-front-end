import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatMenuModule} from '@angular/material/menu';
import { Router } from "@angular/router";
import { ComunicacaoService } from '../../Services/comunicacao.service';


@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule, CommonModule],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss'
})
export class ToolbarComponent implements OnInit {
  public telaCadastro = false;

  private _router = inject(Router)
  private _comunicacao = inject(ComunicacaoService)
  private _cdRef = inject(ChangeDetectorRef);


  ngOnInit(): void {
    this._comunicacao.getTelaCadastro().subscribe(x => {
      this.telaCadastro = x
    })
    this._cdRef.detectChanges();

  }

  public abrirCadastroCliente(): void {
    this._router.navigate(['/cadastroCliente'])
  }

}
