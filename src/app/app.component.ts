import { Component, signal, OnInit, LOCALE_ID, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ToolbarComponent } from './shared/toolbar/toolbar.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { SecurityService } from './core/services/security.service';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule, registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { MatToolbarModule } from '@angular/material/toolbar';
import { WhoWeAreComponent } from "./shared/who-we-are/who-we-are.component";
import { LoginComponent } from "./shared/login/login.component";
import { MatDialog } from '@angular/material/dialog';
import {MatMenuModule} from '@angular/material/menu';

registerLocaleData(localePt, 'pt-BR');

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    ToolbarComponent,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatTooltipModule,
    MatExpansionModule,
    MatSnackBarModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatToolbarModule,
    MatMenuModule,
    WhoWeAreComponent,
    LoginComponent,
    RouterModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [{ provide: LOCALE_ID, useValue: 'pt-BR' }],
})
export class AppComponent implements OnInit {

  constructor(
    private securityService: SecurityService,
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  readonly dialog = inject(MatDialog);

  ngOnInit(): void {
    this.checkLogIn();
  }

  readonly panelOpenState = signal(false);

  userIsLoggedIn: boolean = false;
  protected userName: string;
  protected adm: boolean;

  protected loggingIn: boolean = false;

  loginControl = this.formBuilder.group({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  });

  private checkLogIn() {
    var token = this.securityService.getToken();

    if (token != null) {
      var userInfo = this.securityService.getDecodedAccessToken(token);

      if (userInfo == null) {
        this.userIsLoggedIn = false;
        return;
      }

      this.userName = userInfo.name;
      console.log(this.userName);
      this.userIsLoggedIn = true;

      this.adm = userInfo.adm != undefined ? true : false;
    } else {
      this.logOut();
    }

    this.userIsLoggedIn = token != null;
  }

  login() {
    const dialogRef = this.dialog.open(LoginComponent, {
      maxHeight: '100vh'
    });
  }

  protected logOut() {
    localStorage.removeItem('arbitraxUser');

    window.location.reload();
  }

  public openSnackBar(message: string) {
    this.snackBar.open(message, 'OK', {
      duration: 3000,
    });
  }
}
