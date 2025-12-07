import { Component, inject, Inject, Input, OnInit } from '@angular/core';
import { WithdrawFee } from '../../core/models/WithdrawFee';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialogRef } from '@angular/material/dialog';
import { WithdrawFeeService } from '../../core/services/withdraw-fee.service';
import { SecurityService } from '../../core/services/security.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { LoadingComponent } from "../../shared/loading/loading.component";

export interface DialogData {
  cryptoId: string;
  exchangeToBuyId: string;
  exchangeToSellId: string;
  value: number;
}

@Component({
  selector: 'app-withdraw-fee',
  standalone: true,
  imports: [MatTableModule, MatTabsModule, CommonModule, MatIconModule, LoadingComponent],
  templateUrl: './withdraw-fee.component.html',
  styleUrl: './withdraw-fee.component.css'
})
export class WithdrawFeeComponent implements OnInit {
  @Input() data!: DialogData;

  withdrawFees: WithdrawFee[] = [];
  commonNetworkCodes: number = 0;

  dsWithdrawFees: MatTableDataSource<WithdrawFee> =
    new MatTableDataSource<WithdrawFee>();
  displayedColumns: string[] = ['exchange', 'network', 'fee', 'feeValue', 'minWithdraw', 'maxWithdraw', 'depositEnable', 'tradingEnable', 'withdrawEnable'];

  //readonly dialogRef = inject(MatDialogRef<WithdrawFeeComponent>);

  constructor(private withdrawFeeService: WithdrawFeeService,
    private securityService: SecurityService,
    private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.loadWithdrawFees();
  }

  private loadWithdrawFees() {
    this.withdrawFeeService.getAll(
      this.data.exchangeToBuyId,
      this.data.exchangeToSellId,
      this.data.cryptoId
    ).subscribe(
      (withdrawFees) => {
        this.withdrawFees = withdrawFees;

        if (this.withdrawFees.length == 0) {
          this.openSnackBar('Nenhuma taxa de saque disponível');
        }

        this.dsWithdrawFees = new MatTableDataSource(this.withdrawFees);

        const buyExchangeFees = this.withdrawFees.filter(fee => fee.exchange?.id === this.data.exchangeToBuyId);
        const sellExchangeFees = this.withdrawFees.filter(fee => fee.exchange?.id === this.data.exchangeToSellId);

        this.commonNetworkCodes = buyExchangeFees
          .map(fee => fee.networkCode)
          .filter(code => sellExchangeFees.some(f => f.networkCode === code)).length;
      },
      (error) => {
        if (error.status === 401) this.securityService.logOutToken();
        else if (error.status === 404) {
          this.openSnackBar('Nenhuma taxa de saque disponível');
        }
      }
    );
  }

  private openSnackBar(message: string) {
    this.snackBar.open(message, 'OK', {
      duration: 3000,
    });
  }
}
