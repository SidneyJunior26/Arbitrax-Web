import { Component, inject, Inject, Input, LOCALE_ID, OnInit } from '@angular/core';
import { OrderBook } from '../../core/models/OrderBook';
import { OrderBookService } from '../../core/services/order-book.service';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Side } from '../../core/enums/Side';
import { CommonModule, registerLocaleData } from '@angular/common';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { SecurityService } from '../../core/services/security.service';
import localePt from '@angular/common/locales/pt';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { WithdrawFeeComponent } from '../withdraw-fee/withdraw-fee.component';

registerLocaleData(localePt, 'pt-BR');

export interface DialogData {
  symbol: string;
  cryptoId: string;
  name: string;
  exchangeToBuyId: string;
  exchangeToBuyName: string;
  exchangeToSellId: string;
  exchangeToSellName: string;
  spread: number;
  valueToSell: number;
  dolar: number;
}

@Component({
  selector: 'app-order-book',
  standalone: true,
  imports: [
    MatTabsModule,
    MatTableModule,
    MatIconModule,
    MatTooltipModule,
    CommonModule,
    LoadingComponent,
    WithdrawFeeComponent
  ],
  templateUrl: './order-book.component.html',
  styleUrl: './order-book.component.css',
  providers: [{ provide: LOCALE_ID, useValue: 'pt-BR' }],
})
export class OrderBookComponent implements OnInit {

  orderBooksToBuy: OrderBook[] = [];
  orderBooksToSell: OrderBook[] = [];
  dsOrderBooksToBuy: MatTableDataSource<OrderBook> =
    new MatTableDataSource<OrderBook>();
  dsOrderBooksToSell: MatTableDataSource<OrderBook> =
    new MatTableDataSource<OrderBook>();
  displayedColumns: string[] = ['price', 'quantity', 'total', 'totalAmount'];

  selectedTabIndex = 0;

  protected adm: boolean = false;

  constructor(
    private orderBookService: OrderBookService,
    private securityService: SecurityService,
  @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  ngOnInit(): void {    
    this.loadOrderBooks();
  }

  private readonly dialogRef = inject(MatDialogRef);
  private isFullScreen = false;

  private loadOrderBooks() {
    this.orderBookService
      .getAll(this.data.cryptoId, this.data.exchangeToBuyId, this.data.exchangeToSellId)
      .subscribe(
        (orderbook) => {
          this.orderBooksToBuy = orderbook.filter(
            (ob) => ob.side === Side.SELL
          );

          this.orderBooksToSell = orderbook.filter(
            (ob) => ob.side === Side.BUY
          );

          this.dsOrderBooksToBuy = new MatTableDataSource(this.orderBooksToBuy);
          this.dsOrderBooksToSell = new MatTableDataSource(
            this.orderBooksToSell
          );
        },
        (error) => {
          if (error.status == 401) this.securityService.logOutToken();
        }
      );
  }

  onTabChange(event: MatTabChangeEvent) {
    this.selectedTabIndex = event.index;
  }

  private checkLogIn() {
    var token = this.securityService.getToken();

    if (token != null) {
      var userInfo = this.securityService.getDecodedAccessToken(token);

      if (userInfo == null) {
        this.adm = false;
        return;
      }

      this.adm = userInfo.adm != undefined ? true : false;
    } else {
      this.adm = false;
    }
  }
}
