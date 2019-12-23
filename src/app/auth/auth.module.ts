import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { SharedModule } from '../shared/shared.module';
import { VerifyphoneComponent } from './verifyphone/verifyphone.component';

@NgModule({
  entryComponents: [VerifyphoneComponent],
  declarations: [LoginComponent, RegisterComponent, VerifyphoneComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AuthRoutingModule,
    SharedModule
  ],
  providers: []
})
export class AuthModule {}
