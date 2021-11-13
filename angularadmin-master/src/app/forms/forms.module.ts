
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsRoutingModule } from './forms-routing/forms-routing.module';
import { FormsComponent } from './forms.component';
import { MatTableModule } from '@angular/material/table';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import { RecommedationComponent } from './recommedation/recommedation.component';


@NgModule({
  imports: [
    FormsRoutingModule,ReactiveFormsModule, CommonModule, MatTableModule,MatListModule,MatSidenavModule
  ],
  declarations: [ FormsComponent,RecommedationComponent ],
  providers: []
})
export class FormsModule { }
