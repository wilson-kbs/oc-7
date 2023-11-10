import {Recipe} from "../types/Recipe.ts";
import {normalize} from "./normalize.ts";

export type RecipeTags = {
	[key: string]: string[];
	appliance: string[];
	ingredients: string[];
	ustensils: string[];
}

type NormalizedRecipeTag = string

type SetRecipeTags = {
	appliance: string[];
	ingredients: string[];
	ustensils: string[];
}
export function getTags(recipes: Recipe[]): RecipeTags {
	const sets = {
		appliance: new Set<NormalizedRecipeTag>(),
		ustensils: new Set<NormalizedRecipeTag>(),
		ingredients: new Set<NormalizedRecipeTag>(),
	};

	return recipes.reduce<SetRecipeTags>((acc, recipe) => {
		recipe.ingredients.forEach((ingredient) => {
			const normalizedIngredient = normalize(ingredient.ingredient);
			if (sets.ingredients.has(normalizedIngredient)) return;
			sets.ingredients.add(normalizedIngredient);
			acc.ingredients.push(ingredient.ingredient);
		});

		const normalizedAppliance = normalize(recipe.appliance);
		if (!sets.appliance.has(normalizedAppliance)) {
			sets.appliance.add(normalizedAppliance);
			acc.appliance.push(recipe.appliance);
		}

		recipe.ustensils.forEach((ustensil) => {
			const normalizedUstensil = normalize(ustensil);
			if (sets.ustensils.has(normalizedUstensil)) return;
			sets.ustensils.add(normalizedUstensil);
			acc.ustensils.push(ustensil);
		});

		return acc;
	}, {
		appliance: [],
		ustensils: [],
		ingredients: [],
	});
}
