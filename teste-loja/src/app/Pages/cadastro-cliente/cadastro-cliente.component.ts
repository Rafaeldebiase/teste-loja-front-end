import { AfterViewInit, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';
import {provideMomentDateAdapter} from '@angular/material-moment-adapter';
import { MAT_DATE_LOCALE} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button'
import { Router } from "@angular/router";
import 'moment/locale/pt-br';
import { ICliente } from '../../interfaces/icliente';
import { HttpClientService } from '../../Services/http-client.service';
import { MatSnackBarModule, MatSnackBar  } from '@angular/material/snack-bar';
import { ComunicacaoService } from '../../Services/comunicacao.service';

@Component({
  selector: 'app-cadastro-cliente',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgxMaskDirective,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'pt-BR'},
    provideMomentDateAdapter(),
  ],
  templateUrl: './cadastro-cliente.component.html',
  styleUrl: './cadastro-cliente.component.scss'
})
export class CadastroClienteComponent implements OnInit, AfterViewInit{
  public clienteForm!: FormGroup;
  public bloqueado = '';
  public tituloBotaoSubmited = "Adicionar cliente";
  public edicao = false;
  private _fb = inject(FormBuilder);
  private _router = inject(Router)
  private _http = inject(HttpClientService)
  private _toast = inject(MatSnackBar)
  private _comunicacao = inject(ComunicacaoService);
  private _cdRef = inject(ChangeDetectorRef);

  ngAfterViewInit(): void {
    this._comunicacao.getCliente().subscribe((cliente: ICliente | null) => {
      if(cliente) {
        this.clienteForm.patchValue(cliente);

        this.verificarDocumento();

        this.clienteForm.get('confirmacaoSenha')?.setValue(cliente.senha);
        this.tituloBotaoSubmited = 'Atualizar';

        this.edicao = true;

        this._cdRef.detectChanges();
      }
    });
    
  }

  private verificarDocumento() {
    let documento: string = this.clienteForm.get('documento')?.value.toString();
    const tipoPessoa: string = this.clienteForm.get('tipoPessoa')?.value.toString();
    let inscricaoEstadual: string = this.clienteForm.get('inscricaoEstadual')?.value.toString();

    if (tipoPessoa === 'fisica' && documento.length < 11) {
      documento = documento.padStart(11, '0');
      this.clienteForm.get('documento')?.patchValue(documento);
    }

    if (tipoPessoa === 'juridica' && documento.length < 14) {
      documento = documento.padStart(14, '0');
      this.clienteForm.get('documento')?.patchValue(documento);
    }

    if(inscricaoEstadual.length < 12) {
      inscricaoEstadual = inscricaoEstadual.padStart(12, '0');
      this.clienteForm.get('inscricaoEstadual')?.patchValue(inscricaoEstadual);
    }
  }

  ngOnInit(): void {
    this._comunicacao.setTelaCadastro(true)
    this.inicializaClienteForm();
    this.isentoChange();
    this.inscricaoEstadualPessoaFisicaChange();
    this.tipoPessoaChange();
  }

  private tipoPessoaChange() {
    this.clienteForm.get('tipoPessoa')?.valueChanges.subscribe(tipoPessoa => {
      if (tipoPessoa === 'fisica') {
        this.clienteForm.get('inscricaoEstadual')?.clearValidators();
        this.clienteForm.get('genero')?.enable();
        this.clienteForm.get('dataNascimento')?.enable();
        this.clienteForm.get('genero')?.setValidators([Validators.required]);
        this.clienteForm.get('dataNascimento')?.setValidators([Validators.required]);
      } else {
        this.clienteForm.get('inscricaoEstadual')?.setValidators([Validators.required]);
        this.clienteForm.get('genero')?.disable();
        this.clienteForm.get('dataNascimento')?.disable();
        this.clienteForm.get('genero')?.clearValidators();
        this.clienteForm.get('dataNascimento')?.clearValidators();
      }
      this.clienteForm.get('genero')?.updateValueAndValidity();
      this.clienteForm.get('dataNascimento')?.updateValueAndValidity();
      this.clienteForm.get('inscricaoEstadual')?.updateValueAndValidity();
    });
  }

  private inscricaoEstadualPessoaFisicaChange() {
    this.clienteForm.get('inscricaoEstadualPessoaFisica')?.valueChanges.subscribe(ativo => {
      if (ativo) {
        this.clienteForm.get('inscricaoEstadual')?.setValidators([Validators.required]);
        this.clienteForm.get('inscricaoEstadual')?.updateValueAndValidity();
      } else {
        this.clienteForm.get('inscricaoEstadual')?.clearValidators();
        this.clienteForm.get('inscricaoEstadual')?.updateValueAndValidity();
      }
    });
  }

  private isentoChange() {
    this.clienteForm.get('isento')?.valueChanges.subscribe(marcado => {
      if (marcado) {
        this.clienteForm.get('inscricaoEstadual')?.disable();
      } else {
        this.clienteForm.get('inscricaoEstadual')?.enable();
        this.clienteForm.get('inscricaoEstadual')?.setValidators([Validators.required]);
      }
    });
  }

  private inicializaClienteForm() {
    this.clienteForm = this._fb.group({
      nomeRazaoSocial: ['', [Validators.required, Validators.maxLength(150)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
      telefone: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.maxLength(11)]],
      tipoPessoa: ['', Validators.required],
      documento: ['', [Validators.required, Validators.maxLength(14), Validators.pattern('^[0-9]*$')]],
      inscricaoEstadual: [{ value: '', disabled: false }, [Validators.maxLength(12), Validators.pattern('^[0-9]*$')]],
      inscricaoEstadualPessoaFisica: [false],
      isento: [false],
      genero: [{ value: '', disabled: false }],
      dataNascimento: [{ value: '', disabled: false }],
      bloqueado: [false],
      senha: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(15), Validators.pattern('^[a-zA-Z0-9]+$')]],
      confirmacaoSenha: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(15), Validators.pattern('^[a-zA-Z0-9]+$')]]
    }, { validator: this.passwordMatchValidator });
  }

  private passwordMatchValidator(form: FormGroup) {
    const senha = form.get('senha');
    const confirmacaoSenha = form.get('confirmacaoSenha');
    const resutado = senha && confirmacaoSenha && senha.value === confirmacaoSenha.value ? null : { mismatch: true };
    return resutado;
  }

  public onSubmit() {
    if (this.clienteForm.valid) {
      const cliente: ICliente = {
        nomeRazaoSocial: this.clienteForm.get('nomeRazaoSocial')?.value,
        email: this.clienteForm.get('email')?.value,
        telefone: this.clienteForm.get('telefone')?.value.toString(),
        tipoPessoa: this.clienteForm.get('tipoPessoa')?.value,
        documento: this.clienteForm.get('documento')?.value.toString(),
        isentoInscricaoEstadual: this.clienteForm.get('isentoInscricaoEstadual')?.value,
        inscricaoEstadualPessoaFisica: this.clienteForm.get('inscricaoEstadualPessoaFisica')?.value,
        inscricaoEstadual: this.clienteForm.get('inscricaoEstadual')?.value.toString(),
        genero: this.clienteForm.get('genero')?.value,
        dataNascimento: new Date(this.clienteForm.get('dataNascimento')?.value),
        bloqueado: this.clienteForm.get('bloqueado')?.value,
        senha: this.clienteForm.get('senha')?.value
      }

      if(!this.edicao) {
        this._http.inserirCliente(cliente).subscribe(() => {
          this.abrirListaDeClientes();
        });
      } else {
        this._http.editarCliente(cliente).subscribe(() => {
          this.abrirListaDeClientes();
        })
      }
    }
  }

  public abrirListaDeClientes(): void {
    this.clienteForm.reset;
    this._router.navigate(['/'])
  }

  public onEmailBlur(): void {
    const email = this.clienteForm.get('email')?.value;
    this._http.verificarEmail(email).subscribe(emailEmUso => {
      if(emailEmUso) {
        this._toast.open('O e-mail já está vinculado a outro Comprador', 'Fechar', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
        this.clienteForm.get('email')?.invalid;
      }
    });
  }

  public onCpfCnpjBlur(): void {
    const documento = this.clienteForm.get('documento')?.value;
    this._http.verificarCpfCnpj(documento).subscribe(documentoEmUso => {
      if(documentoEmUso) {
        this._toast.open('O CPF/CNPJ já está vinculado a outro Comprador', 'Fechar', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
        this.clienteForm.get('email')?.invalid;
      }
    });
  }

  public onInscricaoEstadualBlur(): void {

    const inscricaoEstadual = this.clienteForm.get('inscricaoEstadual')?.value;
    const isentoInscricaoEstadual = this.clienteForm.get('isentoInscricaoEstadual')?.value;
    const inscricaoEstadualPessoaFisica = this.clienteForm.get('inscricaoEstadualPessoaFisica')?.value;
    const tipoPessoa = this.clienteForm.get('tipoPessoa')?.value;

    if(!isentoInscricaoEstadual && (tipoPessoa === 'juridica' || inscricaoEstadualPessoaFisica)) {
      this._http.verificarInscricaoEstadual(inscricaoEstadual).subscribe(inscricaoEstadualEmUso => {
        if(inscricaoEstadualEmUso) {
          this._toast.open('A Inscrição Estadual já está vinculada a outro Comprador', 'Fechar', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          this.clienteForm.get('email')?.invalid;
        }
      });
    }
  }

}
