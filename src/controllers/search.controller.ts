import {SearchComponent} from "../components/search.components.ts";
import {RecipesView} from "../views/recipes.view.ts";
import {searchRecipes} from "../utils/searchRecipes.ts";

export function SearchHandle(component: SearchComponent, recipesView: RecipesView)  {
	component.onInput((value) => {
		console.log(value);
		const recipes = searchRecipes(value);
		recipesView.render(recipes);
	})

}
