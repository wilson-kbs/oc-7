import {SearchComponent} from "./search.components.ts";

export class TagComponent {
	private readonly _elContainer: HTMLDivElement;
  private readonly _elSelector: HTMLDivElement;
	private readonly _elSelected: HTMLDivElement;
	private readonly _tags: HTMLDivElement;

	private _focusedTag: Element | null = null;

	private _searchComponent: SearchComponent;

	private _close: Function | null = null;

	constructor(selector: string | HTMLDivElement) {
		if (typeof selector === 'string') {
			this._elContainer = document.querySelector(selector)! as HTMLDivElement;
		} else {
			this._elContainer = selector;
		}

		if (!this._elContainer)
			throw new Error(`Selector "${selector}" not found`);

		this._elSelector = this._elContainer.querySelector('.tags-selector') as HTMLDivElement;
		this._elSelected = this._elContainer.querySelector('.tags-selected') as HTMLDivElement;
		this._tags = this._elSelector.querySelector('.tags') as HTMLDivElement;

		this._searchComponent = new SearchComponent(this._elSelector.querySelector('.search') as HTMLDivElement);

		this._addEventListeners();
	}

	private _setFocusTag(tag: Element | string | null) {
		tag = typeof tag === 'string' ? this._tags.querySelector(tag) : tag;
		if (!tag) return;
		this._tags.querySelectorAll('.tags__option.focus').forEach((option) => {
			option.classList.remove('focus');
		});

		tag.classList.add('focus');
		tag.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
		this._focusedTag = tag;
	}

	private _onKeyDown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			event.preventDefault();
			const option = this._tags.querySelector<HTMLDivElement>('.tags__option.focus')
			option?.click();
		} else if (['ArrowDown', 'ArrowUp', 'Tab'].includes(event.key)) {
			event.preventDefault();

			const isUp = event.key === 'Tab' ? event.shiftKey : event.key === 'ArrowUp';
			const setLastOrFirstTag = () => this._setFocusTag(isUp ? ':last-child' : ':first-child')

			const option = this._tags.querySelector('.tags__option.focus')
				|| this._tags.querySelector('.tags__option:hover');
			if (!option)
				return setLastOrFirstTag();

			let nextOption = isUp ? option.previousElementSibling : option.nextElementSibling;
			if (nextOption) {
				this._setFocusTag(nextOption);
			} else {
				setLastOrFirstTag();
			}
		}
	}

	private _addEventListeners() {
		const tagsHeader = this._elSelector.querySelector('.tags-selector__header');
		tagsHeader?.addEventListener('click', () => {
			if (!this._elSelector.classList.contains('open')) {
				this._elSelector.classList.add('open');

				const input = this._elSelector.querySelector<HTMLInputElement>('input');
				const form = this._elSelector.querySelector<HTMLFormElement>('form');
				input?.focus();

				const signal = new AbortController();

				input?.addEventListener('keydown', (event) => this._onKeyDown(event),{signal: signal.signal});
				this._setFocusTag(':first-child');

				this._tags.addEventListener('mousemove', (event) => {
					if (this._focusedTag !== event.target) {
						this._setFocusTag(event.target as Element);
					}
				});

				const close = () => {
					this._close = null;
					this._elSelector.classList.remove('open');
					input?.blur();
					form?.reset();

					signal.abort();
				}
				this._close = close;



				window.addEventListener(
					'click',
					(event) => !event.target ? close() : (!this._elSelector.contains(event.target as Node)) && close(),
					{signal: signal.signal});

				window.addEventListener(
					'keydown',
					(event) => (event.key === 'Escape') &&	close(),
					{signal: signal.signal});

				window.addEventListener(
					'blur',
					(event) => !event.target ? close() : (!this._elSelector.contains(event.target as Node)) && close(),
					{signal: signal.signal});

				window.addEventListener('resize', () => close(), {signal: signal.signal});
				window.addEventListener('orientationchange', () => close(), {signal: signal.signal});
				window.addEventListener('fullscreenchange', () => close(), {signal: signal.signal});
			} else {
				this._elSelector.classList.remove('open');
				this._close?.();
			}
		});
	}

	onSearchInput(callback: (value: string) => void) {
		this._searchComponent.onInput(callback);
		this._searchComponent.onSubmit(callback);
	}
	onSearchReset(callback: (event: Event) => void) {
		this._searchComponent.onReset(callback);
	}


	onTagAdd(callback: (tag: string) => void) {
		const tags = this._elSelector.querySelector('.tags');
		tags?.addEventListener('click', (event) => {
			const target = event.target as HTMLElement;
			if (target.classList.contains('tags__option')) {
				callback(target.textContent!);
				this._close?.();
			}
		});
	}

	onTagRemove(callback: (tag: string) => void) {
		const isClosedButton = (target: HTMLElement) => {
			return target.classList.contains('tags-selected__item__close') || target.closest('.tags-selected__item__close');
		}

		this._elSelected?.addEventListener('click', (event) => {
			if (isClosedButton(event.target as HTMLElement)) {
				const target = event.target as HTMLElement;
				const tag = target.closest('.tags-selected__item')?.querySelector('.tags-selected__item__name')?.textContent!;
				callback(tag);
			}
		});
	}
}
