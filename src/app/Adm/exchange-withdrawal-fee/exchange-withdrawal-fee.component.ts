import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ExchangeService } from '../../core/services/exchange.service';
import { Exchange } from '../../core/models/Exchange';
import { Crypto } from '../../core/models/Crypto';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CryptoService } from '../../core/services/crypto.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-exchange-withdrawal-fee',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    FormsModule,
    CommonModule,
  ],
  templateUrl: './exchange-withdrawal-fee.component.html',
  styleUrl: './exchange-withdrawal-fee.component.css',
})
export class ExchangeWithdrawalFeeComponent implements OnInit {
  exchanges: Exchange[] = [];
  cryptos: Crypto[] = [];
  displayedColumns: string[] = ['logo', 'symbol', 'name'];
  dsCryptos: MatTableDataSource<Crypto> = new MatTableDataSource<Crypto>();
  @ViewChild('cryptosPaginator') cryptosPaginator: MatPaginator;

  constructor(
    private exchangeService: ExchangeService,
    private cryptoService: CryptoService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadExchanges();
    this.loadCryptos();
  }

  private loadExchanges() {
    this.exchangeService.getAll().subscribe(
      (exchanges) => {
        this.exchanges = exchanges;
      },
      (error) => {
        this.openSnackBar('Erro ao consultar as corretoras: ' + error);
      }
    );
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
