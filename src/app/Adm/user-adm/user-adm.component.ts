import { LoadingComponent } from './../../shared/loading/loading.component';
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { UserService } from '../../core/services/user.service';
import { User } from '../../core/models/User';
import {
  NewUserInputModel,
  UpdateUserInputModel,
} from '../../core/InputModels/userInputModel';
import { ConfirmationMessageComponent } from '../../shared/confirmation-message/confirmation-message.component';
import { Level } from '../../core/enums/Level';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-user-adm',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatSlideToggleModule,
    LoadingComponent,
  ],
  templateUrl: './user-adm.component.html',
  styleUrl: './user-adm.component.css',
})
export class UserAdmComponent implements OnInit {
  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  public Level = Level;

  users: User[] = [];
  displayedColumns: string[] = [
    'name',
    'email',
    'level',
    'trial',
    'trialExpiration',
    'edit',
    'delete',
  ];
  dsUsers: MatTableDataSource<User> = new MatTableDataSource<User>();

  newUserControl = this.formBuilder.group({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    level: new FormControl(Level.SILVER, Validators.required),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
    ]),
    trial: new FormControl(true, Validators.required),
  });

  editUserControl = this.formBuilder.group({
    id: new FormControl('', Validators.required),
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    level: new FormControl(Level.SILVER, Validators.required),
    trial: new FormControl(true, Validators.required),
  });

  @ViewChild('usersPaginator') usersPaginator: MatPaginator;

  creating: boolean = false;
  updating: boolean = false;

  ngOnInit(): void {
    this.loadUsers();
  }

  ngAfterViewInit() {
    this.dsUsers.paginator = this.usersPaginator;
  }

  private loadUsers() {
    this.userService.getAll().subscribe(
      (users) => {
        this.users = users;
        this.dsUsers = new MatTableDataSource(users);
        this.dsUsers.paginator = this.usersPaginator;
      },
      (error) => {
        this.openSnackBar('Erro ao consultar os usuários: ' + error);
      }
    );
  }

  protected createUser() {
    const newUser: NewUserInputModel = {
      name: this.newUserControl.get('name')!.value!.toString(),
      email: this.newUserControl.get('email')!.value!.toString(),
      password: this.newUserControl.get('password')!.value!.toString(),
      level: this.newUserControl.get('level')!.value as Level,
      trial: this.newUserControl.get('trial')!.value!,
    };

    this.creating = true;
    this.userService.post(newUser).subscribe(
      () => {
        this.creating = false;

        this.loadUsers();
        this.openSnackBar('Usuário cadastrado com sucesso');

        this.newUserControl.get('name')!.setValue('');
        this.newUserControl.get('email')!.setValue('');
        this.newUserControl.get('password')!.setValue('');
        this.newUserControl.get('trial')!.setValue(true);
      },
      (e) => {
        this.creating = false;
        if (e.error.userMessage != undefined)
          this.openSnackBar(e.error.userMessage);
        else this.openSnackBar('Erro ao cadastrar usuário');
      }
    );
  }

  protected loadFormEditUser(user: User) {
    this.editUserControl.get('id')?.setValue(user.id);
    this.editUserControl.get('name')?.setValue(user.name);
    this.editUserControl.get('email')?.setValue(user.email);
    this.editUserControl.get('level')?.setValue(user.level);
    this.editUserControl.get('trial')?.setValue(user.trial);
  }

  protected updateUser() {
    const id = this.editUserControl.get('id')!.value!.toString();

    const user: UpdateUserInputModel = {
      name: this.editUserControl.get('name')!.value!.toString(),
      email: this.editUserControl.get('email')!.value!.toString(),
      level: this.editUserControl.get('level')!.value as Level,
      trial: this.editUserControl.get('trial')!.value!,
    };

    this.updating = true;
    this.userService.put(id, user).subscribe(
      () => {
        this.updating = false;

        this.openSnackBar('Usuário atualizado com sucesso');
        this.loadUsers();

        this.cancelEdit();
      },
      (e) => {
        this.updating = false;

        if (e.error.userMessage != undefined)
          this.openSnackBar(e.error.userMessage);
        else this.openSnackBar('Erro ao atualizar usuário');
      }
    );
  }

  protected updateStatusUser(id: string) {
    this.userService.putStatus(id).subscribe(
      () => {
        this.openSnackBar('Status atualizado com sucesso');
        this.loadUsers();
      },
      () => this.openSnackBar('Erro ao atualizar status')
    );
  }

  protected cancelEdit() {
    this.editUserControl.get('id')!.setValue('');
    this.editUserControl.get('email')!.setValue('');
    this.editUserControl.get('trial')!.setValue(true);
  }

  protected deleteUser(user: User) {
    this.dialog
      .open(ConfirmationMessageComponent, {
        data: {
          title: 'Excluir Usuário',
          message: 'Gostaria de excluir "' + user.name + '"?',
        },
      })
      .afterClosed()
      .subscribe((confirma) => {
        if (confirma)
          this.userService.delete(user.id).subscribe(
            () => {
              this.openSnackBar('Usuário removido');
              this.loadUsers();
            },
            () => {
              this.openSnackBar('Ocorreu um erro ao deletar a usuário');
            }
          );
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dsUsers.filter = filterValue.trim().toLowerCase();
  }

  private openSnackBar(message: string) {
    this.snackBar.open(message, 'OK', {
      duration: 3000,
    });
  }
}
