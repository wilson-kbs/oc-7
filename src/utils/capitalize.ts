export const capitalize = (input: string): string => {
	input = input.trim();
	return input.charAt(0).toUpperCase() + input.slice(1);
}
