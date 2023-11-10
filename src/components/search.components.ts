export class SearchComponent {


	private _el: HTMLDivElement;

	constructor(selector: string | HTMLDivElement) {
		if (typeof selector === 'string')
		this._el = document.querySelector(selector) as HTMLDivElement;
		else
		this._el = selector;

		if (!this._el)
			throw new Error(`Selector "${selector}" not found`);

		this._addEvent();
	}

	private _addEvent() {
		this._el.querySelector('input')?.addEventListener('input', () => {
			if (this.getValue().length > 0)
				this._el.querySelector('form')?.setAttribute('data-show', 'reset-button');
			else
				this._el.querySelector('form')?.removeAttribute('data-show');
		});
	}

	getValue() {
		return this._el.querySelector("input")?.value || "";
	}

	setValue(value: string) {
		this._el.querySelector("input")!.value = value;
	}

	onInput(callback: (value: string) => void) {
		const input = this._el.querySelector<HTMLInputElement>('input');
		input?.addEventListener('input', () => {
			callback(input.value);
		});
	}

	onSubmit(callback: (value: string) => void) {
		const form = this._el.querySelector<HTMLFormElement>('form');
		form?.addEventListener('submit', (event) => {
			event.preventDefault();
			callback(this.getValue());
		});
	}

	onReset(callback: (event: Event) => void) {
		const form = this._el.querySelector<HTMLFormElement>('form');
		form?.addEventListener('reset', (event) => {

			callback(event);
		});
	}
}
