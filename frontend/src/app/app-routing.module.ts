import {NgModule} from '@angular/core';
import {Routes, RouterModule, Route} from '@angular/router';
import {ListComponent} from './list/list.component';
import {HomeComponent} from './home/home.component';


const routes: Routes = [
  {path: 'list', component: ListComponent},
  {path: 'home', component: HomeComponent},
  {path: '', redirectTo: 'home', pathMatch: 'prefix'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
