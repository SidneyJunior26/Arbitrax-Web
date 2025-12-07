import { Component, OnInit, ViewChild } from '@angular/core';
import { OpportunityService } from '../../core/services/opportunity.service';
import { SecurityService } from '../../core/services/security.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CryptosAnalyticsViewModel, OpportunityViewModel, PotencialEarningCrypto, PotentialEarnings as PotencialEarnings } from '../../core/ViewModels/OpportunityViewModel';
import { Crypto } from '../../core/models/Crypto';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { LoadingComponent } from "../../shared/loading/loading.component";
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { OrderBookComponent } from '../../Opportunities/order-book/order-book.component';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { CryptoService } from '../../core/services/crypto.service';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-analytics',
  standalone: true,
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'fr' },
    provideNativeDateAdapter()],
  imports: [
    NgxChartsModule,
    LoadingComponent,
    MatDatepickerModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    CommonModule,
    MatCardModule,
    MatSelectModule,
    MatTabsModule,
    MatSortModule,
    MatInputModule
  ],
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.css'
})
export class AnalyticsComponent implements OnInit {
  constructor(
    private opportunityService: OpportunityService,
    private securityService: SecurityService,
    private cryptoService: CryptoService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  range = new FormGroup({
    start: new FormControl<Date>(new Date()),
    end: new FormControl<Date>(new Date()),
  });

  private intervalId: any;

  viewCryptos: [number, number] = [800, 300];
  viewExchanges: [number, number] = [1000, 300];

  loadingOpportunities: boolean = true;
  noneOpportunity: boolean = true;

  selectedCrypto: string | null = null;
  opportunities: OpportunityViewModel[] = [];
  cryptos: Crypto[] = [];
  cryptosAnalytics: CryptosAnalyticsViewModel[] = [];
  exchangesToBuyAnalytics: CryptosAnalyticsViewModel[] = [];
  exchangesToSellAnalytics: CryptosAnalyticsViewModel[] = [];
  cryptosValuesViewModels: CryptosAnalyticsViewModel[] = [];

  dsOpportunities: MatTableDataSource<OpportunityViewModel> =
    new MatTableDataSource<OpportunityViewModel>();

  displayedColumns: string[] = [
    'position',
    'symbol',
    'date',
    'valueToBuy',
    'valueToSell',
    'fee',
    'differencePercentage',
    'totalCanNegociate',
    'totalProfit',
    'withdrawFee',
    'exchangeToBuy',
    'exchangeToSell',
  ];

  displayedColumnsPotencials: string[] = [
    'position',
    'symbol',
    'count',
    'totalNegotiated',
    'totalPotencialPercentagem',
    'potencialValues',
    'averageTime',
  ];

  @ViewChild('opportunitiesPaginator') opportunitiesPaginator: MatPaginator;
  @ViewChild('opportunitiesEarningsPaginator') opportunitiesEarningsPaginator: MatPaginator;

  @ViewChild(MatSort) sort: MatSort;

  pieChartCryptos: any[];
  pieChartsExchangesToBuy: any[];
  pieChartsExchangesToSell: any[];
  pieChartsValues: any[];

  maxNegotiationValue: number = 0;

  ngOnInit(): void {
    this.loadAll();
    this.loadCryptos();
  }

  ngAfterViewInit() {
    this.dsOpportunities.paginator = this.opportunitiesPaginator;
  }

  loadAll() {
    this.loadOpportunities();
  }

  protected loadOpportunities() {
    this.loadingOpportunities = true;

    this.opportunityService.getAllHistorical(this.range.value['start']!, this.range.value['end']!, this.selectedCrypto, this.maxNegotiationValue).subscribe(
      (opportunities) => {
        this.opportunities = opportunities.opportunities;
        this.cryptosAnalytics = opportunities.cryptosAnalytics;
        this.exchangesToBuyAnalytics = opportunities.exchangesToBuyAnalytics;
        this.exchangesToSellAnalytics = opportunities.exchangesToSellAnalytics;
        this.cryptosValuesViewModels = opportunities.cryptosValuesViewModels;

        this.dsOpportunities = new MatTableDataSource(this.opportunities);
        this.dsOpportunities.paginator = this.opportunitiesPaginator;

        this.noneOpportunity = false;

        this.pieChartCryptos = this.cryptosAnalytics;
        this.pieChartsValues = this.cryptosValuesViewModels;
        this.pieChartsExchangesToBuy = this.exchangesToBuyAnalytics;
        this.pieChartsExchangesToSell = this.exchangesToSellAnalytics;

        this.loadingOpportunities = false;
      },
      (e) => {
        this.noneOpportunity = true;
        this.loadingOpportunities = false;

        if (e.status == 401) {
          this.securityService.logOutToken();
        } else this.openSnackBar(e.error.userMessage);
      }
    );
  }

  private loadCryptos() {
    this.cryptoService.getAll().subscribe(
      (cryptos) => {
        this.cryptos = cryptos;
      },
      (error) => {
        this.openSnackBar('Erro ao consultar as criptomoedas: ' + error);
      }
    );
  }

  protected showOrderBooks(
    cryptoSymbol: string,
    cryptoId: string,
    name: string,
    exchangeToBuyId: string,
    exchangeToBuyName: string,
    exchangeToSellId: string,
    exchangeToSellName: string,
    spread: number
  ) {
    this.dialog.open(OrderBookComponent, {
      data: {
        symbol: cryptoSymbol,
        cryptoId: cryptoId,
        name: name,
        exchangeToBuyId: exchangeToBuyId,
        exchangeToBuyName: exchangeToBuyName,
        exchangeToSellId: exchangeToSellId,
        exchangeToSellName: exchangeToSellName,
        spread: spread
      },
    });
  }

  private openSnackBar(message: string) {
    this.snackBar.open(message, 'OK', {
      duration: 3000,
    });
  }

  formatValue(value: number): string {
    return value.toFixed(2);
  }

  formatValueToBRL(value: number): string {
    return `R$ ${value.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}`;
  }
}
