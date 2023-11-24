import {Recipe} from "../types/Recipe.ts";

export class RecipesView {
	private domNode: HTMLElement;
	constructor(selector: string | HTMLElement) {
		if (typeof selector === 'string')
			this.domNode = document.querySelector(selector) as HTMLElement;
		else
			this.domNode = selector;
	}

	render(data: Recipe[], input: string) {
		if (data.length === 0) {
			this.domNode.setAttribute('data-view', 'not-found');
			this.domNode.innerHTML = `
				<span>Aucune recette ne contient ‘${input}’ vous pouvez chercher « tarte aux pommes », « poisson », etc.</span>
			`;
			return;
		}
		this.domNode.removeAttribute('data-view');
		const result = data.map((recipe) => {
			return `
				<div class="recipe-card">
					<div class="recipe-card-image">
						<img src="/images/recipes/small/${recipe.image}" alt="${recipe.name}" />
					</div>
					<div class="recipe-card-content">
						<h3>${recipe.name}</h3>
						<div class="recipe-card-content-section description">
							<h4>RECETTE</h4>
							<p>${recipe.description}</p>
						</div>
						<div class="recipe-card-content-section ingredients">
							<h4>Ingredients</h4>
							<ul class="ingredient-list">
								${recipe.ingredients.map((ingredient) => `
									<li>
										<span class="ingredient-name">${ingredient.ingredient}</span>
										${ingredient.quantity ? `
											<span class="ingredient-quantity">
												${ingredient.quantity}
												${ingredient.unit ?? ""}
											</span>
										`: ""}
									</li>
								`).join('')}
							</ul>
						</div>
					</div>
					<div class="recipe-time">${recipe.time}min</div>
				</div>
			`;
		});

		document.querySelector("#recipes-count")!.innerHTML = `${data.length}`;

		this.domNode.innerHTML = result.join('\n');
	}
}
