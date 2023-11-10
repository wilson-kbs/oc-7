import type {Recipe} from "../types/Recipe.ts";
import {normalize} from "./normalize.ts";

type Filters = {
	ingredients?: string[];
	appliance?: string[];
	ustensils?: string[];
}

type SearchRecipesParams = {
	input: string;
	tags: Filters;
}

export function searchRecipes(data: Recipe[], { input, tags: filters }: SearchRecipesParams): Recipe[] {
	const normalizedInput = normalize(input);

	return data.reduce<Recipe[]>((arr, recipe) => {
		let validText = false;

		if (normalizedInput.length === 0)
			validText = true;
		else if ([recipe.name, recipe.description].some((text) => normalize(text).includes(normalizedInput)))
			validText = true;

		const ingredientsState = recipe.ingredients.reduce((acc, ingredient) => {
			return {
				validText: acc.validText || normalize(ingredient.ingredient).includes(normalizedInput),
				validFilterCount: acc.validFilterCount + (filters.ingredients?.some(filter => normalize(ingredient.ingredient) === normalize(filter)) ? 1 : 0),
			}
		}, {validText, validFilterCount: 0});

		if (ingredientsState.validText)
			validText = true;

		if (ingredientsState.validFilterCount !== filters.ingredients?.length)
			return arr;

		if (filters.appliance && filters.appliance.length > 0)
			if (!filters.appliance.some(filter => normalize(recipe.appliance) === normalize(filter)))
				return arr;


		if (filters.ustensils && filters.ustensils.length > 0)
			if (!filters.ustensils.every(filter => recipe.ustensils.some(ustensil => normalize(ustensil) === normalize(filter.toLowerCase()))))
				return arr;

		if (validText)
			arr.push(recipe);

		return arr;
	}, [])
}
