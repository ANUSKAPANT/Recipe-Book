import { NgModule } from "@angular/core";
import { ShoppingListEditComponent } from "./shopping-list-edit/shopping-list-edit.component";
import { ShoppingListComponent } from "./shopping-list.component";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Route, RouterModule } from "@angular/router";
import { AuthGuard } from "../auth/auth.guard";

const routes : Route[] = [
  {path: "", component: ShoppingListComponent, canActivate: [AuthGuard]},
];

@NgModule ({
  declarations: [
    ShoppingListComponent,
    ShoppingListEditComponent,
  ],
  imports: [CommonModule, FormsModule, RouterModule.forChild(routes)],
})

export class ShoppingListModule {

}