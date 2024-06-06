import { NgModule } from "@angular/core";
import { AlertComponent } from "./alert/alert.component";
import { DropdownDirective } from "./dropdown.directive";
import { PlaceholderDirective } from "./placeholder.directive";
import { CommonModule } from "@angular/common";

@NgModule({
  declarations: [
    DropdownDirective,
    AlertComponent,
    PlaceholderDirective
  ],
  imports: [ CommonModule ],
  exports: [
    DropdownDirective,
    AlertComponent,
    PlaceholderDirective
  ]
})

export class SharedModule {

}