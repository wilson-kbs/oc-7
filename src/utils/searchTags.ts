import {normalize} from "./normalize.ts";

export function searchTags(data: string[], input: string): string[] {
	const normalizedInput = normalize(input);
	return data.filter((tag) => normalize(tag).includes(normalizedInput));
}
