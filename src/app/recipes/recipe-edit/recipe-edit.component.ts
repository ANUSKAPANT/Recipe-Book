import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { RecipeService } from '../recipe.service';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrl: './recipe-edit.component.css'
})
export class RecipeEditComponent {
  id! : number;
  editMode! : boolean;
  recipeForm : FormGroup = new FormGroup({});
  initialFormState : any;

  constructor(private route: ActivatedRoute, private router: Router, private recipeService: RecipeService) {}

  ngOnInit() {
    this.route.params.subscribe((params : Params) => {
      this.id = +params['id'];
      this.editMode = params['id'] != null;
      this.initForm();
    })
  }

  private initForm() {
    let recipeName = '';
    let description = '';
    let imagePath = '';
    let recipeIngredients = new FormArray<FormGroup>([]);

    if(this.editMode) {
      let editRecipe = this.recipeService.getRecipe(this.id);
      recipeName = editRecipe.name;
      description = editRecipe.description;
      imagePath = editRecipe.imagePath;
      if(editRecipe['ingredients']) {
        for(let ingredient of editRecipe.ingredients) {
          recipeIngredients.push(
            new FormGroup({
              'name': new FormControl(ingredient.name, Validators.required),
              'amount': new FormControl(ingredient.amount, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
            })
          );
        }
      }
    }

    this.recipeForm = new FormGroup({
      'name': new FormControl(recipeName, Validators.required),
      'description': new FormControl(description, Validators.required),
      'imagePath': new FormControl(imagePath, Validators.required),
      'ingredients': recipeIngredients
    })

    this.initialFormState = this.recipeForm.getRawValue();
  }

  onAddIngrToRecipe() {
    (<FormArray>this.recipeForm.get('ingredients')).push(new FormGroup({
      'name': new FormControl(null, Validators.required),
      'amount': new FormControl(null, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
    }))
  }

  onSubmitRecipe() {
    // const newRecipe = new Recipe(this.recipeForm.value.name, this.recipeForm.value.description, this.recipeForm.value.imagePath, this.recipeForm.value.ingredients);
    if(this.editMode) {
      this.recipeService.updateRecipe(this.id, this.recipeForm.value);
    } else {
      this.recipeService.addRecipe(this.recipeForm.value);
    }
    this.router.navigate(['../'], {relativeTo: this.route});
  }

  onCancel() {
    this.recipeForm.reset(this.initialFormState);
    this.router.navigate(['../'], {relativeTo: this.route});
  }

  removeIngredient(index : number) {
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }
}
