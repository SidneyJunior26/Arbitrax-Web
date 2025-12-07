import { ExchangeService } from './../../core/services/exchange.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { MatDialog } from '@angular/material/dialog';
import { Exchange } from '../../core/models/Exchange';
import { ExchangeInputModel } from '../../core/InputModels/exchangeInputModel';
import { ConfirmationMessageComponent } from '../../shared/confirmation-message/confirmation-message.component';

@Component({
  selector: 'app-exchange-adm',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatPaginatorModule,
    LoadingComponent,
  ],
  templateUrl: './exchange-adm.component.html',
  styleUrl: './exchange-adm.component.css',
})
export class ExchangeAdmComponent implements OnInit {
  constructor(
    private exchangeService: ExchangeService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  exchanges: Exchange[] = [];
  displayedColumns: string[] = [
    'logo',
    'name',
    'exchangeUrl',
    'fee',
    'apiUrl',
    'apiKey',
    'secretKey',
    'edit',
    'delete',
  ];
  dsExchanges: MatTableDataSource<Exchange> =
    new MatTableDataSource<Exchange>();

  protected creating: boolean = false;
  protected updating: boolean = false;

  newExchangeControl = this.formBuilder.group({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    exchangeUrl: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    apiUrl: new FormControl('', [Validators.required, Validators.minLength(3)]),
    apiKey: new FormControl(''),
    secretKey: new FormControl(''),
    fee: new FormControl(0.0),
  });

  editExchangeControl = this.formBuilder.group({
    id: new FormControl('', Validators.required),
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    exchangeUrl: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    apiUrl: new FormControl('', [Validators.required, Validators.minLength(3)]),
    apiKey: new FormControl(''),
    secretKey: new FormControl(''),
    fee: new FormControl(0.0),
  });

  ngOnInit(): void {
    this.loadExchanges();
  }

  private loadExchanges() {
    this.exchangeService.getAll().subscribe(
      (exchanges) => {
        this.exchanges = exchanges;
        this.dsExchanges = new MatTableDataSource(exchanges);
      },
      (error) => {
        this.openSnackBar('Erro ao consultar as corretoras: ' + error);
      }
    );
  }

  protected createExchange() {
    const newExchange: ExchangeInputModel = {
      name: this.newExchangeControl.get('name')!.value!.toString(),
      exchangeUrl: this.newExchangeControl
        .get('exchangeUrl')!
        .value!.toString(),
      apiUrl: this.newExchangeControl.get('apiUrl')!.value!.toString(),
      apiKey: this.newExchangeControl.get('apiKey')!.value!.toString(),
      apiSecretKey: this.newExchangeControl.get('secretKey')!.value!.toString(),
      fee: Number(this.newExchangeControl.get('fee')!.value),
    };

    this.creating = true;
    this.exchangeService.post(newExchange).subscribe(
      () => {
        this.creating = false;

        this.loadExchanges();
        this.openSnackBar('Corretora cadastrada com sucesso');

        this.newExchangeControl.get('name')!.setValue('');
        this.newExchangeControl.get('exchangeUrl')!.setValue('');
        this.newExchangeControl.get('apiUrl')!.setValue('');
        this.newExchangeControl.get('apiKey')!.setValue('');
        this.newExchangeControl.get('secretKey')!.setValue('');
        this.newExchangeControl.get('fee')!.setValue(0.0);
      },
      (e) => {
        this.creating = false;
        if (e.error.userMessage != undefined)
          this.openSnackBar(e.error.userMessage);
        else this.openSnackBar('Erro ao cadastrar corretora');
      }
    );
  }

  protected loadFormEditExchange(exchange: Exchange) {
    this.editExchangeControl.get('id')?.setValue(exchange.id);
    this.editExchangeControl.get('name')?.setValue(exchange.name);
    this.editExchangeControl.get('exchangeUrl')?.setValue(exchange.exchangeUrl);
    this.editExchangeControl.get('apiUrl')?.setValue(exchange.apiUrl);
    this.editExchangeControl.get('apiKey')?.setValue(exchange.apiKey);
    this.editExchangeControl.get('secretKey')?.setValue(exchange.apiSecretKey);
    this.editExchangeControl.get('fee')?.setValue(exchange.fee);
  }

  protected updateExchange() {
    const id = this.editExchangeControl.get('id')!.value!.toString();

    const newExchange: ExchangeInputModel = {
      name: this.editExchangeControl.get('name')!.value!.toString(),
      exchangeUrl: this.editExchangeControl
        .get('exchangeUrl')!
        .value!.toString(),
      apiUrl: this.editExchangeControl.get('apiUrl')!.value!.toString(),
      apiKey: this.editExchangeControl.get('apiKey')!.value!.toString(),
      apiSecretKey: this.editExchangeControl
        .get('secretKey')!
        .value!.toString(),
      fee: Number(this.editExchangeControl.get('fee')!.value),
    };

    this.updating = true;
    this.exchangeService.put(id, newExchange).subscribe(
      () => {
        this.updating = false;
        this.openSnackBar('Corretora atualizada com sucesso');
        this.loadExchanges();

        this.cancelEdit();
      },
      (e) => {
        this.updating = false;

        if (e.error.userMessage != undefined)
          this.openSnackBar(e.error.userMessage);
        else this.openSnackBar('Erro ao atualizar Corretora');
      }
    );
  }

  protected cancelEdit() {
    this.editExchangeControl.get('id')?.setValue('');
    this.editExchangeControl.get('name')?.setValue('');
    this.editExchangeControl.get('exchangeUrl')?.setValue('');
    this.editExchangeControl.get('apiUrl')?.setValue('');
    this.editExchangeControl.get('apiKey')?.setValue('');
    this.editExchangeControl.get('secretKey')?.setValue('');
    this.editExchangeControl.get('fee')?.setValue(0.0);
  }

  protected deleteExchange(exchange: Exchange) {
    this.dialog
      .open(ConfirmationMessageComponent, {
        data: {
          title: 'Excluir Criptomoeda',
          message: 'Gostaria de excluir "' + exchange.name + '"?',
          obs: 'O sistema não irá mais procurar oportunidades na corretora excluída.',
        },
      })
      .afterClosed()
      .subscribe((confirma) => {
        if (confirma)
          this.exchangeService.delete(exchange.id).subscribe(
            () => {
              this.openSnackBar('Corretora removida');
              this.loadExchanges();
            },
            () => {
              this.openSnackBar('Ocorreu um erro ao deletar a corretora');
            }
          );
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dsExchanges.filter = filterValue.trim().toLowerCase();
  }

  private openSnackBar(message: string) {
    this.snackBar.open(message, 'OK', {
      duration: 3000,
    });
  }
}
