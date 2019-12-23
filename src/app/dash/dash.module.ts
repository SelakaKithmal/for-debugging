import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashRoutingModule } from './dash-routing.module';
import { HomeComponent } from './home/home.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IndexComponent } from './index/index.component';
import { VerifyphoneComponent } from './verifyphone/verifyphone.component';

@NgModule({
  entryComponents: [VerifyphoneComponent],
  declarations: [
    HomeComponent,
    IndexComponent,
    VerifyphoneComponent
  ],
  imports: [
    CommonModule,
    DashRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  providers: []
})
export class DashModule {}
