import { OpportunityConfigService } from '../../core/services/adm-config.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AdmConfig } from '../../core/models/AdmConfig';
import { LoadingComponent } from '../../shared/loading/loading.component';

@Component({
  selector: 'app-config-adm',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatTooltipModule,
    LoadingComponent,
  ],
  templateUrl: './config-opportunity.component.html',
  styleUrl: './config-opportunity.component.css',
})
export class ConfigOpportunityComponent implements OnInit {
  constructor(
    private admConfigService: OpportunityConfigService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar
  ) { }

  configurationsControl = this.formBuilder.group({
    minSpread: new FormControl(2, [Validators.required, Validators.min(2)]),
    maxSpread: new FormControl(2, [Validators.required, Validators.min(2)]),
    minTrading: new FormControl(2, [Validators.required, Validators.min(2)]),
  });

  admConfig: AdmConfig;

  loadingConfig: boolean = false;

  ngOnInit(): void {
    this.loadConfig();
  }

  private loadConfig() {
    this.loadingConfig = true;

    this.admConfigService.get().subscribe(
      (config) => {
        this.admConfig = config;
        this.loadFormControl();

        this.loadingConfig = false;
      },
      (error) => {
        this.loadingConfig = false;

        this.openSnackBar('Erro ao consultar configurações: ' + error);
      }
    );
  }

  private loadFormControl() {
    this.configurationsControl
      .get('minSpread')
      ?.setValue(this.admConfig.minSpread);
  }

  private openSnackBar(message: string) {
    this.snackBar.open(message, 'OK', {
      duration: 3000,
    });
  }
}
