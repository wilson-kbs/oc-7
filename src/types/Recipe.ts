import {Ingredient} from "./Ingredient.ts";

export type Recipe = {
	id: number;
	name: string;
	description: string;
	time: number;
	image: string;
	servings: number;
	appliance: string;
	ingredients: Ingredient[];
	ustensils: string[];

}
