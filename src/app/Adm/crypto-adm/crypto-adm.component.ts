import { CryptoInputModel } from './../../core/InputModels/cryptoInputModel';
import { CryptoService } from './../../core/services/crypto.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Crypto } from '../../core/models/Crypto';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationMessageComponent } from '../../shared/confirmation-message/confirmation-message.component';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-crypto-adm',
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
  templateUrl: './crypto-adm.component.html',
  styleUrl: './crypto-adm.component.css',
})
export class CryptoAdmComponent implements OnInit {
  constructor(
    private cryptoService: CryptoService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  cryptos: Crypto[] = [];
  displayedColumns: string[] = [
    'logo',
    'symbol',
    'name',
    'status',
    'edit',
    'delete',
  ];
  dsCryptos: MatTableDataSource<Crypto> = new MatTableDataSource<Crypto>();

  newCryptoControl = this.formBuilder.group({
    symbol: new FormControl('', [Validators.required, Validators.minLength(2)]),
    name: new FormControl('', [Validators.required, Validators.minLength(2)]),
  });

  editCryptoControl = this.formBuilder.group({
    id: new FormControl('', Validators.required),
    symbol: new FormControl('', [Validators.required, Validators.minLength(2)]),
    name: new FormControl('', [Validators.required, Validators.minLength(2)]),
  });

  @ViewChild('cryptosPaginator') cryptosPaginator: MatPaginator;

  creating: boolean = false;
  updating: boolean = false;

  ngOnInit(): void {
    this.loadCryptos();
  }

  ngAfterViewInit() {
    this.dsCryptos.paginator = this.cryptosPaginator;
  }

  private loadCryptos() {
    this.cryptoService.getAll().subscribe(
      (cryptos) => {
        this.cryptos = cryptos;
        this.dsCryptos = new MatTableDataSource(cryptos);
        this.dsCryptos.paginator = this.cryptosPaginator;
      },
      (error) => {
        this.openSnackBar('Erro ao consultar as criptomoedas: ' + error);
      }
    );
  }

  protected createCrypto() {
    const newCrypto: CryptoInputModel = {
      symbol: this.newCryptoControl.get('symbol')!.value!.toString(),
      name: this.newCryptoControl.get('name')!.value!.toString(),
    };

    this.creating = true;
    this.cryptoService.post(newCrypto).subscribe(
      () => {
        this.creating = false;

        this.loadCryptos();
        this.openSnackBar('Criptomoeda cadastrada com sucesso');

        this.newCryptoControl.get('symbol')!.setValue('');
        this.newCryptoControl.get('name')!.setValue('');

        this.newCryptoControl.clearValidators();
      },
      (e) => {
        this.creating = false;
        if (e.error.userMessage != undefined)
          this.openSnackBar(e.error.userMessage);
        else this.openSnackBar('Erro ao cadastrar criptomoeda');
      }
    );
  }

  protected loadFormEditCrypto(crypto: Crypto) {
    this.editCryptoControl.get('id')?.setValue(crypto.id);
    this.editCryptoControl.get('symbol')?.setValue(crypto.symbol);
    this.editCryptoControl.get('name')?.setValue(crypto.name);
  }

  protected updateCrypto() {
    const id = this.editCryptoControl.get('id')!.value!.toString();

    const newCrypto: CryptoInputModel = {
      symbol: this.editCryptoControl.get('symbol')!.value!.toString(),
      name: this.editCryptoControl.get('name')!.value!.toString(),
    };

    this.updating = true;
    this.cryptoService.put(id, newCrypto).subscribe(
      () => {
        this.updating = false;

        this.openSnackBar('Criptomoeda atualizada com sucesso');
        this.loadCryptos();

        this.cancelEdit();
      },
      (e) => {
        this.updating = false;

        if (e.error.userMessage != undefined)
          this.openSnackBar(e.error.userMessage);
        else this.openSnackBar('Erro ao atualizar criptomoeda');
      }
    );
  }

  protected updateStatusCrypto(id: string) {
    this.cryptoService.putStatus(id).subscribe(
      () => {
        this.openSnackBar('Status atualizado com sucesso');
        this.loadCryptos();
      },
      () => this.openSnackBar('Erro ao atualizar status')
    );
  }

  protected cancelEdit() {
    this.editCryptoControl.get('id')!.setValue('');
    this.editCryptoControl.get('symbol')!.setValue('');
    this.editCryptoControl.get('name')!.setValue('');
  }

  protected deleteCrypto(crypto: Crypto) {
    this.dialog
      .open(ConfirmationMessageComponent, {
        data: {
          title: 'Excluir Criptomoeda',
          message: 'Gostaria de excluir "' + crypto.name + '"?',
          obs: 'O sistema não irá mais procurar oportunidades para a criptomoeda excluída.',
        },
      })
      .afterClosed()
      .subscribe((confirma) => {
        if (confirma)
          this.cryptoService.delete(crypto.id).subscribe(
            () => {
              this.openSnackBar('Criptomoeda removida');
              this.loadCryptos();
            },
            () => {
              this.openSnackBar('Ocorreu um erro ao deletar a Criptomoeda');
            }
          );
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dsCryptos.filter = filterValue.trim().toLowerCase();
  }

  private openSnackBar(message: string) {
    this.snackBar.open(message, 'OK', {
      duration: 3000,
    });
  }
}
