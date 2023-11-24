import {capitalize} from "../utils/capitalize.ts";

type Tag = string
export class TagsView {
	private readonly _elContainer: HTMLDivElement;
	private _elSelector: HTMLDivElement;
	private _elSelected: HTMLDivElement;
	constructor(selector: string | HTMLDivElement) {
		if (typeof selector === 'string')
			this._elContainer = document.querySelector(selector) as HTMLDivElement;
		else
			this._elContainer = selector;

		if (!this._elContainer)
			throw new Error(`Selector "${selector}" not found`);

		this._elSelector = this._elContainer.querySelector('.tags-selector') as HTMLDivElement;
		this._elSelected = this._elContainer.querySelector('.tags-selected') as HTMLDivElement;
	}
	renderUnselectedTags(tags: Tag[]) {
		if (tags.length === 0) {
			this._elSelector.querySelector(".tags")!.innerHTML = `
				<span class="tags__not-found">Aucun résultat</span>
			`;
			return;
		}
		const result = tags.map((tag) => {
			return `
				<span class="tags__option">${capitalize(tag)}</span>
			`;
		});
		this._elSelector.querySelector(".tags")!.innerHTML = result.join('\n');
	}

	renderSelectedTags(tags: Tag[]) {
		const result = tags.map((tag) => {
			return `
				<div class="tags-selected__item">
          <span class="tags-selected__item__name">${capitalize(tag)}</span>
          <span class="tags-selected__item__close">
            <i class="fas fa-times"></i>
          </span>
        </div>
			`;
		});

		this._elSelected.innerHTML = result.join('\n');
	}
}
