export function normalize(input: string): string {
	return input.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().replace(/[^a-z0-9]+/ig,"-");
}
