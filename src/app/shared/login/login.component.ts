import { Component, OnInit, signal } from '@angular/core';
import { SecurityService } from '../../core/services/security.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginInputModel } from '../../core/InputModels/loginIinputModel';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FormsModule, MatIconModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  hide = signal(true);

  constructor(
    private securityService: SecurityService,
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  protected loggingIn: boolean = false;

  loginControl = this.formBuilder.group({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  });

  ngOnInit(): void {
  }

  protected login() {
    const login: LoginInputModel = {
      email: this.loginControl.get('email')!.value!.toString(),
      password: this.loginControl.get('password')!.value!.toString(),
    };

    this.loggingIn = true;

    this.securityService.login(login).subscribe(
      (token) => {
        localStorage.setItem('arbitraxUser', JSON.stringify(token));

        this.loggingIn = false;

        this.router.navigateByUrl('');

        window.location.reload();
      },
      (error) => {
        if (error.status == 404) {
          this.openSnackBar('Usuário não encontrado');
        } else
          if (error.status == 401) {
            this.openSnackBar('Senha inválida');
          } else {
            this.openSnackBar('Ocorreu um erro ao realizar login na plataforma. Tente novamente mais tarde');
          }

        this.loggingIn = false;
      }
    );
  }

  public openSnackBar(message: string) {
    this.snackBar.open(message, 'OK', {
      duration: 3000,
    });
  }

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
}
