import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-security',
  standalone: true,
  imports: [MatInputModule, FormsModule, ReactiveFormsModule, MatButtonModule, MatFormFieldModule],
  templateUrl: './security.component.html',
  styleUrl: './security.component.css'
})
export class SecurityComponent {

  constructor(private formBuilder: FormBuilder) {
  }
  newPasswordUserControl = this.formBuilder.group({
    actualPassword: new FormControl('', Validators.required),
    newPassword: new FormControl('', [Validators.required, Validators.email]),
    confirmPassword: new FormControl('', Validators.required),
  });

}
