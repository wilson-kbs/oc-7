import './style.css'

import {RecipesView} from "./views/recipes.view.ts";
import {SearchComponent} from "./components/search.components.ts";

import recipes from "./data/recipes.ts";
import {getTags, searchRecipes, normalize} from "./utils";
import {TagComponent} from "./components/tag.component.ts";
import {TagsView} from "./views/tags.view.ts";

const RECIPE_CONTAINER = document.querySelector<HTMLDivElement>('#recipes-view')!;
const SEARCH_COMPONENT_SELECTOR = '.header-page .search';

function bootstrap() {
	const searchState = {
		input: "",
		tags: {
			ingredients: [],
			appliance: [],
			ustensils: [],
		} as Record<string, string[]>,
	}

	const cache = {
		tags: {
			ingredients: [],
			appliance: [],
			ustensils: [],
		} as Record<string, string[]>,
		recipes: recipes,
	}

	const tagGroups = Object.keys(cache.tags);

	const globalSearch = new SearchComponent(SEARCH_COMPONENT_SELECTOR);
	const recipesView = new RecipesView(RECIPE_CONTAINER);
	const tagsComponents = tagGroups.reduce<Record<string, TagComponent>>((acc, group) => {
		return {...acc, [group]: new TagComponent(`[data-type=${group}]`)};
	}, {});
	const tagsViews = tagGroups.reduce<Record<string, TagsView>>((acc, group) => {
		return {...acc, [group]: new TagsView(`[data-type=${group}]`)};
	}, {});

	const renderRecipes = () => {
		const result = searchRecipes(recipes, searchState);
		cache.recipes = result;
		cache.tags = getTags(result);
		renderSelectedTags();
		renderUnselectedTags();
		recipesView.render(result, searchState.input);
	}

	const getUnselectedTags = (group: string) => {
		return cache.tags[group].filter((item) =>
			!searchState.tags[group].map(normalize).includes(normalize(item))
		);
	}

	const renderUnselectedTags = (group?: string) => {
		if (group) {
			tagsViews[group].renderUnselectedTags(getUnselectedTags(group));
		} else {
			tagGroups.forEach((tagsGroup) => {
				renderUnselectedTags(tagsGroup);
			});
		}
	}

	const renderSelectedTags = (group?: string) => {
		if (group) {
			tagsViews[group].renderSelectedTags(searchState.tags[group]);
		} else {
			tagGroups.forEach((tagsGroup) => {
				renderSelectedTags(tagsGroup);
			});
		}
	}


	globalSearch.onInput((value) => {
		searchState.input = value;
		if (value.length >= 3) renderRecipes();
		else if (value.length === 0) renderRecipes();
	});

	globalSearch.onSubmit((value) => {
		searchState.input = value;
		renderRecipes();
	});

	globalSearch.onReset(() => {
		searchState.input = "";
		renderRecipes();
	});

	tagGroups.forEach((group) => {
		const component = tagsComponents[group];
		const view = tagsViews[group];

		component.onSearchInput((searchValue) => {
			if (!searchValue) {
				renderUnselectedTags(group);
			} else {
				const normalizedSearchValue = normalize(searchValue);
				const tagsResult = getUnselectedTags(group)
					.filter((tag) => normalize(tag).includes(normalizedSearchValue));

				view.renderUnselectedTags(tagsResult);
			}
		});

		component.onSearchReset(() => {
			renderUnselectedTags(group);
		});


		component.onTagAdd((input) => {
			if (!cache.tags[group].map(normalize).includes(normalize(input))) {
				return;
			}
			searchState.tags[group].push(input);
			renderRecipes();
		});

		component.onTagRemove((input) => {
			searchState.tags[group] = searchState.tags[group].filter((item) => normalize(item) !== normalize(input));
			renderRecipes();
		});
	});

	renderRecipes();
}

bootstrap();
