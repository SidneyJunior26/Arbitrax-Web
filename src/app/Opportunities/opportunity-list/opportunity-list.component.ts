import { OpportunityService } from './../../core/services/opportunity.service';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { OpportunityViewModel } from '../../core/ViewModels/OpportunityViewModel';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog } from '@angular/material/dialog';
import { OrderBookComponent } from '../order-book/order-book.component';
import { SecurityService } from '../../core/services/security.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatRadioModule } from '@angular/material/radio';
import { CryptoService } from '../../core/services/crypto.service';
import { Crypto } from '../../core/models/Crypto';
import { MatSelectModule } from '@angular/material/select';
import { WithdrawFeeComponent } from '../withdraw-fee/withdraw-fee.component';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ExchangeService } from '../../core/services/exchange.service';
import { Exchange } from '../../core/models/Exchange';
import { MatExpansionModule } from '@angular/material/expansion';
import { DolarService } from '../../core/services/dolar.service';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSliderModule } from '@angular/material/slider';

@Component({
  selector: 'app-opportunity-list',
  standalone: true,
  imports: [
    MatTableModule,
    LoadingComponent,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatTooltipModule,
    MatSortModule,
    MatSlideToggleModule,
    FormsModule,
    CommonModule,
    MatSelectModule,
    WithdrawFeeComponent,
    MatExpansionModule,
    MatCardModule,
    MatProgressBarModule,
    MatSliderModule,
    OrderBookComponent
  ],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  templateUrl: './opportunity-list.component.html',
  styleUrl: './opportunity-list.component.css',
})
export class OpportunityListComponent implements OnInit {
  constructor(
    private opportunityService: OpportunityService,
    private securityService: SecurityService,
    private cryptoService: CryptoService,
    private exchangeService: ExchangeService,
    private dolarService: DolarService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  checked = true;
  cardVision: boolean = false;
  isMobile = window.innerWidth < 1000;

  protected adm: boolean;

  cryptos: Crypto[] = [];
  exchangesToBuy: Exchange[] = [];
  exchangesToSell: Exchange[] = [];

  selectedCrypto: string | null = null;
  selectedExchangeToBuy: string[] | null = null;
  selectedExchangeToSell: string | null = null;

  filterValue: string = '';
  filteredCryptos: Crypto[] = [];
  filteredExchangeToBuy: Exchange[] = [];
  filteredExchangeToSell: Exchange[] = [];

  opportunities: OpportunityViewModel[] = [];
  dolars: any[] = [];
  dsOpportunities: MatTableDataSource<OpportunityViewModel> =
    new MatTableDataSource<OpportunityViewModel>();
  displayedColumns: string[] = [
    'symbol',
    'date',
    'valueToBuy',
    'valueToSell',
    //'fee',
    'differencePercentage',
    'totalCanNegociate',
    'totalProfit',
    'withdrawFee',
    'liquidValue',
    'exchangeToBuy',
    'exchangeToSell',
    //'showWithdrawFee',
    //'showOrderBook',
    //'approve',
    'orderBooks'
  ];
  columnsToRemove = ['date', 'totalCanNegociate', 'withdrawFee', 'totalProfit', 'liquidValue'];
  columnOrderBooks = ['orderBooks'];
  expandedElement: OpportunityViewModel | null;

  @ViewChild('opportunitiesPaginator') opportunitiesPaginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  loadingOpportunities: boolean = false;
  noneOpportunity: boolean = false;

  dolar: number = 0;
  date: Date = new Date();
  private intervalOpportunities: any;
  private intervalDolar: any;
  private secondCounterId: any;
  segundosRestantes = 0; // começa em 10
  readonly intervalo = 10;

  ngOnInit(): void {
    this.loadOpportunities();
    this.loadDolars();
    this.loadCryptos();
    this.loadExchanges();
    this.isAdm();

    this.secondCounterId = setInterval(() => {
      this.segundosRestantes += 10;

      // quando chegar em 0, reseta
      if (this.segundosRestantes == 100) {
        this.segundosRestantes = 0;
      }
    }, 1000);

    this.intervalOpportunities = setInterval(() => {
      this.loadOpportunities();
    }, 10000);

    this.intervalDolar = setInterval(() => {
      this.loadDolars();
    }, 300000);
  }

  ngAfterViewInit() {
    this.dsOpportunities.paginator = this.opportunitiesPaginator;
    this.dsOpportunities.sort = this.sort;
  }

  ngOnDestroy(): void {
    if (this.intervalOpportunities) {
      clearInterval(this.intervalOpportunities);
    }

    if (this.intervalDolar) {
      clearInterval(this.intervalDolar);
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isMobile = window.innerWidth < 1000;
  }

  protected showWithdrawFee(
    exchangeToBuyId: string,
    exchangeToSellId: string,
    cryptoId: string,
    value: number
  ) {
    this.dialog.open(WithdrawFeeComponent, {
      width: '100%',
      maxWidth: '40vw',
      data: {
        exchangeToBuyId: exchangeToBuyId,
        exchangeToSellId: exchangeToSellId,
        cryptoId: cryptoId,
        value: value
      },
    });
  }

  protected showOrderBooks(
    cryptoSymbol: string,
    cryptoId: string,
    name: string,
    exchangeToBuyId: string,
    exchangeToBuyName: string,
    exchangeToSellId: string,
    exchangeToSellName: string,
    spread: number,
    valueToSell: number
  ) {
    this.dialog.open(OrderBookComponent, {
      maxWidth: '50vw', // Maximum width of the viewport
      maxHeight: '90vh', // Maximum height of the viewport
      // height: '90%',    // Fill the available height
      // width: '70%',
      data: {
        symbol: cryptoSymbol,
        cryptoId: cryptoId,
        name: name,
        exchangeToBuyId: exchangeToBuyId,
        exchangeToBuyName: exchangeToBuyName,
        exchangeToSellId: exchangeToSellId,
        exchangeToSellName: exchangeToSellName,
        spread: spread,
        valueToSell: valueToSell,
        dolar: this.dolar,
      },
    });
  }

  protected loadOpportunities() {
    this.loadingOpportunities = true;

    this.opportunityService.getAll(this.selectedCrypto, this.selectedExchangeToBuy, this.selectedExchangeToSell, false).subscribe(
      (opportunities) => {
        this.date = new Date();
        this.opportunities = opportunities.opportunities;
        this.dsOpportunities = new MatTableDataSource(this.opportunities);
        this.dsOpportunities.paginator = this.opportunitiesPaginator;
        this.dsOpportunities.sort = this.sort;

        this.dolar = opportunities.dolar;

        this.loadingOpportunities = false;
        this.noneOpportunity = false;

        this.segundosRestantes = 0;
      },
      (e) => {
        this.noneOpportunity = true;
        this.loadingOpportunities = false;

        this.opportunities = [];
        this.dsOpportunities = new MatTableDataSource(this.opportunities);

        if (e.status == 401) {
          this.securityService.logOutToken();
        } else this.openSnackBar(e.error.userMessage);
      }
    );
  }

  private loadDolars() {
    this.dolarService.getAverageDolars()
      .subscribe((dolars) => {
        this.dolars = [...dolars, ...dolars];
      });
  }

  private loadCryptos() {
    this.cryptoService.getAllSymbols().subscribe(
      (cryptos) => {
        this.cryptos = cryptos;
        this.filteredCryptos = this.cryptos;
      },
      (error) => {
        this.openSnackBar('Erro ao consultar as criptomoedas: ' + error);
      }
    );
  }

  private loadExchanges() {
    this.exchangeService.getAllNames().subscribe(
      (exchanges) => {
        this.exchangesToBuy = exchanges;
        this.exchangesToSell = exchanges;

        this.filteredExchangeToBuy = this.exchangesToBuy;
        this.filteredExchangeToSell = this.exchangesToSell;
      },
      (error) => {
        this.openSnackBar('Erro ao consultar as criptomoedas: ' + error);
      }
    );
  }

  approveOperation(opportunityId: string) {
    this.opportunityService.approve(opportunityId).subscribe(() => {
      this.loadOpportunities();
      this.openSnackBar('Operação aprovada com sucesso!');
    }, (e) => {
      console.log(e);
    });
  }

  activateQuery(): void {
    if (!this.intervalOpportunities) {
      this.loadOpportunities();

      this.checked = true;

      this.intervalOpportunities = setInterval(() => {
        this.loadOpportunities();
      }, 10000);
    }
  }

  private isAdm() {
    var token = this.securityService.getToken();

    if (token != '') {
      var userInfo = this.securityService.getDecodedAccessToken(token);

      this.adm = userInfo.adm != undefined ? true : false;

      if (!this.adm) {
        this.displayedColumns = this.displayedColumns.filter(
          column => !this.columnsToRemove.includes(column)
        );
      }
    }
    else {
      this.adm = false;

      this.displayedColumns = this.displayedColumns.filter(
        column => !this.columnsToRemove.includes(column)
      );
    }
  }

  disableQuery(): void {
    if (this.intervalOpportunities) {
      this.checked = false;

      clearInterval(this.intervalOpportunities);
      this.intervalOpportunities = null;
    }
  }

  clearCryptos() {
    this.selectedCrypto = null;
    this.loadOpportunities();
  }

  clearExchangeToBuy() {
    this.selectedExchangeToBuy = null;
    this.loadOpportunities();
  }

  clearExchangeToSell() {
    this.selectedExchangeToSell = null;
    this.loadOpportunities();
  }

  private openSnackBar(message: string) {
    this.snackBar.open(message, 'OK', {
      duration: 3000,
    });
  }

  isExpansionDetailRow = (i: number, row: Object) =>
    row.hasOwnProperty('detailRow');
}
