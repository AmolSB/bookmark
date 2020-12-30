import { NgModule } from "@angular/core";
import { Routes, RouterModule, Route } from "@angular/router";
import { ListComponent } from "./pages/list/list.component";
import { HomeComponent } from "./pages/home/home.component";

const routes: Routes = [
  {
    path: "list",
    component: ListComponent,
  },
  {
    path: "home",
    component: HomeComponent,
  },
  { path: "", component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
