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
	const normalizedFilters: Required<Filters> = {
		ingredients: filters.ingredients?.map(normalize) ?? [],
		appliance: filters.appliance?.map(normalize) ?? [],
		ustensils: filters.ustensils?.map(normalize) ?? [],
	}

	return data.reduce<Recipe[]>((arr, recipe) => {
		let validText = false;

		if (normalizedInput.length === 0)
			validText = true;
		else if ([recipe.name, recipe.description].some((text) => normalize(text).includes(normalizedInput)))
			validText = true;

		const ingredientsState = recipe.ingredients.reduce((acc, ingredient) => {
			return {
				validText: acc.validText || normalize(ingredient.ingredient).includes(normalizedInput),
				validFilterCount: acc.validFilterCount + (normalizedFilters.ingredients?.some(filter =>  filter === normalize(ingredient.ingredient)) ? 1 : 0),
			}
		}, {validText, validFilterCount: 0});

		if (ingredientsState.validText)
			validText = true;

		if (ingredientsState.validFilterCount !== normalizedFilters.ingredients.length)
			return arr;

		if (normalizedFilters.appliance.length > 0)
			if (!normalizedFilters.appliance.some(filter => filter === normalize(recipe.appliance)))
				return arr;


		if (normalizedFilters.ustensils.length > 0)
			if (!normalizedFilters.ustensils.every(filter => recipe.ustensils.some(ustensil => normalize(ustensil) === filter)))
				return arr;

		if (validText)
			arr.push(recipe);

		return arr;
	}, [])
}
