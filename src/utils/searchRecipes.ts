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
	const result = [];
	const normalizedFilters: Required<Filters> = {
		ingredients: [],
		appliance: [],
		ustensils: []
	};

	if (filters.ingredients) {
		for (let i = 0; i < filters.ingredients.length; i++) {
			normalizedFilters.ingredients.push(normalize(filters.ingredients[i]));
		}
	}
	if (filters.appliance) {
		for (let i = 0; i < filters.appliance.length; i++) {
			normalizedFilters.appliance.push(normalize(filters.appliance[i]));
		}
	}
	if (filters.ustensils) {
		for (let i = 0; i < filters.ustensils.length; i++) {
			normalizedFilters.ustensils.push(normalize(filters.ustensils[i]));
		}
	}

	for (let i = 0; i < data.length; i++) {
		const recipe = data[i];
		let validText = normalizedInput.length === 0
			|| normalize(recipe.name).includes(normalizedInput)
			|| normalize(recipe.description).includes(normalizedInput);
		let ingredientFilterCount = 0;

		for (let j = 0; j < recipe.ingredients.length; j++) {
			const ingredient = normalize(recipe.ingredients[j].ingredient);
			if (!validText && ingredient.includes(normalizedInput)) {
				validText = true;
			}
			for (let k = 0; k < normalizedFilters.ingredients.length; k++) {
				if (ingredient === normalizedFilters.ingredients[k]) {
					ingredientFilterCount++;
					break;
				}
			}
		}

		if (ingredientFilterCount !== normalizedFilters.ingredients.length) {
			continue;
		}

		let applianceMatch = !normalizedFilters.appliance.length || normalizedFilters.appliance.includes(normalize(recipe.appliance));

		let ustensilMatch = !normalizedFilters.ustensils.length;
		for (let j = 0; j < recipe.ustensils.length && !ustensilMatch; j++) {
			let ustensil = normalize(recipe.ustensils[j]);
			for (let k = 0; k < normalizedFilters.ustensils.length; k++) {
				if (ustensil === normalizedFilters.ustensils[k]) {
					ustensilMatch = true;
					break;
				}
			}
		}

		if (applianceMatch && ustensilMatch && validText) {
			result.push(recipe);
		}
	}

	return result;
}
