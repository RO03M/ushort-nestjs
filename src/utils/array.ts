export function diff<T = unknown>(arr1: T[], arr2: T[]) {
	if (!Array.isArray(arr1) || !Array.isArray(arr2)) {
		throw new Error("Not every parameter is an array");
	}

	return arr1.filter((x) => !arr2.includes(x));
}

export function intersection<T = unknown>(arr1: T[], arr2: T[]) {
	if (!Array.isArray(arr1) || !Array.isArray(arr2)) {
		throw new Error("Not every parameter is an array");
	}

	return arr1.filter((value) => arr2.includes(value));
}
