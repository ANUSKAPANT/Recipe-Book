import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Route, RouterModule } from "@angular/router";
import { SharedModule } from "../shared/shared.module";
import { AuthComponent } from "./auth.component";
import { CommonModule } from "@angular/common";

const routes : Route[] = [
  {path: "", component: AuthComponent},
];

@NgModule ({
  declarations: [
    AuthComponent,
  ],
  imports: [SharedModule, CommonModule, FormsModule, RouterModule.forChild(routes)],
})

export class AuthModule {

}