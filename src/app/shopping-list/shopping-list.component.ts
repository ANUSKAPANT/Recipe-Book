import { Component, OnInit, OnDestroy } from '@angular/core';
import { Ingredient } from '../shared/ingredients.model';
import { ShoppingListService } from './shopping-list.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrl: './shopping-list.component.css'
})
export class ShoppingListComponent implements OnInit, OnDestroy{
  ingredients : Ingredient[] = [];
  private ingredientsChangedSubs! : Subscription;
  
  constructor(private shoppingListService : ShoppingListService) {}

  ngOnInit() {
    this.ingredients = this.shoppingListService.getIngredients();
    this.ingredientsChangedSubs = this.shoppingListService.ingredientsChanged.subscribe((ingredients : Ingredient[]) =>
    this.ingredients =  ingredients);
  }
  
  onEditShoppingList(index : number) {
    this.shoppingListService.editIndex.next(index);
  }

  ngOnDestroy(): void {
    this.ingredientsChangedSubs.unsubscribe();
  }


  // deleteIngredient(ingredientName : string) {

  // }
}
