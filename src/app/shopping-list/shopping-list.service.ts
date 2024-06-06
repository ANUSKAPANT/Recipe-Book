import { Ingredient } from "../shared/ingredients.model";
import { Subject } from "rxjs";

export class ShoppingListService {
  ingredientsChanged = new Subject<Ingredient[]>();
  editIndex = new Subject<number>();

  private ingredients : Ingredient[] = [
    new Ingredient('spinach', 2),
    new Ingredient('tomato', 3)
  ];

  getIngredients() : Ingredient[] {
    return this.ingredients.slice();
  }

  getIngredient(index : number) : Ingredient {
    return this.ingredients[index];
  }

  addIngredient(ingredient : Ingredient) {
    this.ingredients.push(ingredient);
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  addIngredients(ingredients : Ingredient[]) {
    this.ingredients.push(...ingredients);
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  editIngredient(index : number, value : Ingredient) {
    this.ingredients[index] = value;
    this.ingredientsChanged.next(this.ingredients.slice());
  } 

  deleteIngredient(index : number) {
    this.ingredients.splice(index, 1);
    this.ingredientsChanged.next(this.ingredients.slice());
  }
}