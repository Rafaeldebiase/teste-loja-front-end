import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';
import {provideMomentDateAdapter} from '@angular/material-moment-adapter';
import { MAT_DATE_LOCALE} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button'
import 'moment/locale/pt-br';

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
    MatButtonModule
  ],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'pt-BR'},
    provideMomentDateAdapter(),
  ],
  templateUrl: './cadastro-cliente.component.html',
  styleUrl: './cadastro-cliente.component.scss'
})
export class CadastroClienteComponent implements OnInit{
  public clienteForm!: FormGroup;
  public bloqueado = '';
  public erros = false;
  private _fb = inject(FormBuilder);

  ngOnInit(): void {
    this.clienteForm = this._fb.group({
      nomeRazaoSocial: ['', [Validators.required, Validators.maxLength(150)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
      telefone: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.maxLength(11)]],
      tipoPessoa: ['', Validators.required],
      documento: ['', [Validators.required, Validators.maxLength(14)]],
      inscricaoEstadual: [{ value: '', disabled: false }, Validators.maxLength(12)],
      inscricaoEstadualPessoaFisica: [false],
      isento: [false],
      genero: [{value: '', disabled: false}],
      dataNascimento: [{ value: '', disabled: false }],
      bloqueado: [false],
      senha: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(15), Validators.pattern('^[a-zA-Z0-9]+$')]],
      confirmacaoSenha: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(15), Validators.pattern('^[a-zA-Z0-9]+$')]]
    }, { validator: this.passwordMatchValidator });

    this.clienteForm.get('isento')?.valueChanges.subscribe(marcado => {
      if(marcado) {
        this.clienteForm.get('inscricaoEstadual')?.disable();
      } else {
        this.clienteForm.get('inscricaoEstadual')?.enable();
        this.clienteForm.get('inscricaoEstadual')?.setValidators([Validators.required]);
      }
    });

    this.clienteForm.get('inscricaoEstadualPessoaFisica')?.valueChanges.subscribe(ativo => {
      if(ativo) {
        this.clienteForm.get('inscricaoEstadual')?.setValidators([Validators.required]);
        this.clienteForm.get('inscricaoEstadual')?.updateValueAndValidity();
      } else {
        this.clienteForm.get('inscricaoEstadual')?.clearValidators();
        this.clienteForm.get('inscricaoEstadual')?.updateValueAndValidity();
      }
    });

    this.clienteForm.get('tipoPessoa')?.valueChanges.subscribe(tipoPessoa => {
      if (tipoPessoa === '1') {
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

  private passwordMatchValidator(form: FormGroup) {
    const senha = form.get('senha');
    const confirmacaoSenha = form.get('confirmacaoSenha');
    const resutado = senha && confirmacaoSenha && senha.value === confirmacaoSenha.value ? null : { mismatch: true };
    return resutado;
  }

  onSubmit() {
    if (this.clienteForm.valid) {
      console.log('Form Submitted!', this.clienteForm.value);
    } else {
      this.erros = true
    }
  }

}
