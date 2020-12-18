import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list.component';
import { Routes, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatSelectModule} from '@angular/material/select'
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';

const routes: Routes = [
  {
    path: '',
    component: ListComponent,
  }
]

@NgModule({
  declarations: [ListComponent],
  imports: [
    CommonModule,
    MatIconModule,
    MatInputModule,
    MatCardModule,
    MatSidenavModule,
    MatSelectModule,
    MatDividerModule,
    MatButtonModule,
    RouterModule.forChild(routes),
  ],
  exports:[RouterModule]
})
export class ListModule { }
