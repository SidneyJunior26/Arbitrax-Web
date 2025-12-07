import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { OperationViewModel } from '../../core/ViewModels/OperationViewModel';
import { OperationService } from '../../core/services/operation.service';
import { CommonModule, formatDate } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { OpportunityService } from '../../core/services/opportunity.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-operations-list',
  standalone: true,
  imports: [MatTableModule,
    LoadingComponent,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    CommonModule,
    MatSelectModule,
    FormsModule],
  templateUrl: './operations-list.component.html',
  styleUrl: './operations-list.component.css'
})
export class OperationsListComponent implements OnInit {

  constructor(private operationService: OperationService, private opportunityService: OpportunityService,
    private snackBar: MatSnackBar
  ) { }

  loadingOperations: boolean = false;
  operations: OperationViewModel[] = [];
  dsOperations: MatTableDataSource<OperationViewModel> =
    new MatTableDataSource<OperationViewModel>();
  displayedColumns: string[] = [
    'symbol',
    'buy',
    'sell',
    'lowerValue',
    'highestValue',
    'profit',
    'operationStatus',
    'preApproved',
    'cancel'
  ];

  selectedStatus: string = '1';

  private intervalId: any;

  ngOnInit(): void {
    this.loadOperations();

    this.intervalId = setInterval(() => {
      this.loadOperations();
    }, 10000);
  }

  protected loadOperations() {
    this.loadingOperations = true;

    this.operationService.getAll(formatDate(new Date(), 'yyyy-MM-dd', 'en'), formatDate(new Date(), 'yyyy-MM-dd', 'en'), this.selectedStatus).subscribe(
      (operations) => {
        this.loadingOperations = false;
        this.operations = operations;
        this.dsOperations = new MatTableDataSource(this.operations);
      },
      (e) => {
        this.operations = [];
        this.dsOperations = new MatTableDataSource(this.operations);
      }
    );
  }

  approveOperation(opportunityId: string) {
    this.opportunityService.approve(opportunityId).subscribe(() => {
      this.loadOperations();
      this.openSnackBar('Operação aprovada com sucesso');
    }, (e) => {
      this.openSnackBar('Erro ao aprovar operação');
      console.log(e);
    });
  }

  cancelOperation(opportunityId: string) {
    this.opportunityService.cancel(opportunityId).subscribe(() => {
      this.operationService.cancel(opportunityId).subscribe(() => {
        this.loadOperations();
        this.openSnackBar('Operação cancelada com sucesso');
      }, (e) => {
        this.openSnackBar('Erro ao cancelar operação 1');
        console.log(e);
      });
    }, (e) => {
      this.openSnackBar('Erro ao cancelar operação 2');
      console.log(e);
    });
  }

  private openSnackBar(message: string) {
    this.snackBar.open(message, 'OK', {
      duration: 3000,
    });
  }

}
