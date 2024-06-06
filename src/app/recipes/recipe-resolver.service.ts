import { Injectable } from "@angular/core";
import { RecipeService } from "./recipe.service";
import { ActivatedRouteSnapshot, MaybeAsync, Resolve, RouterStateSnapshot } from "@angular/router";
import { Recipe } from "./recipe.model";
import { DataStorageService } from "../shared/data-storage.service";

@Injectable({ providedIn: "root"})
export class RecipeResolverService implements Resolve<Recipe[]> {
  constructor(private recipeService: RecipeService, private dataStorage : DataStorageService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const recipes = this.recipeService.getRecipes();
    if(recipes.length === 0) {
      return this.dataStorage.fetchRecipes();
    }
    return recipes;
  }
}