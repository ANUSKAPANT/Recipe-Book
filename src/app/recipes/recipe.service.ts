import { Injectable } from "@angular/core";
import { Recipe } from "./recipe.model";
import { Ingredient } from "../shared/ingredients.model";
import { ShoppingListService } from "../shopping-list/shopping-list.service";
import { Subject } from "rxjs";

@Injectable()
export class RecipeService {
  private recipes : Recipe[] = [];
  recipeChanged = new Subject<Recipe[]>();
  constructor(private slService : ShoppingListService) {}

  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.recipeChanged.next(this.recipes.slice());
  }

  getRecipes() : Recipe[] {
    return this.recipes.slice();
  }

  getRecipe(id : number) {
    return this.recipes[id];
  }

  addIngredientsToShoppingList(ingredients : Ingredient[]) {
    this.slService.addIngredients(ingredients);
  }

  addRecipe(recipe : Recipe) {
    this.recipes.push(recipe);
    this.recipeChanged.next(this.recipes.slice());
  }

  updateRecipe(index : number, recipe : Recipe) {
    this.recipes[index] = recipe;
    this.recipeChanged.next(this.recipes.slice());
  }

  deleteRecipe(index: number) {
    this.recipes.splice(index, 1);
    this.recipeChanged.next(this.recipes.slice());
  }
}


 // new Recipe('A Tasty Fries Recipe', "This is a loaded fries recipe", "https://static.vecteezy.com/system/resources/previews/036/048/259/non_2x/ai-generated-chili-cheese-fries-on-a-transparent-background-ai-png.png", [new Ingredient('tomato', 2), new Ingredient('potato', 5)]),
  // new Recipe('A Zesty Chicken Recipe', "This is a zesty siracha chicken recipe", "https://png.pngtree.com/png-vector/20230906/ourmid/pngtree-zesty-chicken-halal-food-png-image_9997555.png", [new Ingredient('chicken', 1), new Ingredient('spices', 5), new Ingredient('tomato', 3)]),
  // new Recipe('Sphagetti Bomb', "This is everyone's favorite!", "https://static.vecteezy.com/system/resources/previews/025/065/195/original/spaghetti-with-ai-generated-free-png.png", [new Ingredient('chicken', 1), new Ingredient('spices', 5), new Ingredient('tomato', 3)]),