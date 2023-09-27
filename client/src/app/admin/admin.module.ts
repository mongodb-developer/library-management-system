import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: DashboardComponent, pathMatch: 'full' }
    ]),
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
  ],
})
export class AdminModule { }
