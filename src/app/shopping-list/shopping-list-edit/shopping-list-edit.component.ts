import { Component, OnInit, ViewChild } from '@angular/core';
import { Ingredient } from '../../shared/ingredients.model';
import { ShoppingListService } from '../shopping-list.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-list-edit',
  templateUrl: './shopping-list-edit.component.html',
  styleUrl: './shopping-list-edit.component.css'
})
export class ShoppingListEditComponent implements OnInit {
  @ViewChild('f') formRef! : NgForm;
  subscription! : Subscription;
  editingMode : boolean = false;
  editIndex! : number;
  editedItem! : Ingredient;
  constructor(private shoppingListService : ShoppingListService) {
  }

  ngOnInit() {
    this.subscription = this.shoppingListService.editIndex.subscribe((index) => {
      this.editingMode = true;
      this.editIndex = index;
      this.editedItem = this.shoppingListService.getIngredient(this.editIndex);
      this.formRef.setValue({
        name : this.editedItem.name,
        amount: this.editedItem.amount
      });
    })
  }

  onAddIngredient(form : NgForm) {
    const name = form.value.name;
    const amount = form.value.amount;
    if(this.editingMode) {
      this.shoppingListService.editIngredient(this.editIndex, new Ingredient(name, amount));
    }
    else {
      this.shoppingListService.addIngredient(new Ingredient(name, amount));
    }
    form.reset();
    this.editingMode = false;
  }

  onDeleteIngredient() {
    this.shoppingListService.deleteIngredient(this.editIndex);
    this.onClear();
  }

  onClear() {
    this.formRef.reset();
    this.editingMode = false;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
