import { NgModule } from "@angular/core";
import { Routes, RouterModule, Route } from "@angular/router";
import { ListComponent } from "./pages/list/list.component";
import { HomeComponent } from "./pages/home/home.component";
import { AuthGuard } from "@auth0/auth0-angular";

const routes: Routes = [
  {
    path: "list",
    loadChildren: () =>
      import("./pages/list/list.module").then((m) => m.ListModule),
    canActivate: [AuthGuard]
  },
  {
    path: "home",
    loadChildren: () =>
      import("./pages/home/home.module").then((m) => m.HomeModule),
  },
  { path: "", redirectTo: "home", pathMatch: "prefix" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
